import { END, START, StateGraph } from "@langchain/langgraph";
import ChatState from "./types";
import { chatNode } from "./nodes";

export function createChatGraph() {
  const workflow = new StateGraph(ChatState)
    .addNode("chat", chatNode)
    .addEdge(START, "chat")
    .addConditionalEdges("chat", (state) => state.next, { end: END });

  return workflow.compile();
}
