"use client";

import { Trash2 } from "lucide-react";
import { useState } from "react";

export function ClearHistoryButton({
  threadId,
  onHistoryCleared,
}: {
  threadId: string;
  onHistoryCleared: () => void;
}) {
  const [isLoading, setIsLoading] = useState(false);
  const handleClearHistory = async () => {
    if (
      !confirm(
        "Are you sure you want to clear this conversation history? This action cannot be undone"
      )
    ) {
      return;
    }
    setIsLoading(true);

    try {
      const response = await fetch(`/api/history?threadId=${threadId}`, {
        method: "DELETE",
      });

      if (!response.ok) {
        throw new Error("Failed to clear history");
      }

      onHistoryCleared?.();
    } catch (error) {
      console.error("Error clearing history:", error);
      alert("Failed to clear history. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <button
      type="button"
      onClick={handleClearHistory}
      className={
        "flex items-center gap-2 rounded-xl border border-red-500/30 bg-gradient-to-r from-red-900/80 to-red-700/80 px-4 py-2 text-sm text-white transition-all duration-300 hover:border-red-400/50 hover:from-red-800 hover:to-red-600 disabled:cursor-not-allowed disabled:opacity-50"
      }
      title="Clear conversation history"
    >
      <Trash2 className="h-4 w-4" />
      {isLoading ? "Clearing..." : "Clear History"}
    </button>
  );
}
