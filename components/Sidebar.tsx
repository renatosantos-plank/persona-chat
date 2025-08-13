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
		<aside className="flex w-72 flex-shrink-0 flex-col overflow-y-auto rounded-2xl border-sabbath-glow bg-sabbath-overlay backdrop-blur-sm">
			<div className="flex items-center justify-between border-purple-500/20 border-b p-6">
				<h2 className="font-bold text-glow-purple text-lg text-white">
					Aaall aboard!
				</h2>
				<button
					type="button"
					onClick={onNew}
					className="flex animate-sabbath-pulse items-center gap-2 rounded-xl border border-purple-500/30 bg-gradient-to-r from-purple-900/80 to-purple-700/80 px-4 py-2 text-sm text-white transition-all duration-300 hover:border-purple-400/50 hover:from-purple-800 hover:to-purple-600"
				>
					<Plus className="h-4 w-4" />
					New
				</button>
			</div>

			<div className="p-4">
				{threads.length === 0 ? (
					<div className="py-8 text-center">
						<MessageSquare className="mx-auto mb-4 h-12 w-12 text-purple-400 opacity-60" />
						<p className="font-medium text-gray-300 text-sm">
							No conversations yet
						</p>
						<p className="mt-1 text-gray-500 text-xs">
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
									className={`group w-full rounded-xl p-4 text-left transition-all duration-300 ${
										selectedId === thread.thread_id
											? "border-purple-500/50 bg-purple-900/40 shadow-lg shadow-purple-900/20"
											: "border border-transparent hover:border-purple-500/20 hover:bg-gray-800/30"
									}`}
								>
									<div className="flex items-start justify-between">
										<div className="min-w-0 flex-1">
											<div
												className={`truncate font-semibold transition-colors ${
													selectedId === thread.thread_id
														? "text-glow-purple text-purple-200"
														: "text-gray-200 group-hover:text-purple-300"
												}`}
											>
												{thread.title}
											</div>
											<div className="mt-2 flex items-center gap-2 text-gray-400 text-xs">
												<Clock className="h-3 w-3" />
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
