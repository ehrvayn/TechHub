import { NextResponse } from "next/server";
import { groq, buildShopContext } from "@/lib/ai/groq";

export async function POST(request: Request) {
  try {
    const { messages } = await request.json();

    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json(
        { message: "No messages provided." },
        { status: 400 },
      );
    }

    const systemPrompt = await buildShopContext();

    const completion = await groq.chat.completions.create({
      model: "openai/gpt-oss-20b",
      messages: [{ role: "system", content: systemPrompt }, ...messages],
      temperature: 0.4,
      max_tokens: 400,
    });

    const reply =
      completion.choices[0]?.message?.content ??
      "Sorry, I couldn't generate a response.";

    return NextResponse.json({ success: true, reply });
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { success: false, message: "Something went wrong." },
      { status: 500 },
    );
  }
}
