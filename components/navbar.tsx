"use client";

import { LogoutButton } from "./logout-button";

export function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-4 py-3">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <div className="flex items-center space-x-4">
          <h1 className="text-xl font-bold text-purple-400">🦇 BatBot</h1>
          <span className="text-gray-400 text-sm">AI Chat Assistant</span>
        </div>

        <div className="flex items-center space-x-4">
          <LogoutButton />
        </div>
      </div>
    </nav>
  );
}
