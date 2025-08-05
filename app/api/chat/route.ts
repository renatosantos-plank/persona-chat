import { createChatGraph } from "@/lib/agent/graph";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";
import { v4 } from "uuid";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, threadId } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lastMessage.content);

  const app = createChatGraph();

  const currentThreadId = threadId || v4();
  const config = { configurable: { thread_id: currentThreadId } };

  const result = await app.invoke(
    {
      messages: [newUserMessage],
    },
    config
  );

  // Find the AI response (should be the last message that's not the input)
  const aiMessages = result.messages.filter(
    (msg: BaseMessage) => msg.getType() === "ai"
  );

  // Get the most recent AI message
  const latestAiMessage = aiMessages[aiMessages.length - 1];

  return Response.json({
    messages: [
      {
        id: latestAiMessage.id || Math.random().toString(),
        role: "assistant",
        content: latestAiMessage.content,
        parts: [
          {
            type: "text",
            text: latestAiMessage.content as string,
          },
        ],
      },
    ],
    threadId: currentThreadId,
  });
}
