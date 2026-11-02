import {
  createClient,
  type Client,
  type Transaction,
  type TransactionMode,
} from '@libsql/client';
import { drizzle } from 'drizzle-orm/libsql';

import type { DbConfig } from './types';

const isCloudflareWorker =
  typeof globalThis !== 'undefined' && 'Cloudflare' in globalThis;

// libsql's local file driver hands each transaction (and batch) its own
// connection, with no busy timeout. Overlapping ones in one process fail with
// SQLITE_BUSY ("database is locked" / "SQL statements in progress"), e.g.
// concurrent /api/ai/task polls running expireTimedOutTasks. Queue them.
const LOCAL_TX_WAIT_MS = 10_000;

function serializeLocalTransactions(client: Client): Client {
  let tail: Promise<void> = Promise.resolve();

  const acquire = async () => {
    let release!: () => void;
    const next = new Promise<void>((resolve) => (release = resolve));
    const prev = tail;
    tail = prev.then(() => next);
    // A nested db().transaction() inside a transaction would wait forever;
    // stop waiting after a while and fall back to the old unqueued behavior.
    await Promise.race([
      prev,
      new Promise((resolve) => setTimeout(resolve, LOCAL_TX_WAIT_MS)),
    ]);
    let released = false;
    return () => {
      if (released) return;
      released = true;
      release();
    };
  };

  const transaction = client.transaction.bind(client);
  client.transaction = (async (mode?: TransactionMode) => {
    const release = await acquire();
    let tx: Transaction;
    try {
      tx = await transaction(mode);
    } catch (error) {
      release();
      throw error;
    }
    for (const method of ['commit', 'rollback'] as const) {
      const original = tx[method].bind(tx);
      tx[method] = async () => {
        try {
          return await original();
        } finally {
          release();
        }
      };
    }
    const close = tx.close.bind(tx);
    tx.close = () => {
      try {
        close();
      } finally {
        release();
      }
    };
    return tx;
  }) as Client['transaction'];

  const batch = client.batch.bind(client);
  client.batch = (async (...args: Parameters<Client['batch']>) => {
    const release = await acquire();
    try {
      return await batch(...args);
    } finally {
      release();
    }
  }) as Client['batch'];

  return client;
}

function createLocalAwareClient(url: string, options: Record<string, string>) {
  const client = createClient({ url, ...options });
  return url.startsWith('file:') ? serializeLocalTransactions(client) : client;
}

// SQLite/libsql singleton
let sqliteDbInstance: ReturnType<typeof drizzle> | null = null;

export function createSqliteDb(config: DbConfig) {
  const databaseUrl = config.database_url;
  if (!databaseUrl) {
    throw new Error('DATABASE_URL is not set');
  }

  const options: Record<string, string> = {};
  if (config.database_auth_token) {
    options.authToken = config.database_auth_token;
  }

  // In Cloudflare Workers, create new connection each time
  if (isCloudflareWorker) {
    const client = createClient({
      url: databaseUrl,
      ...options,
    });
    return drizzle({ client });
  }

  // Singleton mode: reuse existing instance
  if (config.db_singleton_enabled === 'true') {
    if (sqliteDbInstance) return sqliteDbInstance;

    const client = createLocalAwareClient(databaseUrl, options);
    sqliteDbInstance = drizzle({ client });
    return sqliteDbInstance;
  }

  // Non-singleton mode: create new connection each time
  const client = createLocalAwareClient(databaseUrl, options);
  return drizzle({ client });
}
