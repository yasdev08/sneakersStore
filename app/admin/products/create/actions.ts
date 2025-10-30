// app/admin/products/create/actions.ts
"use server";

import { prisma } from "@/lib/prisma";

export async function createProductAction(formData: FormData) {
  const name = formData.get("name") as string;
  const slug = formData.get("slug") as string;
  const price = Number(formData.get("price"));
  const description = (formData.get("description") as string) || "";
  const images = (formData.get("images") as string)?.split(",").map(s => s.trim()).filter(Boolean) ?? [];
  const sizes = (formData.get("sizes") as string)?.split(",").map(s => s.trim()).filter(Boolean) ?? [];

  if (!name || !slug || !price) {
    throw new Error("Missing required fields");
  }

  const product = await prisma.product.create({
    data: {
      name,
      slug,
      price,
      description,
      images,
      sizes,
    },
  });

  return product;
}
