"use client";

import { useChat } from "@ai-sdk/react";
import { useEffect, useRef, useState } from "react";
import { Send, User, CloudRain, Newspaper, MessageSquare } from "lucide-react";
import { TypingIndicator } from "@/components/typing-indicator";
import { WelcomeMessage } from "@/components/welcome-message";
import { Navbar } from "@/components/navbar";
import { Sidebar } from "@/components/Sidebar";
import { v4 } from "uuid";

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

  useEffect(() => {
    fetch(`/api/history?threadId=${threadId}`)
      .then((r) => r.json())
      .then((data) => {
        setInitialMessages(data.messages);
      });
  }, [threadId]);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

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

      <div className="mx-auto p-6 flex h-[calc(100vh-120px)] gap-6">
        <Sidebar
          selectedId={threadId}
          onSelect={setThreadId}
          onNew={() => setThreadId(v4())}
        />
        <div className="bg-sabbath-overlay backdrop-blur-sm rounded-2xl border-sabbath-glow flex-1 flex flex-col min-w-0">
          <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin min-h-0">
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
                    <div className="w-8 h-8 bg-gradient-to-r from-purple-900 to-purple-700 rounded-full flex items-center justify-center flex-shrink-0 border border-purple-500/30 shadow-lg shadow-purple-900/20">
                      <AgentIcon agentName={agentName} />
                    </div>
                  )}

                  <div
                    className={`max-w-[80%] rounded-2xl px-4 py-3 break-words ${
                      message.role === "user"
                        ? "bg-gradient-to-r from-purple-900/80 to-purple-700/80 text-white border border-purple-500/30 shadow-lg shadow-purple-900/20"
                        : "bg-gray-800/30 border border-purple-500/20 text-gray-100 backdrop-blur-sm"
                    }`}
                  >
                    {agentName && (
                      <div className="text-xs font-bold text-purple-300 mb-1 text-glow-purple">
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
                    <div className="w-8 h-8 bg-gray-800 rounded-full flex items-center justify-center flex-shrink-0 border border-gray-600/30">
                      <User className="w-4 h-4 text-gray-300" />
                    </div>
                  )}
                </div>
              );
            })}

            {isTyping && <TypingIndicator agent={currentAgent} />}
            <div ref={messagesEndRef} />
          </div>

          <div className="p-6 border-t border-purple-500/20">
            <form onSubmit={handleSubmit} className="flex gap-3">
              <input
                className="flex-1 bg-gray-800/50 border border-purple-500/30 rounded-xl px-4 py-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-400/50 transition-all duration-300 backdrop-blur-sm"
                value={input}
                onChange={handleInputChange}
                placeholder="Say something..."
                disabled={isTyping}
              />
              <button
                type="submit"
                disabled={!input.trim() || isTyping}
                className="bg-gradient-to-r from-purple-900/80 to-purple-700/80 text-white px-6 py-3 rounded-xl hover:from-purple-800 hover:to-purple-600 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-300 flex items-center gap-2 border border-purple-500/30 hover:border-purple-400/50 shadow-lg shadow-purple-900/20 hover:shadow-purple-800/30"
              >
                <Send className="w-4 h-4" />
                Send
              </button>
            </form>
          </div>
        </div>

        {error && (
          <div className="mt-4 bg-red-900/20 border border-red-500/30 rounded-xl p-4 backdrop-blur-sm">
            <p className="text-red-400 text-sm">Error: {error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
}
