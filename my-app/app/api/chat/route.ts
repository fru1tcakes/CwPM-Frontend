import { StreamingTextResponse, Message } from "ai"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  const response = await fetch("http://localhost:5000/chat", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ message: lastMessage.content }),
  })

  const data = await response.json()

  // Convert the response to a ReadableStream
  const stream = new ReadableStream({
    async start(controller) {
      controller.enqueue(data.response)
      controller.close()
    },
  })

  return new StreamingTextResponse(stream)
}

