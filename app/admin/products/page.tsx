// app/admin/products/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function AdminProductsPage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Products</h1>
        <Link href="/admin/products/create" className="bg-black text-white px-4 py-2 rounded">Create product</Link>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {products.map((p) => (
          <div key={p.id} className="border rounded p-4 flex gap-4">
            <img src={p.images?.[0] ?? "/placeholder.png"} alt={p.name} className="w-28 h-28 object-cover rounded"/>
            <div className="flex-1">
              <div className="font-semibold">{p.name}</div>
              <div className="text-sm text-gray-600">{p.slug}</div>
              <div className="mt-2">Price: <span className="font-bold">{p.price.toFixed(0)} DZD</span></div>
              <div className="mt-3 flex gap-2">
                <Link href={`/admin/products/edit/${p.id}`} className="text-sm underline">Edit</Link>
                <form action={`/api/admin/products/${p.id}/delete`} method="post">
                  <button type="submit" className="text-sm text-red-600">Delete</button>
                </form>
                <Link href={`/products/${p.slug}`} className="text-sm ml-auto underline">View</Link>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
