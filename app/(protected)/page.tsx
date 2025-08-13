"use client";

import { useChat } from "@ai-sdk/react";
import { CloudRain, MessageSquare, Newspaper, Send, User } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { v4 } from "uuid";
import { ClearHistoryButton } from "@/components/clear-history-button";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/Sidebar";
import { TypingIndicator } from "@/components/typing-indicator";
import { WelcomeMessage } from "@/components/welcome-message";

// A helper component to render agent icons
const AgentIcon = ({ agentName }: { agentName?: string }) => {
  switch (agentName) {
    case "Weather":
      return <CloudRain className="h-4 w-4 text-cyan-300" />;
    case "News":
      return <Newspaper className="h-4 w-4 text-amber-300" />;
    case "Chat":
      return <MessageSquare className="h-4 w-4 text-lime-300" />;
    default:
      return <span className="text-lg text-purple-400">🦇</span>;
  }
};

export default function Chat() {
  const [initialMessages, setInitialMessages] = useState([]);
  const [threadId, setThreadId] = useState("batbot-123");
  const { messages, input, status, error, handleInputChange, handleSubmit } =
    useChat({
      id: threadId,
      api: "/api/chat",
      body: {
        threadId,
      },
      initialMessages,
    });

  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const loadHistory = async () => {
    try {
      const response = await fetch(`/api/history?threadId=${threadId}`);
      const data = await response.json();
      setInitialMessages(data.messages);
    } catch (error) {
      console.error("Error loading history:", error);
    }
  };

  useEffect(() => {
    loadHistory();
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleHistoryCleared = () => {
    window.location.reload();
  };

  const isTyping = status === "streaming";

  // Determine the current agent for the typing indicator from the last message's annotations
  const lastMessage = messages[messages.length - 1];
  const currentAgent = isTyping
    ? (lastMessage?.annotations?.[lastMessage.annotations.length - 1] as any)
        ?.agent
    : undefined;

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-purple-950/20 to-black text-white">
      <Navbar />

      <div className="mx-auto flex h-[calc(100vh-120px)] gap-6 p-6">
        <Sidebar
          selectedId={threadId}
          onSelect={setThreadId}
          onNew={() => setThreadId(v4())}
        />
        <div className="flex min-w-0 flex-1 flex-col rounded-2xl border-sabbath-glow bg-sabbath-overlay backdrop-blur-sm">
          {/* header with clear history button */}
          <div className="flex items-center justify-end border-purple-500/20 border-b p-4">
            {messages.length > 0 && (
              <ClearHistoryButton
                threadId={threadId}
                onHistoryCleared={handleHistoryCleared}
              />
            )}
          </div>
          <div className="scrollbar-thin min-h-0 flex-1 space-y-4 overflow-y-auto p-6">
            {messages.length === 0 && <WelcomeMessage />}

            {messages.map((message) => {
              // Retrieve the agent name from the message's annotations array.
              // We'll use the last annotation as it represents the final agent.
              const agentName = (
                message.annotations?.[message.annotations.length - 1] as any
              )?.agent;

              return (
                <div
                  key={message.id}
                  className={`flex gap-3 ${
                    message.role === "user" ? "justify-end" : "justify-start"
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-900 to-purple-700 shadow-lg shadow-purple-900/20">
                      <AgentIcon agentName={agentName} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] break-words rounded-2xl px-4 py-3 ${
                      message.role === "user"
                        ? "border border-purple-500/30 bg-gradient-to-r from-purple-900/80 to-purple-700/80 text-white shadow-lg shadow-purple-900/20"
                        : "border border-purple-500/20 bg-gray-800/30 text-gray-100 backdrop-blur-sm"
                    }`}
                  >
                    {agentName && (
                      <div className="mb-1 font-bold text-glow-purple text-purple-300 text-xs">
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
                    <div className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full border border-gray-600/30 bg-gray-800">
                      <User className="h-4 w-4 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && <TypingIndicator agent={currentAgent} />}
            <div ref={messagesEndRef} />
          </div>

          <div className="border-purple-500/20 border-t p-6">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                className="flex-1 rounded-xl border border-purple-500/30 bg-gray-800/50 px-4 py-3 text-white placeholder-gray-400 backdrop-blur-sm transition-all duration-300 focus:border-purple-400/50 focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="flex items-center gap-2 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-900/80 to-purple-700/80 px-6 py-3 text-white shadow-lg shadow-purple-900/20 transition-all duration-300 hover:border-purple-400/50 hover:from-purple-800 hover:to-purple-600 hover:shadow-purple-800/30 disabled:cursor-not-allowed disabled:opacity-50"
              >
                <Send className="h-4 w-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mt-4 rounded-xl border border-red-500/30 bg-red-900/20 p-4 backdrop-blur-sm">
            <p className="text-red-400 text-sm">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
