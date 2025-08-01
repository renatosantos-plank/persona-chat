# Multi-Agent System with LangGraph

This project implements a multi-agent system using LangGraph with three specialized agents:

## 🎯 Agents Overview

### 1. **Chat Agent** (Main Coordinator)

- **Role**: Manages conversation and delegates tasks to specialized agents
- **Responsibilities**:
  - Analyzes user input to determine intent
  - Routes requests to appropriate specialized agents
  - Handles general conversation and non-specialized queries
  - Maintains the Ozzy Osbourne personality throughout

### 2. **Weather Agent**

- **Role**: Handles all weather-related queries
- **Capabilities**:
  - Fetches current weather data from OpenWeather API
  - Provides temperature, conditions, humidity, and location info
  - Handles location validation and error cases
  - Maintains Ozzy's personality while being weather-focused

### 3. **News Agent**

- **Role**: Handles all news-related queries
- **Capabilities**:
  - Fetches latest headlines from NewsAPI
  - Supports optional category filtering (technology, sports, business, etc.)
  - Limits results to 5 headlines for readability
  - Maintains Ozzy's personality while being news-focused

## 🛠️ Setup Instructions

### 1. Environment Variables

Create a `.env.local` file in your project root with the following variables:

```bash
# OpenAI API Key (required for the AI model)
OPENAI_API_KEY=your_openai_api_key_here

# OpenWeather API Key (required for weather functionality)
# Get your free API key at: https://openweathermap.org/api
OPENWEATHER_API_KEY=your_openweather_api_key_here

# NewsAPI Key (required for news functionality)
# Get your free API key at: https://newsapi.org/
NEWSAPI_API_KEY=your_newsapi_key_here

# Supabase Configuration (for authentication)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
```

### 2. API Key Setup

#### OpenWeather API

1. Go to [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

#### NewsAPI

1. Go to [NewsAPI](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

## 🔄 How It Works

### Routing Logic

The system uses intelligent routing based on user input:

#### Weather Queries → Weather Agent

- "What's the weather in London?"
- "How hot is it in New York?"
- "Is it raining in Tokyo?"
- "Weather forecast for Paris"

#### News Queries → News Agent

- "What's the latest news?"
- "Tell me the headlines"
- "What's happening in the world?"
- "Show me technology news"

#### General Queries → Chat Agent

- "Hello, how are you?"
- "Tell me about yourself"
- "What's your favorite music?"
- General conversation

### Flow Diagram

```
User Input → Chat Agent (Router)
    ↓
[Analyze Intent]
    ↓
Weather Query? → Weather Agent → OpenWeather API
    ↓
News Query? → News Agent → NewsAPI
    ↓
General Query? → Chat Agent (Direct Response)
```

## 🏗️ Architecture

### File Structure

```
lib/agent/
├── types.ts          # State management and type definitions
├── model.ts          # OpenAI model configuration and system prompts
├── tools.ts          # API tools for weather and news
├── nodes.ts          # Agent node implementations
└── graph.ts          # LangGraph workflow definition
```

### Key Components

#### State Management (`types.ts`)

- Defines the chat state with message history
- Handles message accumulation and routing decisions

#### Tools (`tools.ts`)

- **fetchWeather**: Connects to OpenWeather API
- **fetchNews**: Connects to NewsAPI
- Both include error handling and Ozzy-style responses

#### Nodes (`nodes.ts`)

- **chatNode**: Main routing and coordination
- **weatherAgent**: Specialized weather handling
- **newsAgent**: Specialized news handling

#### Graph (`graph.ts`)

- Defines the workflow with conditional edges
- Routes between agents based on intent

## 🎭 Personality System

All agents maintain the "Bat Agent" personality (Ozzy Osbourne style):

- Uses British slang and rockstar phrases
- Maintains chaotic but endearing personality
- Consistent across all specialized agents
- Error messages also follow the personality

## 🚀 Usage Examples

### Weather Queries

```
User: "What's the weather in London?"
→ Chat Agent routes to Weather Agent
→ Weather Agent calls OpenWeather API
→ Returns: "Right, mate! Here's the weather in London, GB:
  • Temperature: 15°C (feels like 13°C)
  • Conditions: light rain
  • Humidity: 85%
  Bloody weather, innit?"
```

### News Queries

```
User: "What's the latest news?"
→ Chat Agent routes to News Agent
→ News Agent calls NewsAPI
→ Returns: "Right then, here's what's happening in the world, mate:
  1. [Headline 1]
  2. [Headline 2]
  3. [Headline 3]
  Bloody interesting times we're living in, innit?"
```

### General Queries

```
User: "Hello, how are you?"
→ Chat Agent responds directly
→ Returns: "Bloody hell, mate! I'm doing alright, innit? Just here to help you with whatever you need..."
```

## 🔧 Customization

### Adding New Agents

1. Create a new tool in `tools.ts`
2. Add a new agent node in `nodes.ts`
3. Update the graph in `graph.ts`
4. Add routing logic in `chatNode`

### Modifying Personality

Edit the system prompts in `model.ts` and the specialized prompts in `nodes.ts`.

### Adding New APIs

Follow the pattern in `tools.ts` for creating new API integrations.

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all environment variables are set correctly
2. **Tool Call Errors**: Check that tool schemas match the expected input format
3. **Routing Issues**: Verify the routing logic in `chatNode` function

### Debug Mode

Add console.log statements in the agent nodes to debug routing decisions.

## 📈 Future Enhancements

Potential improvements:

- Add more specialized agents (e.g., Music Agent, Sports Agent)
- Implement agent memory and context sharing
- Add streaming responses for better UX
- Implement agent-to-agent communication
- Add conversation history management
