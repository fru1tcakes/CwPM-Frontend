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

    // Simply return the response string in the expected message format
    return NextResponse.json({
      id: Date.now().toString(),
      role: "assistant",
      content: data.response,
    })
  } catch (error) {
    console.error("Error:", error)
    return NextResponse.json(
      {
        id: Date.now().toString(),
        role: "assistant",
        content: "An error occurred while processing your request.",
      },
      { status: 500 },
    )
  }
}

