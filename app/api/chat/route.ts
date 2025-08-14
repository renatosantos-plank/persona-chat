import {
	AIMessage,
	AIMessageChunk,
	HumanMessage,
} from "@langchain/core/messages";
import { createDataStreamResponse, type DataStreamWriter } from "ai";
import { type NextRequest, NextResponse } from "next/server";
import { createChatGraph } from "@/lib/agent/graph";
import { createClient } from "@/lib/supabase/server";

const titleFrom = (t: string) => t.trim().split(/\r?\n/)[0].slice(0, 60);

export async function POST(req: NextRequest) {
	const { messages, threadId } = await req.json();
	const supabase = await createClient();

	const {data: {user}, error: userError} = await supabase.auth.getUser();
	if (userError || !user) { return NextResponse.json({error: 'Unauthorized'}, {status: 401})}

	const userId = user.id
	const lastMessage = messages[messages.length - 1];
	const newUserMessage = new HumanMessage(lastMessage.content);

	const { data: existingThread } = await supabase
		.from('threads')
		.select('thread_id')
		.eq('thread_id', threadId)
		.single();

	if (existingThread) {
		await supabase
			.from('threads')
			.update({ updated_at: new Date().toISOString() })
			.eq('thread_id', threadId);
	} else {
		await supabase
			.from('threads')
			.insert({
				thread_id: threadId,
				user_id: userId,
				title: titleFrom(lastMessage.content) || "New chat"
			});
	}
	
	const config = {
	configurable: { thread_id: threadId },
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
					if (!(message instanceof AIMessage) && message instanceof AIMessageChunk) {
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
