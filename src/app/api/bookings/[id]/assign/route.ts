import { NextResponse } from "next/server";
import { assignPartner } from "@/app/server/services/assignPartner";

export async function POST(_req: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const result = await assignPartner(id);

    if (typeof result === "object") {
      return NextResponse.json(result, { status: 200 });
    }

    return NextResponse.json({ message: "Partner assigned successfully", partnerId: result }, { status: 200 });
  } catch (err: any) {
    const msg = err.message || "Internal Server Error";
    const status =
      msg.includes("not found") ? 404 :
      msg.includes("No online partners") ? 400 :
      500;

    return NextResponse.json({ message: msg }, { status });
  }
}
