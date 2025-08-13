export function TypingIndicator({ agent }: { agent?: string }) {
  return (
    <div className="flex gap-3 justify-start">
      <div className="w-8 h-8 bg-gradient-to-r from-purple-900 to-purple-700 rounded-full flex items-center justify-center border border-purple-500/30 shadow-lg shadow-purple-900/20">
        <span className="text-purple-300 text-lg">🦇</span>
      </div>
      <div className="bg-gray-800/30 border border-purple-500/20 rounded-2xl px-4 py-3 backdrop-blur-sm">
        <div className="flex items-center gap-2">
          <div className="flex gap-1">
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"
              style={{ animationDelay: "0ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"
              style={{ animationDelay: "150ms" }}
            ></div>
            <div
              className="w-2 h-2 bg-purple-400 rounded-full animate-bounce shadow-sm shadow-purple-400/50"
              style={{ animationDelay: "300ms" }}
            ></div>
          </div>
          <span className="text-sm text-gray-300 font-medium">
            {agent ? `${agent} Agent` : "Master"} is channeling the void...
          </span>
        </div>
      </div>
    </div>
  );
}
