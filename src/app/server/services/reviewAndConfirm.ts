import { redlock, pub } from "@/app/server/redis";
import Booking from "@/app/server/models/Booking";
import Partner from "@/app/server/models/Partner";
import { connectMongo } from "@/app/server/db";

/**
 * Safely confirms a booking and publishes an event.
 * Uses Redlock to prevent double-confirmation.
 */
export async function confirmBooking(bookingId: string) {
  await connectMongo();

  return await redlock.using([`locks:booking:${bookingId}:confirm`], 10_000, async () => {
    const booking = await Booking.findById(bookingId);
    if (!booking) throw new Error("Booking not found");

    // ✅ if already confirmed, just return success instead of throwing error
    if (booking.status === "confirmed") {
      return {
        message: "Booking already confirmed",
        partnerId: booking.partnerId,
        bookingId: booking._id,
      };
    }

    if (!booking.partnerId) {
      throw new Error("No partner assigned");
    }

    const allApproved = booking.document.every((d: { status: string }) => d.status === "APPROVED");
    if (!allApproved) {
      throw new Error("All documents must be APPROVED before confirmation");
    }

    // ✅ Verify partner exists
    const partner = await Partner.findById(booking.partnerId);
    if (!partner) {
      throw new Error("Partner not found");
    }

    // ✅ Update booking status
    booking.status = "confirmed";
    await booking.save();

    // ✅ Publish real-time event for SSE
    await pub.publish(
      "booking:confirmed",
      JSON.stringify({
        bookingId: booking._id,
        partnerId: partner._id,
        location: booking.location,
        ts: Date.now(),
      })
    );

    return {
      message: "Booking confirmed successfully",
      partnerId: partner._id,
      bookingId: booking._id,
    };
  });
}
