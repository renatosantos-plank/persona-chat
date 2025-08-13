export function TypingIndicator({ agent }: { agent?: string }) {
	return (
		<div className="flex justify-start gap-3">
			<div className="flex h-8 w-8 items-center justify-center rounded-full border border-purple-500/30 bg-gradient-to-r from-purple-900 to-purple-700 shadow-lg shadow-purple-900/20">
				<span className="text-lg text-purple-300">🦇</span>
			</div>
			<div className="rounded-2xl border border-purple-500/20 bg-gray-800/30 px-4 py-3 backdrop-blur-sm">
				<div className="flex items-center gap-2">
					<div className="flex gap-1">
						<div
							className="h-2 w-2 animate-bounce rounded-full bg-purple-400 shadow-purple-400/50 shadow-sm"
							style={{ animationDelay: "0ms" }}
						/>
						<div
							className="h-2 w-2 animate-bounce rounded-full bg-purple-400 shadow-purple-400/50 shadow-sm"
							style={{ animationDelay: "150ms" }}
						/>
						<div
							className="h-2 w-2 animate-bounce rounded-full bg-purple-400 shadow-purple-400/50 shadow-sm"
							style={{ animationDelay: "300ms" }}
						/>
					</div>
					<span className="font-medium text-gray-300 text-sm">
						{agent ? `${agent} Agent` : "Master"} is channeling the void...
					</span>
				</div>
			</div>
		</div>
	);
}
