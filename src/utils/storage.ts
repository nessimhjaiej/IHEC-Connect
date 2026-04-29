export const storage = {
  get: <T>(key: string): T | null => {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : null;
    } catch {
      return null;
    }
  },
  set: <T>(key: string, value: T): void => {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      console.warn('Storage write failed');
    }
  },
  remove: (key: string): void => {
    localStorage.removeItem(key);
  },
};
