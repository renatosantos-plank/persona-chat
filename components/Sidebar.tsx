"use client";

import { useEffect, useState } from "react";
import { Plus, MessageSquare, Clock } from "lucide-react";

interface Thread {
  thread_id: string;
  title: string;
  updated_at: string;
}

interface SidebarProps {
  selectedId: string;
  onSelect: (id: string) => void;
  onNew: () => void;
}

export function Sidebar({ selectedId, onSelect, onNew }: SidebarProps) {
  const [threads, setThreads] = useState<Thread[]>([]);

  useEffect(() => {
    fetch("/api/threads")
      .then((r) => r.json())
      .then((data) => setThreads(data.threads));
  }, []);

  return (
    <aside className="w-72 flex-shrink-0 bg-sabbath-overlay backdrop-blur-sm rounded-2xl border-sabbath-glow overflow-y-auto flex flex-col">
      <div className="p-6 border-b border-purple-500/20 flex items-center justify-between">
        <h2 className="font-bold text-white text-lg text-glow-purple">
          Aaall aboard!
        </h2>
        <button
          type="button"
          onClick={onNew}
          className="bg-gradient-to-r from-purple-900/80 to-purple-700/80 text-white px-4 py-2 rounded-xl hover:from-purple-800 hover:to-purple-600 transition-all duration-300 flex items-center gap-2 text-sm border border-purple-500/30 hover:border-purple-400/50 animate-sabbath-pulse"
        >
          <Plus className="w-4 h-4" />
          New
        </button>
      </div>

      <div className="p-4">
        {threads.length === 0 ? (
          <div className="text-center py-8">
            <MessageSquare className="w-12 h-12 text-purple-400 mx-auto mb-4 opacity-60" />
            <p className="text-gray-300 text-sm font-medium">
              No conversations yet
            </p>
            <p className="text-gray-500 text-xs mt-1">
              Begin your journey into the void
            </p>
          </div>
        ) : (
          <ul className="space-y-2">
            {threads.map((thread) => (
              <li key={thread.thread_id}>
                <button
                  onClick={() => onSelect(thread.thread_id)}
                  type="button"
                  className={`w-full text-left p-4 rounded-xl transition-all duration-300 group ${
                    selectedId === thread.thread_id
                      ? "bg-purple-900/40 border-purple-500/50 shadow-lg shadow-purple-900/20"
                      : "hover:bg-gray-800/30 border border-transparent hover:border-purple-500/20"
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1 min-w-0">
                      <div
                        className={`font-semibold truncate transition-colors ${
                          selectedId === thread.thread_id
                            ? "text-purple-200 text-glow-purple"
                            : "text-gray-200 group-hover:text-purple-300"
                        }`}
                      >
                        {thread.title}
                      </div>
                      <div className="flex items-center gap-2 mt-2 text-xs text-gray-400">
                        <Clock className="w-3 h-3" />
                        <span>
                          {new Date(thread.updated_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </aside>
  );
}
