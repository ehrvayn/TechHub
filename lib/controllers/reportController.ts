import { NextResponse } from "next/server";
import { getReports } from "@/lib/services/reportService";
import { getCurrentUser } from "@/lib/auth/getCurrentUser";

export async function handleGetReports() {
  const user = await getCurrentUser();
  if (!user)
    return NextResponse.json({ message: "Not logged in." }, { status: 401 });
  if (user.role !== "admin")
    return NextResponse.json({ message: "Forbidden." }, { status: 403 });

  const result = await getReports();
  if (!result.success) return NextResponse.json(result, { status: 500 });
  return NextResponse.json(result);
}
