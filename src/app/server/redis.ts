import Redis from "ioredis";
import Redlock from "redlock";
export const redis = new Redis(process.env.REDIS_URL!);
export const pub   = new Redis(process.env.REDIS_URL!);
export const sub   = new Redis(process.env.REDIS_URL!);
export const redlock = new Redlock([redis], { retryCount: 8, retryDelay: 100, driftFactor: 0.01 });
