"use client";

import { useEffect, useState } from "react";
import { Navbar } from "@/components/navbar";
import { v4 } from "uuid";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [threadId, setThreadId] = useState<string | null>(null);

  useEffect(() => {
    const savedThreadId = localStorage.getItem("chat-thread-id");
    if (savedThreadId) {
      setThreadId(savedThreadId);
    } else {
      const newThreadId = v4();
      setThreadId(newThreadId);
      localStorage.setItem("chat-thread-id", newThreadId);
    }
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      id: Math.random().toString(),
      role: "user",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messages: [...messages, userMessage],
          threadId: threadId,
        }),
      });

      // Check if the response is ok
      if (!response.ok) {
        const errorText = await response.text();
        console.error("API Error:", response.status, errorText);
        throw new Error(`API Error: ${response.status} - ${errorText}`);
      }

      // Check if response has content
      const responseText = await response.text();
      if (!responseText) {
        throw new Error("Empty response from API");
      }

      let data;
      try {
        data = JSON.parse(responseText);
      } catch (parseError) {
        console.error("Failed to parse JSON:", responseText);
        throw new Error("Invalid JSON response from API");
      }

      // Only add the new AI message(s) to the conversation
      if (data.messages && data.messages.length > 0) {
        setMessages((prev) => [...prev, ...data.messages]);
      }

      // Update thread ID if a new one is returned
      if (data.threadId && data.threadId !== threadId) {
        setThreadId(data.threadId);
        localStorage.setItem("chat-thread-id", data.threadId);
      }
    } catch (error) {
      console.error("Error sending message:", error);
      // Add error message to chat
      setMessages((prev) => [
        ...prev,
        {
          id: Math.random().toString(),
          role: "assistant",
          content:
            "Bloody hell! Something went wrong, mate. Try again in a bit?",
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const startNewConversation = () => {
    const newThreadId = v4();
    setThreadId(newThreadId);
    localStorage.setItem("chat-thread-id", newThreadId);
    setMessages([]); // Clear the current conversation
  };

  return (
    <div className="min-h-screen bg-black text-gray-100">
      <Navbar />

      <div className="max-w-4xl mx-auto p-4 font-mono">
        {/* Header with thread management */}
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-purple-300">Bat Agent Chat</h1>
          <button
            type="button"
            onClick={startNewConversation}
            className="px-4 py-2 bg-gray-700 text-white rounded-lg hover:bg-gray-600 transition"
          >
            New Conversation
          </button>
        </div>

        {/* Thread ID display (optional, for debugging) */}
        {threadId && (
          <div className="text-xs text-gray-500 mb-4">
            Thread: {threadId.substring(0, 8)}...
          </div>
        )}

        <div className="space-y-4 mb-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg ${
                message.role === "user"
                  ? "bg-gray-800 ml-12"
                  : "bg-gray-700 mr-12"
              }`}
            >
              <div className="font-semibold mb-1 text-purple-300">
                {message.role === "user" ? "You" : "Bat Agent"}
              </div>
              <div>{message.content}</div>
            </div>
          ))}

          {isLoading && (
            <div className="bg-gray-700 p-4 rounded-lg mr-12">
              <div className="font-semibold mb-1 text-purple-300">
                Bat Agent
              </div>
              <div>*Mumblin and thinkin...*</div>
            </div>
          )}
        </div>

        <form onSubmit={handleSubmit} className="flex gap-2">
          <input
            className="flex-1 p-2 bg-gray-900 text-white border border-gray-600 rounded-lg placeholder-gray-500"
            value={input}
            placeholder="Summon Bat Agent..."
            onChange={(e) => setInput(e.target.value)}
            disabled={isLoading}
          />
          <button
            type="submit"
            disabled={isLoading || !input.trim()}
            className="px-4 py-2 bg-purple-600 text-white rounded-lg disabled:opacity-50 hover:bg-purple-500 transition"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
