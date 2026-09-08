import { NextResponse } from "next/server";
import {
  listCustomers,
  getCustomerDetail,
} from "@/lib/services/customerService";
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

export async function handleGetCustomers() {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await listCustomers();
  if (!result.success) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result);
}

export async function handleGetCustomerDetail(userId: number) {
  const { error } = await requireAdmin();
  if (error) return error;

  const result = await getCustomerDetail(userId);
  if (!result.success) return NextResponse.json(result, { status: 404 });
  return NextResponse.json(result);
}
