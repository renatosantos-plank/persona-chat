"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, User } from "lucide-react";
import { AgentStatus } from "@/components/agent-status";
import { TypingIndicator } from "@/components/typing-indicator";
import { WelcomeMessage } from "@/components/welcome-message";
import { Navbar } from "@/components/navbar";

export default function Chat() {
  const { messages, input, status, error, handleInputChange, handleSubmit } =
    useChat({
      streamProtocol: "text",
      api: "/api/chat",
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isTyping, setIsTyping] = useState(false);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  useEffect(() => {
    setIsTyping(status === "streaming");
  }, [status]);

  const getAgentIcon = (content: string) => {
    if (
      content.toLowerCase().includes("weather") ||
      content.toLowerCase().includes("temperature") ||
      content.toLowerCase().includes("forecast")
    ) {
      return <span className="text-blue-400 text-lg">🦇</span>;
    }
    if (
      content.toLowerCase().includes("news") ||
      content.toLowerCase().includes("headlines")
    ) {
      return <span className="text-red-400 text-lg">🦇</span>;
    }
    return <span className="text-purple-400 text-lg">🦇</span>;
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Navbar />

      {/* Chat Container */}
      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 h-[600px] flex flex-col">
          {/* Messages Area */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.length === 0 && <WelcomeMessage />}

            {messages.map((message) => (
              <div
                key={message.id}
                className={`flex gap-3 ${
                  message.role === "user" ? "justify-end" : "justify-start"
                }`}
              >
                {message.role === "assistant" && (
                  <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                    {getAgentIcon(
                      message.parts[0]?.type === "text"
                        ? message.parts[0].text
                        : ""
                    )}
                  </div>
                )}

                <div
                  className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                    message.role === "user"
                      ? "bg-gradient-to-r from-purple-600 to-red-600 text-white"
                      : "bg-gray-800/50 border border-purple-500/30 text-gray-100"
                  }`}
                >
                  <div className="whitespace-pre-wrap">
                    {message.parts.map((part, i) => {
                      switch (part.type) {
                        case "text":
                          return (
                            <div
                              key={`${message.id}-${i}`}
                              className="text-sm leading-relaxed"
                            >
                              {part.text}
                            </div>
                          );
                      }
                    })}
                  </div>
                </div>

                {message.role === "user" && (
                  <div className="w-8 h-8 bg-gray-700 rounded-full flex items-center justify-center flex-shrink-0">
                    <User className="w-4 h-4 text-gray-300" />
                  </div>
                )}
              </div>
            ))}

            {/* Typing Indicator */}
            {isTyping && <TypingIndicator />}

            <div ref={messagesEndRef} />
          </div>

          {/* Input Area */}
          <div className="p-6 border-t border-purple-500/30">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
                value={input}
                onChange={handleInputChange}
                placeholder="Ask BatBot about weather, news, or just chat..."
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-purple-600 to-red-600 text-white px-6 py-3 rounded-xl hover:from-purple-700 hover:to-red-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 flex items-center gap-2"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        {/* Error Display */}
        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
