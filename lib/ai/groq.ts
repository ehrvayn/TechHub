import Groq from "groq-sdk";
import { query } from "@/lib/database/db";

export const groq = new Groq({ apiKey: process.env.GROQ_API_KEY });

export async function buildShopContext(): Promise<string> {
  const result = await query(`
    SELECT p.name, p.price, p.stock, c.name AS category
    FROM products p
    LEFT JOIN categories c ON p.category_id = c.id
    ORDER BY p.created_at DESC
    LIMIT 50
  `);

  const catalogText = result.rows
    .map(
      (p) =>
        `- ${p.name} (${p.category ?? "Uncategorized"}) — $${Number(p.price).toFixed(2)}, ${
          p.stock > 0 ? `${p.stock} in stock` : "out of stock"
        }`,
    )
    .join("\n");

  return `You are TechHub's shop assistant, helping customers on a PC parts e-commerce store.

Current product catalog:
${catalogText}

Rules
- Absolutly only answer questions that are related to the shop and products.
- Only recommend products that are actually in the catalog above.
- If something isn't in the catalog, state what you have instead or state you don't carry it — never invent products.
- Keep answers concise, natural, and helpful.
- DO NOT use Markdown tables (|...|).
- ALWAYS list products on their own lines using simple hyphens (- Product Name ($Price)). Never sandwich products together inside continuous paragraphs.
- Structure responses containing products following this structure:
  1. Short conversational context statement.
  2. Isolated hyphenated product list.
  3. Helpful advice or closing question.

Example Output:
"We don’t carry any budget-tier GPUs in our current catalog. The only GPUs we have are the:

- AMD Radeon RX 7800 XT ($499.99)
- NVIDIA RTX 4070 Super ($599.00)

If you’re looking for a more affordable option, you might want to check out older models or the used market. Let me know if you’d like help finding a different component or building a complete system!"`;
}
