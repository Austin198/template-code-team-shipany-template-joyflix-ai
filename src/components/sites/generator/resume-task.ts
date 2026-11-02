import { useEffect, useRef } from 'react';

// Matches expireTimedOutTasks(): the server fails (and refunds) anything still
// pending/processing after 20 minutes, so never resume or poll past that.
export const RESUMABLE_TASK_MAX_AGE_MS = 20 * 60 * 1000;

const ACTIVE_STATUSES = new Set(['pending', 'processing']);
const HINT_KEY_PREFIX = 'joyflix_active_task_';

export type GeneratorMediaType = 'image' | 'video';

export interface RestorableTask {
  id?: string;
  mediaType?: string;
  status?: string;
  url?: string;
  prompt?: string;
  model?: string;
  visibility?: string;
  createdAt?: number | string;
}

export interface ActiveTaskHint {
  id: string;
  userId: string;
  createdAt: number;
}

export type RestoreDecision =
  | { kind: 'resume'; task: RestorableTask; deadline: number }
  | { kind: 'show'; task: RestorableTask }
  | { kind: 'failed'; task: RestorableTask }
  | null;

function createdAtMs(task: RestorableTask): number {
  const value =
    typeof task.createdAt === 'number'
      ? task.createdAt
      : new Date(task.createdAt || 0).getTime();
  return Number.isFinite(value) ? value : 0;
}

/**
 * Decide what the generator should do on mount, from the server's list of the
 * user's recent tasks (source of truth) plus an optional same-browser hint of
 * the task this page last started.
 * - newest unfinished task within the max age → resume polling it
 * - otherwise, the hinted task finished while the page was away → show it
 */
export function decideRestore(
  items: RestorableTask[],
  mediaType: GeneratorMediaType,
  hint: ActiveTaskHint | null,
  now = Date.now(),
  maxAgeMs = RESUMABLE_TASK_MAX_AGE_MS
): RestoreDecision {
  const seen = new Set<string>();
  const tasks = items.filter((task) => {
    if (!task?.id || seen.has(task.id)) return false;
    seen.add(task.id);
    return task.mediaType === mediaType;
  });

  const resumable = tasks
    .filter((task) => {
      const age = now - createdAtMs(task);
      return (
        ACTIVE_STATUSES.has(String(task.status)) && age >= 0 && age < maxAgeMs
      );
    })
    .sort((a, b) => createdAtMs(b) - createdAtMs(a))[0];
  if (resumable) {
    return {
      kind: 'resume',
      task: resumable,
      deadline: createdAtMs(resumable) + maxAgeMs,
    };
  }

  if (!hint || now - hint.createdAt >= maxAgeMs) return null;
  const hinted = tasks.find((task) => task.id === hint.id);
  if (hinted?.status === 'success' && hinted.url) {
    return { kind: 'show', task: hinted };
  }
  if (hinted?.status === 'failed') return { kind: 'failed', task: hinted };
  return null;
}

function hintKey(mediaType: GeneratorMediaType) {
  return `${HINT_KEY_PREFIX}${mediaType}`;
}

export function writeActiveTaskHint(
  mediaType: GeneratorMediaType,
  hint: ActiveTaskHint
) {
  try {
    localStorage.setItem(hintKey(mediaType), JSON.stringify(hint));
  } catch {}
}

export function clearActiveTaskHint(mediaType: GeneratorMediaType) {
  try {
    localStorage.removeItem(hintKey(mediaType));
  } catch {}
}

export function readActiveTaskHint(
  mediaType: GeneratorMediaType,
  userId: string
): ActiveTaskHint | null {
  try {
    const raw = localStorage.getItem(hintKey(mediaType));
    if (!raw) return null;
    const hint = JSON.parse(raw) as ActiveTaskHint;
    // A hint left by another account on this browser is not ours.
    if (!hint?.id || hint.userId !== userId) return null;
    return hint;
  } catch {
    return null;
  }
}

/**
 * Once per signed-in user, look up their recent tasks and hand the decision
 * to the page. Never submits or charges anything; it only reads.
 */
export function useRestoreGenerationTask({
  mediaType,
  userId,
  isBusy,
  onDecision,
}: {
  mediaType: GeneratorMediaType;
  userId?: string;
  /** True while this page is already generating (skip restoring). */
  isBusy: () => boolean;
  onDecision: (decision: NonNullable<RestoreDecision>) => void;
}) {
  const onDecisionRef = useRef(onDecision);
  onDecisionRef.current = onDecision;
  const isBusyRef = useRef(isBusy);
  isBusyRef.current = isBusy;

  useEffect(() => {
    if (!userId) return;
    let cancelled = false;
    void (async () => {
      try {
        const res = await fetch(
          `/api/ai/creations?mediaType=${mediaType}&limit=20`
        );
        const json = await res.json();
        if (cancelled || json?.code !== 0) return;
        const items = Array.isArray(json?.data?.items) ? json.data.items : [];
        // A generation started on this page meanwhile owns the slot.
        if (cancelled || isBusyRef.current()) return;
        const decision = decideRestore(
          items,
          mediaType,
          readActiveTaskHint(mediaType, userId)
        );
        if (decision?.kind !== 'resume') clearActiveTaskHint(mediaType);
        if (decision) onDecisionRef.current(decision);
      } catch {
        // Restoring is best-effort; the task still lives in My Creations.
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [mediaType, userId]);
}
