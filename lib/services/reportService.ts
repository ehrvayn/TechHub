import { query } from "@/lib/database/db";
import ReportsQuery from "@/lib/models/reportsQuery";

export const getReports = async () => {
  try {
    const bs = ReportsQuery.getBestSellers();
    const cat = ReportsQuery.getRevenueByCategory();
    const mon = ReportsQuery.getMonthlyRevenue();

    const bestSellers = await query(bs.query, bs.values);
    const byCategory = await query(cat.query, cat.values);
    const monthly = await query(mon.query, mon.values);

    return {
      success: true,
      bestSellers: bestSellers.rows,
      byCategory: byCategory.rows,
      monthly: monthly.rows,
    };
  } catch (error) {
    console.log(error);
    return { success: false, message: "Something went wrong!" };
  }
};
