import { NextResponse } from "next/server";
import {
  listProducts,
  createProduct,
  editProduct,
  removeProduct,
} from "@/lib/services/productService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

async function requireAdmin() {
  const user = await getCurrentUser();
  if (!user)
    return {
      error: NextResponse.json({ message: "Not logged in." }, { status: 401 }),
    };
  if (user.role !== "admin")
    return {
      error: NextResponse.json({ message: "Forbidden." }, { status: 403 }),
    };
  return { error: null };
}

export async function handleGetInventory() {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await listProducts();
  if (!result.success) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result);
}

export async function handleCreateProduct(request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const {
    name,
    slug,
    price,
    stock,
    categoryId,
    image_url,
    description,
    specs,
  } = await request.json();
  const result = await createProduct(
    name,
    slug,
    Number(price),
    Number(stock),
    categoryId,
    image_url,
    description,
    specs,
  );

  if (!result.success) return NextResponse.json(result, { status: 400 });
  return NextResponse.json(result);
}

export async function handleUpdateProduct(productId: number, request: Request) {
  const { error } = await requireAdmin();
  if (error) return error;

  const { name, slug, price, stock, categoryId } = await request.json();
  const result = await editProduct(
    productId,
    name,
    slug,
    Number(price),
    Number(stock),
    Number(categoryId),
  );

  if (!result.success) {
    const status = result.message === "Product not found." ? 404 : 500;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}

export async function handleDeleteProduct(productId: number) {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await removeProduct(productId);
  if (!result.success) {
    const status = result.message === "Product not found." ? 404 : 500;
    return NextResponse.json(result, { status });
  }
  return NextResponse.json(result);
}
