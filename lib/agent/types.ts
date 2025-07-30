import { Annotation } from "@langchain/langgraph";
import { BaseMessage } from "@langchain/core/messages";

export const ChatState = Annotation.Root({
  messages: Annotation<BaseMessage[]>({
    reducer: (state: BaseMessage[], update: BaseMessage[]) =>
      state.concat(update),
    default: () => [],
  }),
  next: Annotation<string>(),
});

export type ChatStateType = typeof ChatState.State;
export default ChatState;
