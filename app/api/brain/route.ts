import axios from "axios";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

async function getChatGptResponse(messages: any[]) {
  const url = "https://api.gptgod.online/v1/chat/completions";
  const headers = {
    Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
    "Content-Type": "application/json",
  };
  const data = {
    model: "gpt-3.5-turbo",
    messages: messages,
    stream: true,
  };

  try {
    const response = await axios.post(url, data, { headers: headers });
    return response.data;
  } catch (error) {
    console.error(error);
  }
}

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  const start = Date.now();

  // Request the API for the response based on the prompt
  try {
    const response = await getChatGptResponse(messages);
    const stream = OpenAIStream(response);

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
