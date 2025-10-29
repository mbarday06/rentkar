import { NextResponse } from "next/server";
import { connectMongo } from "@/app/server/db";
import Booking from "@/app/server/models/Booking";

export async function GET() {
  await connectMongo();
  const confirmed = await Booking.find({ status: "confirmed" }).sort({ updatedAt: -1 });
  return NextResponse.json(confirmed);
}
