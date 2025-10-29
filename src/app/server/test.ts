import Redis from "ioredis";
import Redlock from "redlock";

const redis = new Redis();
const redlock = new Redlock([redis]);
console.log("✅ Redlock initialized");
