import { NextResponse } from "next/server";
import { connectMongo } from "@/app/server/db";
import Partner from "@/app/server/models/Partner";

export async function GET() {
  await connectMongo();
  const partners = await Partner.find({});
  return NextResponse.json(partners);
}
