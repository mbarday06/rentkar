import { NextResponse } from "next/server";
import { confirmBooking } from "@/app/server/services/reviewAndConfirm";

/**
 * Handles POST /api/bookings/[id]/confirm
 * Calls the confirmBooking service which safely updates and broadcasts booking confirmation.
 */
export async function POST(
  _req: Request,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const result = await confirmBooking(id);

    // result can be either a string (partnerId) or an object with details
    if (!result) {
      return NextResponse.json(
        { message: "Unexpected empty response" },
        { status: 500 }
      );
    }

    // Normalize result from service layer
    if (typeof result === "object") {
      return NextResponse.json(result, { status: 200 });
    }

    // If result was just partnerId, wrap it in success
    return NextResponse.json(
      { message: "Booking confirmed successfully", partnerId: result },
      { status: 200 }
    );
  } catch (err: any) {
    console.error("❌ Confirm route error:", err.message);

    // Custom handling for known error types
    const msg = err.message || "Internal Server Error";

    if (
      msg.includes("not found") ||
      msg.includes("No partner") ||
      msg.includes("must be APPROVED")
    ) {
      return NextResponse.json({ message: msg }, { status: 400 });
    }

    return NextResponse.json({ message: msg }, { status: 500 });
  }
}
