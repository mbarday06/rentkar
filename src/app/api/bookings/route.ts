import { NextResponse } from "next/server";
import Booking from "@/app/server/models/Booking";
import { connectMongo } from "@/app/server/db";

export async function GET() {
  await connectMongo();
  const bookings = await Booking.find().lean();
  return NextResponse.json(bookings);
}
