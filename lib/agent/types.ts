import { Annotation, END, MessagesAnnotation } from "@langchain/langgraph";

export const ChatState = Annotation.Root({
	...MessagesAnnotation.spec,
	next: Annotation<string>({
		reducer: (state, update) => update ?? state ?? END,
		default: () => END,
	}),
	summary: Annotation<string>({
		reducer: (state, update) => update ?? state ?? "",
		default: () => "",
	}),
});

export type FrontendMessage = {
	role: "user" | "assistant";
	content: string;
};

export default ChatState;
