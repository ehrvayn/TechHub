import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { items, orderId } = await req.json();

    const secretKey = process.env.PAYMONGO_SECRET_KEY;
    if (!secretKey) {
      return NextResponse.json(
        { success: false, message: "PayMongo secret key missing" },
        { status: 500 }
      );
    }

    const encodedKey = Buffer.from(`${secretKey}:`).toString("base64");

    const lineItems = items.map((item: any) => ({
      currency: "PHP",
      amount: Math.round(item.price * 100),
      name: item.name,
      quantity: item.quantity,
    }));

    const origin = req.headers.get("origin") || "http://localhost:3000";

    const response = await fetch("https://api.paymongo.com/v1/checkout_sessions", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        Authorization: `Basic ${encodedKey}`,
      },
      body: JSON.stringify({
        data: {
          attributes: {
            line_items: lineItems,
            payment_method_types: ["card", "gcash", "paymaya"],
            success_url: `${origin}/orders/${orderId}?payment=success`,
            cancel_url: `${origin}/checkout?payment=cancelled`,
            description: `TechHub Order #${orderId}`,
          },
        },
      }),
    });

    const data = await response.json();

    if (!response.ok) {
      return NextResponse.json(
        {
          success: false,
          message: data.errors?.[0]?.detail || "Failed to create checkout session",
        },
        { status: 400 }
      );
    }

    return NextResponse.json({
      success: true,
      checkoutUrl: data.data.attributes.checkout_url,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Internal server error" },
      { status: 500 }
    );
  }
}