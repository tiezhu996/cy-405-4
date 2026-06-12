import { exportBackup, importBackup, readStorage, storageKeys, writeStorage } from '@/utils/storage';
import type { StorageKey } from '@/utils/storage';

export function loadCollection<T>(key: StorageKey, fallback: T): T {
  return readStorage<T>(key, fallback);
}

export function saveCollection<T>(key: StorageKey, value: T): void {
  writeStorage<T>(key, value);
}

export function downloadBackup(): void {
  const blob = new Blob([exportBackup()], { type: 'application/json;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `interview-board-backup-${new Date().toISOString().slice(0, 10)}.json`;
  link.click();
  URL.revokeObjectURL(url);
}

export async function loadBackupFile(file: File): Promise<void> {
  const raw = await file.text();
  importBackup(raw);
}

export { storageKeys };
