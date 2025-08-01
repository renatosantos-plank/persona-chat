import { Annotation } from "@langchain/langgraph";
import type { BaseMessage } from "@langchain/core/messages";

export const ChatState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (state: BaseMessage[], update: BaseMessage[]) =>
      state.concat(update),
    default: () => [],
  }),
  next: Annotation<string>(),
});

export type FrontendMessage = {
  role: "user" | "assistant";
  content: string;
};

export default ChatState;
