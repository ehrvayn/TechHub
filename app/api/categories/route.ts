import { NextResponse } from "next/server";
import { listCategories } from "@/lib/services/categoryService";

export async function GET() {
  const result = await listCategories();
  if (!result.success) {
    return NextResponse.json(result, { status: 500 });
  }
  return NextResponse.json(result);
}