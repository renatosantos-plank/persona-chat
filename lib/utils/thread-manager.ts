import { v4 } from "uuid";

export const generateThreadId = (): string => {
  return `thread_${Date.now()}_${v4()}`;
};

export const getOrCreateThreadId = (): string => {
  if (typeof window === "undefined") {
    return generateThreadId();
  }

  let threadId = localStorage.getItem("chat_thread_id");
  if (!threadId) {
    threadId = generateThreadId();
    localStorage.setItem("chat_thread_id", threadId);
  }
  return threadId;
};

export const clearThreadId = (): void => {
  if (typeof window !== "undefined") {
    localStorage.removeItem("chat_thread_id");
  }
};
