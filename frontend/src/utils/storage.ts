const STORAGE_PREFIX = 'interview-schedule-board';

export const storageKeys = {
  companies: `${STORAGE_PREFIX}:companies`,
  positions: `${STORAGE_PREFIX}:positions`,
  interviews: `${STORAGE_PREFIX}:interviews`,
  reflections: `${STORAGE_PREFIX}:reflections`,
  theme: `${STORAGE_PREFIX}:theme`
} as const;

export type StorageKey = (typeof storageKeys)[keyof typeof storageKeys];

function cloneValue<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function readStorage<T>(key: StorageKey | string, fallback: T): T {
  if (typeof window === 'undefined') {
    return cloneValue(fallback);
  }

  const raw = window.localStorage.getItem(key);
  if (!raw) {
    return cloneValue(fallback);
  }

  try {
    return JSON.parse(raw) as T;
  } catch {
    return cloneValue(fallback);
  }
}

export function writeStorage<T>(key: StorageKey | string, value: T): void {
  if (typeof window === 'undefined') {
    return;
  }

  window.localStorage.setItem(key, JSON.stringify(value));
}

export function removeStorage(key: StorageKey | string): void {
  if (typeof window !== 'undefined') {
    window.localStorage.removeItem(key);
  }
}

export function exportBackup(): string {
  const payload = Object.values(storageKeys).reduce<Record<string, unknown>>((acc, key) => {
    acc[key] = readStorage<unknown>(key, null);
    return acc;
  }, {});

  return JSON.stringify(
    {
      app: STORAGE_PREFIX,
      version: 1,
      exportedAt: new Date().toISOString(),
      payload
    },
    null,
    2
  );
}

export function importBackup(raw: string): void {
  const backup = JSON.parse(raw) as { payload?: Record<string, unknown> };
  if (!backup.payload) {
    throw new Error('备份文件缺少 payload 字段');
  }

  Object.entries(backup.payload).forEach(([key, value]) => {
    if (Object.values(storageKeys).includes(key as StorageKey)) {
      writeStorage(key, value);
    }
  });
}
