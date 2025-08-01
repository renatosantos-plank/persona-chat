import { END, START, StateGraph } from "@langchain/langgraph";
import ChatState from "./types";
import { chatNode, newsAgent, weatherAgent } from "./nodes";

export function createChatGraph() {
  const workflow = new StateGraph(ChatState)
    .addNode("chat", chatNode)
    .addNode("weather", weatherAgent)
    .addNode("news", newsAgent)
    .addEdge(START, "chat")
    .addConditionalEdges("chat", (state) => state.next, {
      weather: "weather",
      news: "news",
      end: END,
    })
    .addEdge("weather", END)
    .addEdge("news", END);

  return workflow.compile();
}
