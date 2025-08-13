import { type NextRequest, NextResponse } from "next/server";
import { Pool } from "pg";
import { checkThreadExists, getCheckpointer } from "@/lib/agent/checkpointer";
import { deserializeMessagesToAISDK } from "@/lib/utils/message-mapper";

const pool = new Pool({
	connectionString: process.env.SUPABASE_CONNECTION_STRING,
});
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

	const messages = deserializeMessagesToAISDK(cp?.channel_values?.messages);

	return NextResponse.json({ messages }, { status: 200 });
}



export async function DELETE(req: NextRequest) {
	const client = await pool.connect()

	try {
		const searchParams = req.nextUrl.searchParams
		const threadId = searchParams.get("threadId")

		if (!threadId) {
			return NextResponse.json(
				{error: "Thread ID is required"}, {status: 400}
			)
		}

		await client.query("begin");
    await client.query("delete from public.checkpoint_writes where thread_id = $1", [threadId]);
    await client.query("delete from public.checkpoint_blobs  where thread_id = $1", [threadId]);
    await client.query("delete from public.checkpoints       where thread_id = $1", [threadId]);
    await client.query("delete from public.threads           where thread_id = $1", [threadId]);
    await client.query("commit");
		
		return NextResponse.json({message: "Thread history cleared successfully"}, {status: 200})
	} catch(error) {
		console.error("Error clearing thread history: ", error)
		return NextResponse.json({
			error: "Failed to clear thread history"
		}, {
			status: 500
		})
	} finally {

	}
}