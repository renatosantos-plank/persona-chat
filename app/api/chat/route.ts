import { createChatGraph } from "@/lib/agent/graph";
import { FrontendMessage } from "@/lib/agent/types";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

export const maxDuration = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const langchainMessages = messages.map((msg: FrontendMessage) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else {
      return new AIMessage(msg.content);
    }
  });

  const lastMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lastMessage.content);

  const app = createChatGraph();
  const result = await app.invoke({
    messages: [...langchainMessages.slice(0, -1), newUserMessage],
  });

  return Response.json({
    messages: result.messages.map((msg: BaseMessage) => ({
      id: msg.id || Math.random().toString(),
      role: msg.getType() === "human" ? "user" : "assistant",
      content: msg.content,
      // Add the parts array that useChat expects
      parts: [
        {
          type: "text",
          text: msg.content as string,
        },
      ],
    })),
  });
}
