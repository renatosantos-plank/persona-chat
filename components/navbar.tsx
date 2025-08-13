"use client";

import { LogoutButton } from "./logout-button";

export function Navbar() {
	return (
		<nav className="border-gray-800 border-b bg-gray-900 px-4 py-3">
			<div className="mx-auto flex max-w-4xl items-center justify-between">
				<div className="flex items-center space-x-4">
					<h1 className="font-bold text-purple-400 text-xl">🦇 Bat</h1>
					<span className="text-gray-400 text-sm">AI Chat Assistant</span>
				</div>

				<div className="flex items-center space-x-4">
					<LogoutButton />
				</div>
			</div>
		</nav>
	);
}
