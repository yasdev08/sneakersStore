// app/api/products/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
  try {
    const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });
    return NextResponse.json({ ok: true, products });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}

export async function POST(req: Request) {
  // protected endpoint: require ADMIN_KEY in x-admin-key header
  const adminKey = req.headers.get("x-admin-key");
  if (adminKey !== process.env.ADMIN_KEY) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const { name, slug, description, price, images = [], sizes = [], category } = body;

    if (!name || !slug || !price) {
      return NextResponse.json({ error: "missing fields" }, { status: 400 });
    }

    const product = await prisma.product.create({
      data: {
        name,
        slug,
        description: description ?? "",
        price: Number(price),
        images: images as string[],
        sizes: sizes as string[],
        category: category ?? "",
      },
    });

    return NextResponse.json({ ok: true, product });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message || "server error" }, { status: 500 });
  }
}
