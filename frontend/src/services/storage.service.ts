/**
 * Service for handling browser storage (localStorage)
 */
export class StorageService {
  /**
   * Get item from localStorage
   * @param key Storage key
   * @returns Stored value or null if not found
   */
  getItem(key: string): string | null {
    return localStorage.getItem(key);
  }

  /**
   * Set item in localStorage
   * @param key Storage key
   * @param value Value to store
   */
  setItem(key: string, value: string): void {
    localStorage.setItem(key, value);
  }

  /**
   * Remove item from localStorage
   * @param key Storage key
   */
  removeItem(key: string): void {
    localStorage.removeItem(key);
  }

  /**
   * Clear all items from localStorage
   */
  clear(): void {
    localStorage.clear();
  }
} 