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

  const app = createChatGraph();

  try {
    const result = await app.invoke({
      messages: langchainMessages,
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
  } catch (error) {
    console.error("Chat graph error:", error);
    return Response.json(
      {
        messages: [
          {
            id: Math.random().toString(),
            role: "assistant",
            content:
              "Bloody hell, mate! Something went wrong. SHARON! Can you try again?",
            parts: [
              {
                type: "text",
                text: "Bloody hell, mate! Something went wrong. SHARON! Can you try again?",
              },
            ],
          },
        ],
      },
      { status: 500 }
    );
  }
}
