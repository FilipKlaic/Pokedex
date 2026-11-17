type CacheEntry<T> = {
  createdAt: number;
  value: T;
};

export class Cache<T> {
  private entries = new Map<string, CacheEntry<T>>();

  constructor(private readonly ttlMs: number) {}

  add(key: string, value: T): void {
    this.entries.set(key, { createdAt: Date.now(), value });
  }

  get(key: string): T | undefined {
    const entry = this.entries.get(key);
    if (!entry) {
      return undefined;
    }

    const age = Date.now() - entry.createdAt;
    if (age > this.ttlMs) {
      this.entries.delete(key);
      return undefined;
    }

    return entry.value;
  }
}
