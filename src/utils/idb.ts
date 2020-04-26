import { openDB, IDBPDatabase, DBSchema } from 'idb';

import { generateKey } from './crypto';

interface LibreOTPDB extends DBSchema {
  accounts: {
    key: number;
    value: {
      id: number;
      iv: Uint8Array;
      data: ArrayBuffer;
    };
  };
  keys: {
    key: number;
    value: CryptoKey;
  };
}

function upgrade(database: IDBPDatabase<LibreOTPDB>): void {
  database.createObjectStore('accounts', {
    keyPath: 'id',
    autoIncrement: true,
  });

  database.createObjectStore('keys');
}

export async function openDatabase(): Promise<IDBPDatabase<LibreOTPDB>> {
  const database = await openDB<LibreOTPDB>('libreotp', 1, {
    upgrade,
  });

  const key = await database.get('keys', 1);

  if (!key) {
    const key = await generateKey();
    await database.put('keys', key, 1);
  }

  return database;
}
