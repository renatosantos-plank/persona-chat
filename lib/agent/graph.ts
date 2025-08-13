import { END, START, StateGraph } from "@langchain/langgraph";
import ChatState from "./types";
import {
	chatNode,
	newsAgent,
	summarizeConversation,
	weatherAgent,
} from "./nodes";
import { getCheckpointer } from "./checkpointer";

const MAX_USER_MESSAGES_STATE_SIZE = 6;

function shouldContinue(state: typeof ChatState.State) {
	const messages = state.messages;
	if (state.next === "weather" || state.next === "news") {
		return state.next;
	}
	const userMessageCount = messages.filter(
		(msg) => msg.getType() === "human",
	).length;

	if (userMessageCount > MAX_USER_MESSAGES_STATE_SIZE) {
		return "summarize_conversation";
	}
	return state.next;
}
const workflow = new StateGraph(ChatState)
	.addNode("chat", chatNode)
	.addNode("weather", weatherAgent)
	.addNode("news", newsAgent)
	.addNode("summarize_conversation", summarizeConversation)
	.addEdge(START, "chat")
	.addConditionalEdges("chat", shouldContinue, {
		summarize_conversation: "summarize_conversation",
		weather: "weather",
		news: "news",
		end: END,
	})
	.addEdge("weather", END)
	.addEdge("news", END);

export const createChatGraph = async () => {
	const checkpointer = await getCheckpointer();
	return workflow.compile({ checkpointer });
};
