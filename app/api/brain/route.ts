import { Configuration, OpenAIApi } from "openai";
import { OpenAIStream, StreamingTextResponse } from "ai";

// Optional, but recommended: run on the edge runtime.
// See https://vercel.com/docs/concepts/functions/edge-functions
export const runtime = "edge";

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY!,
  basePath: process.env.OPENAI_API_URL!,
});

const openai = new OpenAIApi(configuration);

export async function POST(req: Request) {
  // Extract the `messages` from the body of the request
  const { messages } = await req.json();
  const start = Date.now();

  // Request the OpenAI API for the response based on the prompt
  try {
    const response = await openai.createChatCompletion({
      model: "gpt-3.5-turbo-0125",
      stream: true,
      messages: messages,
    });

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
