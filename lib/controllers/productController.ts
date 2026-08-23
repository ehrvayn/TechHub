import { listProducts, retrieveProduct } from "@/lib/services/productService";
import { NextResponse } from "next/server";

export async function handleGetProducts() {
  const result = await listProducts();
  if (!result.success) {
    return NextResponse.json({ message: result.message }, { status: 500 });
  }
  return NextResponse.json(result.products);
}

export async function handleGetProduct(productId: number) {
  const result = await retrieveProduct(productId);

  if (!result.success) {
    const status = result.message === "Product not found." ? 404 : 500;
    return NextResponse.json({ message: result.message }, { status });
  }

  return NextResponse.json(result.product);
}