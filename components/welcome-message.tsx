import { Cloud, Newspaper } from "lucide-react";

export function WelcomeMessage() {
  return (
    <div className="mt-20 text-center text-gray-300">
      <span className="mb-4 block text-4xl text-purple-400">🦇</span>
      <h3 className="mb-3 font-bold text-2xl text-glow-purple">BAT</h3>
      <p className="mx-auto mb-6 max-w-md text-gray-300 text-sm">
        Enter the void where darkness meets knowledge. I am your guide through
        the realms of weather, news, and conversation.
      </p>
      <div className="mb-6 flex justify-center gap-4">
        <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-900/40 px-3 py-2 text-xs backdrop-blur-sm">
          <Cloud className="h-3 w-3 text-cyan-300" />
          <span className="text-purple-200">SkyBat</span>
        </div>
        <div className="flex items-center gap-2 rounded-full border border-purple-500/30 bg-purple-900/40 px-3 py-2 text-xs backdrop-blur-sm">
          <Newspaper className="h-3 w-3 text-amber-300" />
          <span className="text-purple-200">BulletinBat</span>
        </div>
      </div>
      <div className="mx-auto mt-6 max-w-sm text-gray-400 text-xs">
        <p className="mb-3 font-medium text-purple-300">Begin your journey:</p>
        <div className="space-y-2 text-left">
          <div className="rounded-lg border border-purple-500/20 bg-gray-800/30 p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">
              &ldquo;What darkness lies in the weather today?&rdquo;
            </span>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-gray-800/30 p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">
              &ldquo;Reveal the chaos in the world&apos;s news&rdquo;
            </span>
          </div>
          <div className="rounded-lg border border-purple-500/20 bg-gray-800/30 p-3 backdrop-blur-sm">
            <span className="text-purple-300">•</span>
            <span className="ml-2">
              &ldquo;Let us converse in the shadows&rdquo;
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
