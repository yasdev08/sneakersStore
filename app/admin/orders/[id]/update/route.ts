// app/api/admin/orders/[id]/update/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  const body = await req.formData();
  const status = body.get("status") as string;
  if (!status) return NextResponse.json({ error: "status required" }, { status: 400 });

  const order = await prisma.order.update({
    where: { id: params.id },
    data: { status },
  });

  return NextResponse.json({ ok: true, order });
}
