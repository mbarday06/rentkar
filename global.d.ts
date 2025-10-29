// Fix for missing types from redlock's ESM exports
declare module "redlock" {
  import type { Redis } from "ioredis";

  export interface RedlockOptions {
    driftFactor?: number;
    retryCount?: number;
    retryDelay?: number;
    retryJitter?: number;
    automaticExtensionThreshold?: number;
  }

  export default class Redlock {
    constructor(clients: Redis[], options?: RedlockOptions);
    acquire(resource: string[], ttl: number): Promise<unknown>;
    release(lock: unknown): Promise<void>;
    using<T>(resources: string[], ttl: number, fn: () => Promise<T>): Promise<T>;
  }
}
