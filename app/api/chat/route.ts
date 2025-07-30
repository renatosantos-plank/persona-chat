import { createChatGraph } from "@/lib/agent/graph";
import { AIMessage, BaseMessage, HumanMessage } from "@langchain/core/messages";

export const maxDuraction = 30;

export async function POST(req: Request) {
  const { messages } = await req.json();

  const langchainMessages = messages.map((msg: any) => {
    if (msg.role === "user") {
      return new HumanMessage(msg.content);
    } else {
      return new AIMessage(msg.content);
    }
  });

  const lasMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lasMessage.content);

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
