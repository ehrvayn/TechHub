import { handleGetCustomerDetail } from "@/lib/controllers/customerController";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  return handleGetCustomerDetail(Number(id));
}
