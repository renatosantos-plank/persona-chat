import { END, START, StateGraph } from "@langchain/langgraph";
import ChatState from "./types";
import {
  chatNode,
  newsAgent,
  summarizeConversation,
  weatherAgent,
} from "./nodes";
import { memorySaver } from "./memory";

function shouldContinue(state: typeof ChatState.State) {
  const messages = state.messages;

  if (messages.length > 6) {
    return "summarize_conversation";
  }

  return state.next;
}

export function createChatGraph() {
  const workflow = new StateGraph(ChatState)
    .addNode("chat", chatNode)
    .addNode("weather", weatherAgent)
    .addNode("news", newsAgent)
    .addNode("summarize_conversation", summarizeConversation)
    .addEdge(START, "chat")
    .addConditionalEdges("chat", shouldContinue, {
      // the third argument represents where goes to depending of the result of the second argument
      weather: "weather",
      news: "news",
      summarize_conversation: "summarize_conversation",
      end: END,
    })
    .addEdge("weather", END)
    .addEdge("news", END)
    .addEdge("summarize_conversation", END);

  return workflow.compile({
    checkpointer: memorySaver,
  });
}
