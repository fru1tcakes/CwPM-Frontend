"use client"

import { useState } from "react"
import { useChat } from "ai/react"

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false)
  const { messages, input, handleInputChange, handleSubmit } = useChat({
    api: "/api/chat",
  })

  const startConversation = async () => {
    try {
      const response = await fetch("/api/start-conversation", {
        method: "POST",
      })
      if (response.ok) {
        setIsConversationStarted(true)
      } else {
        console.error("Failed to start conversation")
      }
    } catch (error) {
      console.error("Error starting conversation:", error)
    }
  }

  if (!isConversationStarted) {
    return (
      <div className="flex items-center justify-center h-screen">
        <button onClick={startConversation} className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Start Conversation
        </button>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-screen max-w-2xl mx-auto p-4">
      <div className="flex-1 overflow-y-auto mb-4">
        {messages.map((m) => (
          <div key={m.id} className={`mb-4 ${m.role === "user" ? "text-right" : "text-left"}`}>
            <span
              className={`inline-block p-2 rounded-lg ${m.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200"}`}
            >
              {m.content}
            </span>
          </div>
        ))}
      </div>
      <form onSubmit={handleSubmit} className="flex space-x-4">
        <input
          value={input}
          onChange={handleInputChange}
          placeholder="Say something..."
          className="flex-1 p-2 border rounded"
        />
        <button type="submit" className="px-4 py-2 text-white bg-blue-500 rounded hover:bg-blue-600">
          Send
        </button>
      </form>
    </div>
  )
}

