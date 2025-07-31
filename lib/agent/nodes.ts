import { AIMessage } from "@langchain/core/messages";
import { chatPrompt, model } from "./model";
import type { ChatStateType } from "./types";

export async function chatNode(
  state: ChatStateType
): Promise<Partial<ChatStateType>> {
  const { messages } = state;

  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content as string;

  const formattedMessages = messages
    .slice(0, -1)
    .map(
      (msg) =>
        `${msg.getType() === "human" ? "User" : "Assistant"}: ${msg.content}`
    )
    .join("\n");

  const formattedPrompt = await chatPrompt.format({
    messages: formattedMessages,
    input: userInput,
  });

  const response = await model.invoke(formattedPrompt);

  const aiMessage = new AIMessage(response.content as string);

  return {
    messages: [aiMessage],
    next: "end",
  };
}
