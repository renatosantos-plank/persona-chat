import type { BaseMessage } from "@langchain/core/messages";
import { type NextRequest, NextResponse } from "next/server";
import { checkThreadExists, getCheckpointer } from "@/lib/agent/checkpointer";
import { createClient } from "@/lib/supabase/server";
import { deserializeMessagesToAISDK } from "@/lib/utils/message-mapper";

const checkpointer = await getCheckpointer();

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const threadId = searchParams.get("threadId") ?? "";
	const existing = await checkThreadExists(threadId);
	if (existing === false) {
		return NextResponse.json({ messages: [] }, { status: 200 });
	}

	const cp = await checkpointer.get({
		configurable: { thread_id: threadId },
	});

	const messages = deserializeMessagesToAISDK(cp?.channel_values?.messages as BaseMessage[]);

	return NextResponse.json({ messages }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
	const supabase = await createClient();

	try {
		const searchParams = req.nextUrl.searchParams
		const threadId = searchParams.get("threadId")

		if (!threadId) {
			return NextResponse.json(
				{error: "Thread ID is required"}, {status: 400}
			)
		}

		// Use Supabase client instead of direct PostgreSQL queries
		await supabase.rpc('clear_thread_history', { thread_id: threadId });
		
		return NextResponse.json({message: "Thread history cleared successfully"}, {status: 200})
	} catch(error) {
		console.error("Error clearing thread history: ", error)
		return NextResponse.json({
			error: "Failed to clear thread history"
		}, {
			status: 500
		})
	}
}