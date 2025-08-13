import { checkThreadExists, getCheckpointer } from "@/lib/agent/checkpointer";
import { type NextRequest, NextResponse } from "next/server";
import { deserializeMessagesToAISDK } from "@/lib/utils/message-mapper";

const checkpointer = await getCheckpointer();

export async function GET(req: NextRequest) {
	const searchParams = req.nextUrl.searchParams;
	const threadId = searchParams.get("threadId") ?? "";
	console.log("test");
	const existing = await checkThreadExists(threadId);
	console.log("existing", existing);
	if (existing === false) {
		console.log("entrou");
		return NextResponse.json({ messages: [] }, { status: 200 });
	}
	console.log("test2");

	const cp = await checkpointer.get({
		configurable: { thread_id: threadId },
	});

	const messages = deserializeMessagesToAISDK(cp?.channel_values?.messages);

	return NextResponse.json({ messages }, { status: 200 });
}
