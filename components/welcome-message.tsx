import { Cloud, Newspaper } from "lucide-react";

export function WelcomeMessage() {
  return (
    <div className="text-center text-gray-300 mt-20">
      <span className="text-purple-400 text-4xl mb-4 block">🦇</span>
      <h3 className="text-2xl font-bold mb-3 text-glow-purple">Bat</h3>
      <p className="text-sm mb-6 text-gray-300 max-w-md mx-auto">
        Enter the void where darkness meets knowledge. I am your guide through
        the realms of weather, news, and conversation.
      </p>
      <div className="flex justify-center gap-4 mb-6">
        <div className="flex items-center gap-2 text-xs bg-purple-900/40 border border-purple-500/30 px-3 py-2 rounded-full backdrop-blur-sm">
          <Cloud className="w-3 h-3 text-cyan-300" />
          <span className="text-purple-200">SkyBat</span>
        </div>
        <div className="flex items-center gap-2 text-xs bg-purple-900/40 border border-purple-500/30 px-3 py-2 rounded-full backdrop-blur-sm">
          <Newspaper className="w-3 h-3 text-amber-300" />
          <span className="text-purple-200">BulletinBat</span>
        </div>
      </div>
      <div className="mt-6 text-xs text-gray-400 max-w-sm mx-auto">
        <p className="text-purple-300 font-medium mb-3">Begin your journey:</p>
        <div className="space-y-2 text-left">
          <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">
              "What darkness lies in the weather today?"
            </span>
          </div>
          <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">"Reveal the chaos in the world's news"</span>
          </div>
          <div className="bg-gray-800/30 border border-purple-500/20 rounded-lg p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">"Let us converse in the shadows"</span>
          </div>
        </div>
      </div>
    </div>
  );
}
