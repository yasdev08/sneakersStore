import { prisma } from "@/lib/prisma";
import Link from "next/link";

export default async function HomePage() {
  const products = await prisma.product.findMany({ orderBy: { createdAt: "desc" } });

  return (
    <main className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-8 text-center">Our Sneakers</h1>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
        {products.map((p) => (
          <Link key={p.id} href={`/products/${p.slug}`}>
            <div className="border rounded-lg p-3 hover:shadow-md cursor-pointer">
              <img src={p.image} alt={p.name} className="w-full h-64 object-cover rounded" />
              <h2 className="mt-2 font-semibold">{p.name}</h2>
              <p className="text-gray-700">{p.price.toFixed(0)} DZD</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
