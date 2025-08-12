import { PostgresSaver } from "@langchain/langgraph-checkpoint-postgres";

export const createCheckpointer = async () => {
  const connectionString = process.env.SUPABASE_CONNECTION_STRING!;
  const checkpointer = PostgresSaver.fromConnString(connectionString);

  await checkpointer.setup();
  return checkpointer;
};

export const getCheckpointer = async () => {
  return await createCheckpointer();
};
