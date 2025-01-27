"use client"

import { useState, useEffect } from "react"
import { useChat } from "ai/react"

export default function Chat() {
  const [isConversationStarted, setIsConversationStarted] = useState(false)
  const { messages, input, handleInputChange, setMessages } = useChat({
    api: "/api/chat",
    onResponse: (response) => {
      if (response.ok) {
        return response.json().then((data) => data.content)
      }
      throw new Error("Failed to fetch the chat response")
    },
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

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    if (input.trim() === "") return

    // Add user message
    const userMessage = { id: Date.now().toString(), role: "user", content: input }
    setMessages((prevMessages) => [...prevMessages, userMessage])

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ messages: [...messages, userMessage] }),
      })

      if (!response.ok) {
        throw new Error("Failed to fetch the chat response")
      }

      const data = await response.json()

      // Add assistant message
      setMessages((prevMessages) => [
        ...prevMessages,
        { id: Date.now().toString(), role: "assistant", content: data.content },
      ])
    } catch (error) {
      console.error("Error sending message:", error)
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
      <div className="flex-1 overflow-y-auto mb-4 space-y-4">
        {messages.map((message) => (
          <div key={message.id} className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`rounded-lg px-4 py-2 max-w-[80%] ${
                message.role === "user" ? "bg-blue-500 text-white" : "bg-gray-200 text-gray-900"
              }`}
            >
              {message.content}
            </div>
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

