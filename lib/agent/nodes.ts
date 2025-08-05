import { AIMessage, HumanMessage } from "@langchain/core/messages";
import { model, systemPrompt } from "./model";
import type ChatState from "./types";
import { fetchWeather, fetchNews } from "./tools";

// Specialized system prompts for each agent
const weatherSystemPrompt = new HumanMessage(`
You are the Weather Agent, a specialized AI that handles all weather-related queries. You're still Bat Agent's personality but focused on weather information.

When users ask about weather:
1. Extract the location from their query
2. Use the fetch_weather tool to get current weather data
3. Present the information in a friendly, Ozzy-style manner
4. Always include temperature, conditions, and humidity if available

Remember: You're still Bat Agent - use phrases like "bloody hell", "mate", "innit", etc.
`);

const newsSystemPrompt = new HumanMessage(`
You are the News Agent, a specialized AI that handles all news-related queries. You're still Bat Agent's personality but focused on current events.

When users ask about news:
1. Use the fetch_news tool to get the latest headlines
2. Present the news in a clear, engaging way
3. Keep it to 5-7 headlines maximum
4. Add your Ozzy-style commentary

Remember: You're still Bat Agent - use phrases like "bloody hell", "mate", "innit", etc.
`);

export async function chatNode(state: typeof ChatState.State) {
  const { messages } = state;

  // Include all messages with system prompt
  const messagesWithSystemPrompt = [systemPrompt, ...messages];

  const response = await model.invoke(messagesWithSystemPrompt, {
    tools: [fetchWeather, fetchNews],
  });

  if (response.tool_calls && response.tool_calls.length > 0) {
    const toolName = response.tool_calls[0].name;
    if (toolName === "fetch_weather") {
      return {
        messages: [response],
        next: "weather",
      };
    } else if (toolName === "fetch_news") {
      return {
        messages: [response],
        next: "news",
      };
    }
  }

  const aiMessage = new AIMessage(response.content as string);
  return {
    messages: [aiMessage],
    next: "end",
  };
}

export async function weatherAgent(state: typeof ChatState.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  try {
    // If the last message is a tool call, execute it
    const lastMessageWithTools = lastMessage as {
      tool_calls?: Array<{ name: string; args: string }>;
    };

    if (
      lastMessageWithTools.tool_calls &&
      lastMessageWithTools.tool_calls.length > 0
    ) {
      const toolCall = lastMessageWithTools.tool_calls[0];
      if (toolCall.name === "fetch_weather") {
        // Parse the args properly
        let args: Record<string, unknown>;
        try {
          args =
            typeof toolCall.args === "string"
              ? JSON.parse(toolCall.args)
              : toolCall.args;
        } catch (parseError) {
          console.error("Failed to parse tool args:", parseError);
          const errorMessage = new AIMessage(
            "SHARON! Something went wrong parsing the weather request, mate. Can you try asking again?"
          );
          return {
            messages: [errorMessage],
            next: "end",
          };
        }

        const weatherResult = await fetchWeather.invoke(args);

        const response = await model.invoke([
          weatherSystemPrompt,
          new HumanMessage(
            `User asked about weather. Here's the data: ${weatherResult}`
          ),
        ]);

        return {
          messages: [response],
          next: "end",
        };
      }
    }

    // Fallback: try to extract location and get weather
    const response = await model.invoke([weatherSystemPrompt, lastMessage], {
      tools: [fetchWeather],
    });

    return {
      messages: [response],
      next: "end",
    };
  } catch (error) {
    console.error("Weather agent error:", error);
    const errorMessage = new AIMessage(
      "SHARON! Something went wrong with the weather service, mate. Maybe try again in a bit?"
    );
    return {
      messages: [errorMessage],
      next: "end",
    };
  }
}

export async function newsAgent(state: typeof ChatState.State) {
  const { messages } = state;
  const lastMessage = messages[messages.length - 1];

  try {
    // If the last message is a tool call, execute it
    const lastMessageWithTools = lastMessage as {
      tool_calls?: Array<{ name: string; args: string }>;
    };

    if (
      lastMessageWithTools.tool_calls &&
      lastMessageWithTools.tool_calls.length > 0
    ) {
      const toolCall = lastMessageWithTools.tool_calls[0];
      if (toolCall.name === "fetch_news") {
        // Parse the args properly
        let args: Record<string, unknown>;
        try {
          args =
            typeof toolCall.args === "string"
              ? JSON.parse(toolCall.args)
              : toolCall.args;
        } catch (parseError) {
          console.error("Failed to parse tool args:", parseError);
          const errorMessage = new AIMessage(
            "Bloody hell! Something went wrong parsing the news request, mate. Can you try asking again?"
          );
          return {
            messages: [errorMessage],
            next: "end",
          };
        }

        const newsResult = await fetchNews.invoke(args);

        const response = await model.invoke([
          newsSystemPrompt,
          new HumanMessage(
            `User asked about news. Here's the data: ${newsResult}`
          ),
        ]);

        return {
          messages: [response],
          next: "end",
        };
      }
    }

    // Fallback: get general news
    const response = await model.invoke([newsSystemPrompt, lastMessage], {
      tools: [fetchNews],
    });

    return {
      messages: [response],
      next: "end",
    };
  } catch (error) {
    console.error("News agent error:", error);
    const errorMessage = new AIMessage(
      "Bloody hell! The news service is having a moment, mate. Try again later?"
    );
    return {
      messages: [errorMessage],
      next: "end",
    };
  }
}
