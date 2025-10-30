"use client";
import React, { useState } from "react";

export default function OrderForm({ product }: any) {
  const [size, setSize] = useState(product.sizes?.[0] ?? "");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [wilaya, setWilaya] = useState("");
  const [commune, setCommune] = useState("");
  const [address, setAddress] = useState("");
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          productId: product.id,
          productName: product.name,
          productImage: product.images?.[0],
          size,
          total: product.price,
          customer: { name, phone, wilaya, commune, address, note },
        }),
      });

      const json = await res.json();
      if (res.ok) {
        alert("✅ Order received! Ref: " + json.orderId);
        // optionally navigate to confirmation page
        setName(""); setPhone(""); setWilaya(""); setCommune(""); setAddress(""); setNote("");
      } else {
        alert("Error: " + (json.error || "server error"));
      }
    } catch (err) {
      console.error(err);
      alert("Network error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3 border p-4 rounded-md">
      {product.sizes?.length > 0 && (
        <select value={size} onChange={(e)=>setSize(e.target.value)} className="border p-2 w-full">
          {product.sizes.map((s: string) => <option key={s} value={s}>Size {s}</option>)}
        </select>
      )}

      <input value={name} onChange={(e)=>setName(e.target.value)} placeholder="Full name" required className="border p-2 w-full"/>
      <input value={phone} onChange={(e)=>setPhone(e.target.value)} placeholder="Phone number" required className="border p-2 w-full"/>
      <input value={wilaya} onChange={(e)=>setWilaya(e.target.value)} placeholder="Wilaya" className="border p-2 w-full"/>
      <input value={commune} onChange={(e)=>setCommune(e.target.value)} placeholder="Commune" className="border p-2 w-full"/>
      <textarea value={address} onChange={(e)=>setAddress(e.target.value)} placeholder="Address / Street" required className="border p-2 w-full"/>
      <textarea value={note} onChange={(e)=>setNote(e.target.value)} placeholder="Note (optional)" className="border p-2 w-full"/>

      <button type="submit" disabled={loading} className="bg-black text-white w-full py-2 rounded">
        {loading ? "Submitting..." : "Order Now (Cash on Delivery)"}
      </button>
    </form>
  );
}
