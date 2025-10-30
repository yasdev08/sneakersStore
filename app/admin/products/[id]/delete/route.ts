// app/api/admin/products/[id]/delete/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request, { params }: { params: { id: string } }) {
  const key = req.headers.get("x-admin-key");
  if (key !== process.env.ADMIN_KEY) return NextResponse.json({ error: "unauthorized" }, { status: 401 });

  try {
    const id = params.id;
    await prisma.product.delete({ where: { id } });
    return NextResponse.json({ ok: true });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
