import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

let checkpointerInstance: PostgresSaver | null = null;

export const createCheckpointer = async () => {
  const connectionString = process.env.SUPABASE_CONNECTION_STRING!;
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

export const checkThreadExists = async (threadId: string) => {
  const checkpointer = await getCheckpointer();
  const existing = await checkpointer.get({
    configurable: { thread_id: threadId },
  });
  return existing !== undefined;
};
