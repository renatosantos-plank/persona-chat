import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

let checkpointerInstance: PostgresSaver | null = null;

export const createCheckpointer = async () => {
	// Use the direct connection string from Supabase
	const connectionString = process.env.SUPABASE_DIRECT_URL || process.env.SUPABASE_CONNECTION_STRING!;
	
	if (!connectionString) {
		throw new Error('SUPABASE_DIRECT_URL or SUPABASE_CONNECTION_STRING environment variable is required');
	}
	
	const checkpointer = PostgresSaver.fromConnString(connectionString);
	await checkpointer.setup();
	return checkpointer;
};

export const getCheckpointer = async () => {
	if (!checkpointerInstance) {
		checkpointerInstance = await createCheckpointer();
	}
	return checkpointerInstance;
};

export const createUserThreadId = (userId: string, threadId: string) => {
	return `${userId}:${threadId}`
}

export const checkThreadExists = async ( threadId: string) => {
	const checkpointer = await getCheckpointer();
	const existing = await checkpointer.get({
		configurable: { thread_id: threadId },
	});
	return existing !== undefined;
};
