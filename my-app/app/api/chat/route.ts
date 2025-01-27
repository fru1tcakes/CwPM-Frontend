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

    // Extract the latest assistant message
    const latestAssistantMessage = data.data.find(
      (msg) => msg.role === "assistant" && msg.content && msg.content.length > 0,
    )

    if (latestAssistantMessage && latestAssistantMessage.content[0].text) {
      return NextResponse.json({ content: latestAssistantMessage.content[0].text.value })
    } else {
      return NextResponse.json({ content: "I'm sorry, I couldn't generate a response." })
    }
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json({ content: "An error occurred while processing your request." }, { status: 500 })
  }
}

