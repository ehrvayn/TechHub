import { handleGetCustomers } from "@/lib/controllers/customerController";

export async function GET() {
  return handleGetCustomers();
}
