export async function POST() {
  try {
    const response = await fetch("http://localhost:5000/start_conversation", {
      method: "POST",
    })

    if (!response.ok) {
      throw new Error("Failed to start conversation")
    }

    const data = await response.json()
    return new Response(JSON.stringify(data), {
      headers: { "Content-Type": "application/json" },
      status: 200,
    })
  } catch (error) {
    console.error("Error starting conversation:", error)
    return new Response(JSON.stringify({ error: "Failed to start conversation" }), {
      headers: { "Content-Type": "application/json" },
      status: 500,
    })
  }
}

