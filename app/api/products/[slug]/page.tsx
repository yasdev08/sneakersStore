// app/products/[slug]/page.tsx
import { prisma } from "@/lib/prisma";
import OrderForm from "@/components/OrderForm";

export default async function ProductPage({ params }: { params: { slug: string } }) {
  const product = await prisma.product.findUnique({ where: { slug: params.slug } });
  if (!product) return <div className="p-8">Product not found</div>;

  return (
    <main className="container mx-auto py-10 max-w-3xl">
      <div className="border rounded p-6">
        <img src={product.images?.[0] ?? "/placeholder.png"} alt={product.name} className="w-full h-96 object-cover rounded mb-6"/>
        <h1 className="text-2xl font-bold">{product.name}</h1>
        <p className="mt-2 text-gray-700">{product.description}</p>
        <div className="mt-4 text-xl font-semibold">{product.price.toFixed(0)} DZD</div>

        <div className="mt-6">
          <OrderForm product={product} />
        </div>
      </div>
    </main>
  );
}
