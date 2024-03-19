import { OpenAIStream, StreamingTextResponse } from "ai";

export const runtime = "edge";

export async function POST(req: Request) {
  const { messages } = await req.json();
  const start = Date.now();

  try {
    const openaiApiUrl = process.env.OPENAI_API_URL || 'https://api.gpt.top/v1/chat/completions';
    const openaiApiModel = process.env.OPENAI_API_MODEL || 'gpt';

    const response = await fetch(openaiApiUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        model: openaiApiModel,
        stream: true,
        messages: messages,
      }),
    });

    if (!response.ok) {
      throw new Error(`OpenAI API returned an error: ${response.statusText}`);
    }

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream, {
      headers: {
        "X-LLM-Start": `${start}`,
        "X-LLM-Response": `${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("Error:", error);
    return new Response("An error occurred", { status: 500 });
  }
}
