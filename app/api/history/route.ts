import type { BaseMessage } from "@langchain/core/messages";
import { type NextRequest, NextResponse } from "next/server";
import { checkThreadExists, getCheckpointer } from "@/lib/agent/checkpointer";
import { createClient } from "@/lib/supabase/server";
import { deserializeMessagesToAISDK } from "@/lib/utils/message-mapper";

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const threadId = searchParams.get("threadId") ?? "";
	const supabase = await createClient();
	const {data: {user}, error: userError} = await supabase.auth.getUser();
	
	if (userError || !user) {
		return NextResponse.json({error: 'Unauthorized'}, {status: 401})
	}
	
	const existing = await checkThreadExists(threadId);
	if (existing === false) {
		return NextResponse.json({ messages: [] }, { status: 200 });
	}

	const checkpointer = await getCheckpointer();
	const cp = await checkpointer.get({
		configurable: { thread_id: threadId },
	});

	
	const messages = deserializeMessagesToAISDK(cp?.channel_values?.messages as BaseMessage[]);

	return NextResponse.json({ messages }, { status: 200 });
}

export async function DELETE(req: NextRequest) {
	const supabase = await createClient();

	try {
		const { data: { user }, error: useError } = await supabase.auth.getUser();

		if (useError || !user) {
			return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
		}

		const userId = user.id;
		const searchParams = req.nextUrl.searchParams
		const threadId = searchParams.get("threadId")

		if (!threadId) {
			return NextResponse.json(
				{error: "Thread ID is required"}, {status: 400}
			)
		}

		const checkpointer = await getCheckpointer();
		await checkpointer.deleteThread(threadId)

		const { error: dbError } = await supabase
			.from('threads')
			.delete()
			.eq('thread_id', threadId)
			.eq('user_id', userId)
		
		if (dbError) {
			console.error("Error deleting thread from database:", dbError)
			return NextResponse.json({
				error: 'Failed to delete thread from database'
			}, { status: 500 })
		}

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