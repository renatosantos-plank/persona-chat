import { END, MemorySaver, START, StateGraph } from "@langchain/langgraph";
import ChatState from "./types";
import { chatNode, newsAgent, weatherAgent } from "./nodes";

const checkpointer = new MemorySaver();

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

export const chatGraph = workflow.compile({ checkpointer });
