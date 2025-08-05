import { chatGraph } from "@/lib/agent/graph";
import { BaseMessage, HumanMessage } from "@langchain/core/messages";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages, threadId } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lastMessage.content);

  const currentThreadId = threadId || Math.random().toString();

  const config = { configurable: { thread_id: currentThreadId } };

  const result = await chatGraph.invoke(
    {
      messages: [newUserMessage],
    },
    config
  );
  // Find the AI response (should be the last message that's not the input)
  const aiMessages = result.messages.filter(
    (msg: BaseMessage) => msg.getType() === "ai"
  );
  console.log("==================================> Messages from route\n\n\n");
  console.log(aiMessages, "\n\n");

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
