import {
	AIMessage,
	HumanMessage,
} from "@langchain/core/messages";
import { createDataStreamResponse, type DataStreamWriter } from "ai";
import type { NextRequest } from "next/server";
import { createChatGraph } from "@/lib/agent/graph";
import { createClient } from "@/lib/supabase/server";

const titleFrom = (t: string) => t.trim().split(/\r?\n/)[0].slice(0, 60);

export async function POST(req: NextRequest) {
	const { messages, threadId } = await req.json();
	const supabase = await createClient();

	const lastMessage = messages[messages.length - 1];
	const newUserMessage = new HumanMessage(lastMessage.content);

	// Replace direct PostgreSQL query with Supabase client
	await supabase
		.from('threads')
		.upsert(
			{ 
				thread_id: threadId, 
				title: titleFrom(lastMessage.content) || "New chat" 
			},
			{ onConflict: 'thread_id' }
		);
	
	const config = {
		configurable: { thread_id: threadId || Math.random().toString() },
	};

	const chatGraph = await createChatGraph();

	const stream = await chatGraph.stream(
		{
			messages: [newUserMessage],
		},
		{ ...config, streamMode: "messages" },
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
					if (!(message instanceof AIMessage)) {
						const nodeName =
							_metadata.langgraph_node.charAt(0).toUpperCase() +
							_metadata.langgraph_node.slice(1);

						if (nodeName && nodeName !== currentNode) {
							currentNode = nodeName;
							const agentData = { agent: currentNode };
							dataStream.writeMessageAnnotation(agentData);
						}
						dataStream.write(`0:${JSON.stringify(message.content)}\n`);
					} 
				}
			} catch (error) {
				console.error("Streaming error: ", error);
			}
		},
	});
}
