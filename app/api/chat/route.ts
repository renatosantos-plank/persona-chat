import {
  AIMessage,
  HumanMessage,
  isAIMessageChunk,
} from "@langchain/core/messages";
import { NextRequest } from "next/server";
import { createDataStreamResponse, DataStreamWriter } from "ai";
import { createChatGraph } from "@/lib/agent/graph";

export async function POST(req: NextRequest) {
  const { messages, threadId } = await req.json();

  const lastMessage = messages[messages.length - 1];
  const newUserMessage = new HumanMessage(lastMessage.content);

  const config = {
    configurable: { thread_id: threadId || Math.random().toString() },
  };

  const chatGraph = await createChatGraph();

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
        let currentNode: string | null = null;
        for await (const [message, _metadata] of stream) {
          if (isAIMessageChunk(message) && !(message instanceof AIMessage)) {
            console.log("---->", _metadata);
            const nodeName =
              _metadata.langgraph_node.charAt(0).toUpperCase() +
              _metadata.langgraph_node.slice(1);

            if (nodeName && nodeName !== currentNode) {
              currentNode = nodeName;
              const agentData = { agent: currentNode };
              dataStream.writeMessageAnnotation(agentData);
            }
            dataStream.write(`0:${JSON.stringify(message.content)}\n`);
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
