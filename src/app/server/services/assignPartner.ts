import { redlock } from "@/app/server/redis";
import Booking from "@/app/server/models/Booking";
import Partner from "@/app/server/models/Partner";
import { connectMongo } from "@/app/server/db";

// Helper: distance between 2 coordinates (km)
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
  const R = 6371;
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1 * Math.PI / 180) *
    Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
}

export async function assignPartner(bookingId: string) {
  await connectMongo();

  // 🔒 Redlock ensures concurrency safety
  return await redlock.using([`locks:booking:${bookingId}:assign`], 10_000, async () => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    // Already assigned → return immediately
    if (booking.partnerId) {
      return {
        message: "Already assigned",
        partnerId: booking.partnerId,
        bookingId: booking._id,
      };
    }

    // Find all online partners
    const partners = await Partner.find({ city: booking.location, status: "online" });
    if (!partners.length) throw new Error("No online partners in this city");

    // Find nearest partner
    const { latitude, longitude } = booking.address;
    let nearest = partners[0];
    let minDist = Infinity;

    for (const p of partners) {
      const dist = calculateDistance(latitude, longitude, p.location.lat, p.location.lng);
      if (dist < minDist) {
        minDist = dist;
        nearest = p;
      }
    }

    // ✅ Atomic guard: only assign if still unassigned
    const result = await Booking.updateOne(
      { _id: bookingId, $or: [{ partnerId: null }, { partnerId: { $exists: false } }] },
      { $set: { partnerId: nearest._id } }
    );

    // If another admin already assigned
    if (result.matchedCount === 0) {
      const fresh = await Booking.findById(bookingId);
      return {
        message: "Already assigned",
        partnerId: fresh?.partnerId,
        bookingId: bookingId,
      };
    }

    return {
      message: "Partner assigned successfully",
      partnerId: nearest._id,
      bookingId: booking._id,
    };
  });
}
