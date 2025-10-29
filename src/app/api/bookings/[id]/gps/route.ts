import { NextResponse } from "next/server";
import { updateGPS } from "@/app/server/services/gps";

export async function POST(req: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params; // ✅ await params before use
  const { lat, lng } = await req.json();

  await updateGPS(id, lat, lng);
  return NextResponse.json({ ok: true });
}
