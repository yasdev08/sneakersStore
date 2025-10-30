// lib/notify.ts
import fetch from "node-fetch";

type OrderPayload = {
  orderId: string;
  productName: string;
  size?: string;
  total: number;
  customer: {
    name: string;
    phone: string;
    wilaya?: string;
    commune?: string;
    address?: string; // optional, keep if you used it
    note?: string;
  };
};

export async function sendTelegramNotification(payload: OrderPayload) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!botToken || !chatId) return;

  const text = [
    "📦 *New COD Order*",
    `*Order ID:* ${payload.orderId}`,
    `*Product:* ${payload.productName}`,
    payload.size ? `*Size:* ${payload.size}` : "",
    `*Total:* ${payload.total} DZD`,
    `*Customer:* ${payload.customer.name}`,
    `*Phone:* ${payload.customer.phone}`,
    payload.customer.wilaya ? `*Wilaya:* ${payload.customer.wilaya}` : "",
    payload.customer.commune ? `*Commune:* ${payload.customer.commune}` : "",
    payload.customer.address ? `*Address:* ${payload.customer.address}` : "",
    payload.customer.note ? `*Note:* ${payload.customer.note}` : "",
  ]
    .filter(Boolean)
    .join("\n");

  const tgUrl = `https://api.telegram.org/bot${botToken}/sendMessage`;
  try {
    await fetch(tgUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "Markdown",
      }),
    });
  } catch (err) {
    console.error("Telegram notify error", err);
  }
}

/**
 * Send order to Yalidine.
 * NOTE: YALIDINE_API_URL should be the exact base URL Yalidine expects.
 * Many community libs set API ID/TOKEN as headers or form fields. Here we send headers:
 *  - X-API-ID or API_ID
 *  - X-API-TOKEN or API_TOKEN
 *
 * Adjust the path/field names to match Yalidine docs you receive from them.
 */
export async function sendToYalidine(payload: OrderPayload) {
  const base = process.env.YALIDINE_API_URL;
  const apiId = process.env.YALIDINE_API_ID;
  const apiToken = process.env.YALIDINE_API_TOKEN;
  if (!base || !apiId || !apiToken) {
    console.warn("Yalidine env missing, skipping sending to Yalidine");
    return null;
  }

  // Example path — change if Yalidine doc says otherwise.
  const url = `${base}/create-shipment`; // <-- adjust path if needed

  // Map your payload to the structure Yalidine expects.
  const body = {
    api_id: apiId,
    api_token: apiToken,
    // example fields (adjust)
    client_name: payload.customer.name,
    client_phone: payload.customer.phone,
    wilaya: payload.customer.wilaya ?? "",
    commune: payload.customer.commune ?? "",
    address: payload.customer.address ?? "",
    note: payload.customer.note ?? "",
    order_ref: payload.orderId,
    items: [{ name: payload.productName, qty: 1, price: payload.total }],
    total: payload.total,
  };

  try {
    const res = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" /* if Yalidine expects form data change this */ },
      body: JSON.stringify(body),
    });
    const json = await res.json();
    return json;
  } catch (err) {
    console.error("Yalidine API error", err);
    return null;
  }
}
