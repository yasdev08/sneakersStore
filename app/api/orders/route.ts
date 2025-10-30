// app/api/orders/route.ts
import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { sendTelegramNotification, sendToYalidine } from "@/lib/notify";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { productId, productName, productImage, size, total, customer } = body;

    if (!productId || !customer?.phone || !customer?.name || !total) {
      return NextResponse.json({ error: "Missing fields" }, { status: 400 });
    }

    // create or find customer by phone to avoid duplicates
    let dbCustomer = await prisma.customer.findFirst({ where: { phone: customer.phone } });

    if (!dbCustomer) {
      dbCustomer = await prisma.customer.create({
        data: {
          name: customer.name,
          phone: customer.phone,
          wilaya: customer.wilaya ?? "",
          commune: customer.commune ?? "",
          note: customer.note ?? "",
        },
      });
    } else {
      // update some fields if provided
      await prisma.customer.update({
        where: { id: dbCustomer.id },
        data: {
          name: customer.name,
          wilaya: customer.wilaya ?? dbCustomer.wilaya,
          commune: customer.commune ?? dbCustomer.commune,
          note: customer.note ?? dbCustomer.note,
        },
      });
    }

    // create order - items stored inside items JSON for possible expansion
    const order = await prisma.order.create({
      data: {
        items: [
          {
            productId,
            name: productName,
            price: Number(total),
            quantity: 1,
            size,
          },
        ],
        total: Number(total),
        customerId: dbCustomer.id,
        status: "pending",
      },
    });

    // prepare a payload for external services
    const payload = {
      orderId: order.id,
      productName,
      size,
      total: Number(total),
      customer: {
        name: customer.name,
        phone: customer.phone,
        wilaya: customer.wilaya,
        commune: customer.commune,
        address: customer.address,
        note: customer.note,
      },
    };

    // send telegram notification (best-effort)
    sendTelegramNotification(payload).catch((e) => console.error("tg err", e));

    // send to Yalidine (best-effort)
    const yalidineRes = await sendToYalidine(payload);

    // you may want to store yalidine response (tracking id / status) - example:
    if (yalidineRes && yalidineRes?.tracking_id) {
      await prisma.order.update({
        where: { id: order.id },
        data: {
          status: "confirmed", // depending on Yalidine response semantics
          // you can add fields in your schema to store tracking info
        },
      });
    }

    return NextResponse.json({ ok: true, orderId: order.id, yalidineRes });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: err.message ?? "server error" }, { status: 500 });
  }
}
