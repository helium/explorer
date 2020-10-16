export function formatNumber(x: number) {
  return x?.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",") ?? "";
}

const LOCAL_STORAGE_PREFIX = "helium:";

function safeJSONParse(value: string): string {
  try {
    return JSON.parse(value);
  } catch (e) {
    console.error(e);
    return "";
  }
}

export function getLocalStorageItem<T>(key: string, defaultValue?: T): T {
  const value = window.localStorage.getItem(`${LOCAL_STORAGE_PREFIX}${key}`);
  return (safeJSONParse(value) || defaultValue) as T;
}

export function setLocalStorageItem<T>(
  key: string,
  defaultValue: T,
  apply: (data: T) => T,
): void {
  const prefixedKey = `${LOCAL_STORAGE_PREFIX}${key}`;
  const current = getLocalStorageItem<T>(prefixedKey, defaultValue);
  window.localStorage.setItem(prefixedKey, JSON.stringify(apply(current)));
}

export function clearLocalStorageItem(key: string) {
  window.localStorage.removeItem(`${LOCAL_STORAGE_PREFIX}${key}`);
}
