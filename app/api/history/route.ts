import { getCheckpointer } from "@/lib/agent/checkpointer";
import { NextRequest, NextResponse } from "next/server";
import { deserializeMessagesToAISDK } from "@/lib/utils/message-mapper";
const checkpointer = await getCheckpointer();

export async function GET(req: NextRequest) {
  const searchParams = req.nextUrl.searchParams;
  const threadId = searchParams.get("threadId") ?? "";
  if (!threadId) return NextResponse.json({ messages: [] }, { status: 200 });

  const cp = await checkpointer.get({
    configurable: { thread_id: threadId },
  });

  const messages = deserializeMessagesToAISDK(cp?.channel_values?.messages);

  return NextResponse.json({ messages }, { status: 200 });
}
