import { chatGraph } from "@/lib/agent/graph";
import {
  AIMessage,
  HumanMessage,
  isAIMessageChunk,
} from "@langchain/core/messages";
import { NextRequest, NextResponse } from "next/server";
import {
  createDataStreamResponse,
  DataStreamWriter,
  LangChainAdapter,
  createUIMessageStreamResponse,
} from "ai";

const convertLangChainMessageToVercelMessage = (message: BaseMessage) => {
  if (message.getType() === "human") {
    return { content: message.content, role: "user" };
  } else if (message.getType() === "ai") {
    return {
      content: message.content,
      role: "assistant",
      tool_calls: (message as AIMessage).tool_calls,
    };
  } else {
    return { content: message.content, role: message.getType() };
  }
};

export async function POST(req: NextRequest) {
  const { messages, threadId } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lastMessage.content);

  const config = {
    configurable: { thread_id: threadId || Math.random().toString() },
  };

  const stream = await chatGraph.stream(
    {
      messages: [newUserMessage],
    },
    { ...config, streamMode: "messages" }
  );

  return createDataStreamResponse({
    headers: {
      "Content-Type": "text/event-stream",
      "Cache-Control": "no-cache",
      Connection: "keep-alive",
      "X-Vercel-AI-Agent": "v1",
    },
    execute: async (dataStream: DataStreamWriter) => {
      try {
        for await (const [message, _metadata] of stream) {
          if (isAIMessageChunk(message) && !(message instanceof AIMessage)) {
            // const capitalizedNode = _metadata.langgraph_node.charAt()
            dataStream.write(`${message.content}`);
          } else {
            console.log("---->", message.getType());
          }
        }
      } catch (error) {
        console.error("Streaming error: ", error);
      }
    },
  });
}
