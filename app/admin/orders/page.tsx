// app/admin/orders/page.tsx
import { prisma } from "@/lib/prisma";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function AdminOrdersPage() {
  const orders = await prisma.order.findMany({
    orderBy: { createdAt: "desc" },
    include: { customer: true },
  });

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-2xl font-bold mb-4">Orders</h1>
      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o.id} className="border p-3 rounded flex justify-between items-center">
            <div>
              <div className="font-semibold">#{o.id} — {o.items?.[0]?.name}</div>
              <div className="text-sm text-gray-600">{o.customer?.name} — {o.customer?.phone}</div>
              <div className="text-sm">{o.items?.[0]?.size ? `Size: ${o.items[0].size}` : ""}</div>
              <div className="text-sm">Total: {o.total} DZD</div>
            </div>

            <div className="flex gap-2">
              <form method="post" action={`/api/admin/orders/${o.id}/update`}>
                <input type="hidden" name="status" value={o.status === "pending" ? "confirmed" : "shipped"} />
                <button className="bg-blue-600 text-white px-3 py-1 rounded">Toggle status</button>
              </form>
              <Link href={`/admin/orders/${o.id}`}><a className="underline">Details</a></Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
