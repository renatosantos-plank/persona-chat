import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { model, systemPrompt } from "./model";
import type ChatState from "./types";

export async function chatNode(state: typeof ChatState.State) {
  const { messages } = state;

  const lastMessage = messages[messages.length - 1];
  const userInput = lastMessage.content as string;

  const messagesWithSystemPrompt = [
    systemPrompt,
    ...messages.slice(0, -1),
    new HumanMessage(userInput),
  ];

  const response = await model.invoke(messagesWithSystemPrompt);

  const aiMessage = new AIMessage(response.content as string);

  return {
    messages: [aiMessage],
    next: "end",
  };
}
