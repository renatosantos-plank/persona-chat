"use client";

import { useState } from "react";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);

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
        }),
      });

      const data = await response.json();

      if (data.messages && data.messages.length > 0) {
        const aiMessage = data.messages[data.messages.length - 1];
        setMessages((prev) => [...prev, aiMessage]);
      }
    } catch (error) {
      console.error("Error sending message:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-gray-100 max-w-4xl mx-auto p-4 font-mono">
      <h1 className="text-3xl font-bold mb-6 text-purple-400">🦇 BatBot</h1>

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
              {message.role === "user" ? "You" : "BatBot"}
            </div>
            <div>{message.content}</div>
          </div>
        ))}

        {isLoading && (
          <div className="bg-gray-700 p-4 rounded-lg mr-12">
            <div className="font-semibold mb-1 text-purple-300">BatBot</div>
            <div>*Mumblin’ and thinkin’...*</div>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <input
          className="flex-1 p-2 bg-gray-900 text-white border border-gray-600 rounded-lg placeholder-gray-500"
          value={input}
          placeholder="Summon BatBot..."
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
  );
}
