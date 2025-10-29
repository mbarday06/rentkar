import Partner from "@/app/server/models/Partner";
import { connectMongo } from "@/app/server/db";
import { redis, pub } from "@/app/server/redis";

export async function updateGPS(partnerId: string, lat: number, lng: number) {
  await connectMongo();

  // Rate-limit (max 6/min)
  const bucket = `ratelimit:partner:${partnerId}:gps:${Math.floor(Date.now() / 60_000)}`;
  const count = await redis.incr(bucket);
  if (count === 1) await redis.expire(bucket, 65);
  if (count > 6) throw new Error("Rate limit exceeded (max 6/min)");

  // ✅ Update MongoDB (keep same schema)
  await Partner.updateOne(
    { _id: partnerId },
    { $set: { location: { lat, lng } } }
  );

  // ✅ Publish to Redis (triggers SSE → GpsTable)
  await pub.publish(
    "partner:gps",
    JSON.stringify({
      partnerId,
      lat,
      lng,
      ts: Date.now(),
    })
  );
}
