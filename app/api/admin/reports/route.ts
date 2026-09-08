import { handleGetReports } from "@/lib/controllers/reportController";

export async function GET() {
  return handleGetReports();
}
