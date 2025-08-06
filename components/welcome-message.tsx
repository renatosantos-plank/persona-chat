import { Cloud, Newspaper } from "lucide-react";

export function WelcomeMessage() {
  return (
    <div className="text-center text-gray-400 mt-20">
      <span className="text-white text-2xl">🦇</span>
      <h3 className="text-xl font-semibold mb-2">Welcome to BatBot, mate!</h3>
      <p className="text-sm mb-6">
        I&apos;m your Prince of Darkness in digital form — ask me about the
        weather, the news, or just have a bloody chat, yeah?
      </p>
      <div className="flex justify-center gap-4">
        <div className="flex items-center gap-2 text-xs bg-purple-500/20 px-3 py-1 rounded-full">
          <Cloud className="w-3 h-3" />
          Storm Watcher
        </div>
        <div className="flex items-center gap-2 text-xs bg-red-500/20 px-3 py-1 rounded-full">
          <Newspaper className="w-3 h-3" />
          News Howler
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-500">
        <p>Need help? Try shoutin’ somethin’ like:</p>
        <p className="mt-2 space-y-1">
          <span className="block">
            • &quot;Oi, what’s the weather like out there?&quot;
          </span>
          <span className="block">
            • &quot;Give me the latest chaos in the news!&quot;
          </span>
          <span className="block">• &quot;Let’s talk rock, yeah?&quot;</span>
        </p>
      </div>
    </div>
  );
}
