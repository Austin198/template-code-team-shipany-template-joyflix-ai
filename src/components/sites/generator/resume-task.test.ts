import { describe, expect, it } from 'vitest';

import { decideRestore, RESUMABLE_TASK_MAX_AGE_MS } from './resume-task';

const now = 1_000_000_000;
const min = 60 * 1000;

describe('decideRestore', () => {
  it('resumes the newest unfinished task of the page media type', () => {
    const decision = decideRestore(
      [
        {
          id: 'v1',
          mediaType: 'video',
          status: 'pending',
          createdAt: now - min,
        },
        {
          id: 'a',
          mediaType: 'image',
          status: 'pending',
          createdAt: now - 5 * min,
        },
        {
          id: 'b',
          mediaType: 'image',
          status: 'processing',
          createdAt: now - 2 * min,
        },
        {
          id: 'b',
          mediaType: 'image',
          status: 'processing',
          createdAt: now - 2 * min,
        },
      ],
      'image',
      null,
      now
    );
    expect(decision).toEqual({
      kind: 'resume',
      task: expect.objectContaining({ id: 'b' }),
      deadline: now - 2 * min + RESUMABLE_TASK_MAX_AGE_MS,
    });
  });

  it('does not resume a task past the server expiry window', () => {
    expect(
      decideRestore(
        [
          {
            id: 'old',
            mediaType: 'video',
            status: 'processing',
            createdAt: now - RESUMABLE_TASK_MAX_AGE_MS,
          },
        ],
        'video',
        null,
        now
      )
    ).toBeNull();
  });

  it('shows the hinted task when it finished while the page was away', () => {
    const hint = { id: 'h', userId: 'u', createdAt: now - min };
    expect(
      decideRestore(
        [
          {
            id: 'h',
            mediaType: 'image',
            status: 'success',
            url: 'https://x/y.png',
          },
        ],
        'image',
        hint,
        now
      )
    ).toEqual({ kind: 'show', task: expect.objectContaining({ id: 'h' }) });
    expect(
      decideRestore(
        [{ id: 'h', mediaType: 'image', status: 'failed' }],
        'image',
        hint,
        now
      )?.kind
    ).toBe('failed');
  });

  it('ignores finished tasks without a matching hint', () => {
    expect(
      decideRestore(
        [{ id: 'done', mediaType: 'image', status: 'success', url: 'u' }],
        'image',
        null,
        now
      )
    ).toBeNull();
  });
});
