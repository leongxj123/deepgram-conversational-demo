import { OpenAIStream, StreamingTextResponse } from "ai";
import axios from "axios";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  const start = Date.now();

  // Request the OpenAI API for the response based on the prompt
  try {
    const response = await axios({
      url: process.env.OPENAI_API_URL,
      method: "post",
      headers: {
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
      data: {
        model: "gpt-3.5-turbo",
        messages: messages,
        stream: true,
      },
      responseType: "stream",
    });

    const stream = OpenAIStream(response.data);

    return new StreamingTextResponse(stream, {
      headers: {
        "X-LLM-Start": `${start}`,
        "X-LLM-Response": `${Date.now()}`,
      },
    });
  } catch (error) {
    console.error("test", error);
  }
}
