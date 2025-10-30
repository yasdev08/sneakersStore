// app/admin/products/create/page.tsx
import { createProductAction } from "./actions";
import { redirect } from "next/navigation";

export default function CreateProductPage() {
  async function handleAction(formData: FormData) {
    "use server";
    await createProductAction(formData);
    redirect("/admin/products");
  }

  return (
    <div className="container mx-auto py-8 max-w-xl">
      <h1 className="text-2xl font-bold mb-6">Create Product</h1>
      <form action={handleAction} className="space-y-4">
        <input name="name" placeholder="Name" required className="w-full border p-2 rounded" />
        <input name="slug" placeholder="Slug (unique)" required className="w-full border p-2 rounded" />
        <input name="price" type="number" placeholder="Price (DZD)" required className="w-full border p-2 rounded" />
        <textarea name="description" placeholder="Description" className="w-full border p-2 rounded" />
        <input name="images" placeholder="Images (comma-separated URLs)" className="w-full border p-2 rounded" />
        <input name="sizes" placeholder="Sizes (comma-separated)" className="w-full border p-2 rounded" />

        <button type="submit" className="bg-black text-white px-4 py-2 rounded">
          Create Product
        </button>
      </form>
    </div>
  );
}
