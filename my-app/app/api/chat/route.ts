import { NextResponse } from "next/server"

export const runtime = "edge"

export async function POST(req: Request) {
  const { messages } = await req.json()
  const lastMessage = messages[messages.length - 1]

  try {
    const response = await fetch("http://localhost:5000/chat", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ message: lastMessage.content }),
    })

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    const data = await response.json()
    console.log("Backend response:", JSON.stringify(data, null, 2))

    if (typeof data === "string") {
      return NextResponse.json({ content: data })
    } else if (data && typeof data === "object") {
      if (data.data && Array.isArray(data.data)) {
        const latestAssistantMessage = data.data.find(
          (msg) => msg.role === "assistant" && msg.content && msg.content.length > 0,
        )
        if (latestAssistantMessage && latestAssistantMessage.content[0].text) {
          return NextResponse.json({ content: latestAssistantMessage.content[0].text.value })
        }
      } else if (data.response) {
        return NextResponse.json({ content: data.response })
      }
    }

    console.error("Unexpected response structure:", data)
    return NextResponse.json({ content: "I'm sorry, I couldn't generate a response." }, { status: 500 })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ content: "An error occurred while processing your request." }, { status: 500 })
  }
}

