"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, User, CloudRain, Newspaper, MessageSquare } from "lucide-react";
import { TypingIndicator } from "@/components/typing-indicator";
import { WelcomeMessage } from "@/components/welcome-message";
import { Navbar } from "@/components/navbar";

// A helper component to render agent icons
const AgentIcon = ({ agentName }: { agentName?: string }) => {
  switch (agentName) {
    case "Weather":
      return <CloudRain className="w-4 h-4 text-cyan-300" />;
    case "News":
      return <Newspaper className="w-4 h-4 text-amber-300" />;
    case "Chat":
      return <MessageSquare className="w-4 h-4 text-lime-300" />;
    default:
      return <span className="text-purple-400 text-lg">🦇</span>;
  }
};

const threadId = "batbot-123";
export default function Chat() {
  const { messages, input, status, error, handleInputChange, handleSubmit } =
    useChat({
      id: threadId,
      api: "/api/chat",
      body: {
        threadId,
      },
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const isTyping = status === "streaming";

  // Determine the current agent for the typing indicator from the last message's annotations
  const lastMessage = messages[messages.length - 1];
  const currentAgent = isTyping
    ? lastMessage?.annotations?.[lastMessage.annotations.length - 1]?.agent
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900 to-black text-white">
      <Navbar />

      <div className="max-w-4xl mx-auto p-6">
        <div className="bg-black/30 backdrop-blur-sm rounded-2xl border border-purple-500/30 h-[600px] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin">
            {messages.length === 0 && <WelcomeMessage />}

            {messages.map((message) => {
              // Retrieve the agent name from the message's annotations array.
              // We'll use the last annotation as it represents the final agent.
              const agentName =
                message.annotations?.[message.annotations.length - 1]?.agent;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-600 to-red-600 rounded-full flex items-center justify-center flex-shrink-0">
                      <AgentIcon agentName={agentName} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-600 to-red-600 text-white"
                        : "bg-gray-800/50 border border-purple-500/30 text-gray-100"
                    }`}
                  >
                    {/* Optionally display the agent name above the message */}
                    {agentName && (
                      <div className="text-xs font-bold text-purple-300 mb-1">
                        {agentName} Agent
                      </div>
                    )}
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
              );
            })}

            {isTyping && <TypingIndicator agent={currentAgent} />}
            <div ref={messagesEndRef} />
          </div>

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

        {error && (
          <div className="mt-4 bg-red-500/20 border border-red-500/30 rounded-xl p-4">
            <p className="text-red-400 text-sm">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
