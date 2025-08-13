# 🦇 BAT — BAT Answers Totally
From weather to wild banter, it’s got you covered.

A Next.js-based chat application featuring a multi-agent AI system with personality-driven interactions. Built with LangGraph, Supabase, and OpenAI, this app provides an engaging chat experience with specialized agents for different types of queries.

![Persona Chat Demo](/public/chat.png)

## 🚀 Features

### Core Features
- **Multi-Agent AI System**: Intelligent routing between specialized agents
- **Personality-Driven Chat**: Ozzy Osbourne-inspired personality across all agents
- **Real-time Chat Interface**: Stream-based messaging with typing indicators
- **Thread Management**: Persistent conversation threads with history
- **Authentication**: Secure user authentication with Supabase
- **Responsive Design**: Modern UI with dark theme and purple accents

### Specialized Agents
- **Chat Agent**: Main coordinator for general conversation and routing
- **Weather Agent**: Real-time weather information from OpenWeather API
- **News Agent**: Latest headlines and news from NewsAPI

### Technical Features
- **LangGraph Integration**: Advanced workflow orchestration
- **Streaming Responses**: Real-time message streaming
- **Database Persistence**: PostgreSQL with Supabase
- **TypeScript**: Full type safety throughout the application
- **Modern UI**: Built with Tailwind CSS and shadcn/ui components

## 🛠️ Tech Stack

- **Frontend**: Next.js 15, React 19, TypeScript
- **AI/ML**: LangGraph, LangChain, OpenAI
- **Database**: PostgreSQL (Supabase)
- **Authentication**: Supabase Auth
- **Styling**: Tailwind CSS, shadcn/ui
- **Deployment**: Vercel-ready
- **Code Quality**: Biome (linting & formatting)

## 📋 Prerequisites

Before you begin, ensure you have the following:

- Node.js 18+ and npm/pnpm/yarn
- A Supabase account and project
- OpenAI API key
- OpenWeather API key (for weather features)
- NewsAPI key (for news features)

## 🚀 Quick Start

### 1. Clone the Repository

```bash
git clone <your-repo-url>
cd persona-chat
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Environment Setup

Create a `.env.local` file in the project root:

```bash
# OpenAI API Key (required)
OPENAI_API_KEY=your_openai_api_key_here

# OpenWeather API Key (required for weather functionality)
OPENWEATHER_API_KEY=your_openweather_api_key_here

# NewsAPI Key (required for news functionality)
NEWSAPI_API_KEY=your_newsapi_key_here

# Supabase Configuration (required)
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url_here
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key_here
SUPABASE_CONNECTION_STRING=your_supabase_connection_string_here
```

### 4. Database Setup

Run the Supabase migrations to set up the database schema:

```bash
# If using Supabase CLI
supabase db push

# Or manually run the SQL files in supabase/migrations/
```

### 5. Start Development Server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

## 🔧 API Key Setup

### OpenAI API
1. Visit [OpenAI Platform](https://platform.openai.com/)
2. Create an account and get your API key
3. Add it to your `.env.local` file

### OpenWeather API
1. Go to [OpenWeather API](https://openweathermap.org/api)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### NewsAPI
1. Visit [NewsAPI](https://newsapi.org/)
2. Sign up for a free account
3. Get your API key from the dashboard
4. Add it to your `.env.local` file

### Supabase Setup
1. Create a new project at [Supabase](https://supabase.com/)
2. Get your project URL and API keys from Settings > API
3. Add them to your `.env.local` file

## 🎯 Usage Examples

### Weather Queries
```
User: "What's the weather in London?"
→ Chat Agent routes to Weather Agent
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
→ Returns: "Right then, here's what's happening in the world, mate:
  1. [Headline 1]
  2. [Headline 2]
  3. [Headline 3]
  Bloody interesting times we're living in, innit?"
```

### General Conversation
```
User: "Hello, how are you?"
→ Chat Agent responds directly
→ Returns: "Bloody hell, mate! I'm doing alright, innit? Just here to help you with whatever you need..."
```

## 🏗️ Project Structure

```
persona-chat/
├── app/                    # Next.js app directory
│   ├── (protected)/       # Protected routes (chat interface)
│   ├── (public)/          # Public routes (auth pages)
│   └── api/               # API routes
├── components/            # React components
│   └── ui/               # shadcn/ui components
├── lib/                  # Utility libraries
│   ├── agent/           # Multi-agent system
│   ├── supabase/        # Supabase configuration
│   └── utils/           # Helper utilities
├── supabase/            # Database migrations
└── public/              # Static assets
```

## 🔄 Multi-Agent Architecture

The application uses a sophisticated multi-agent system built with LangGraph:

### Agent Routing Logic
- **Weather Queries**: Automatically routed to Weather Agent
- **News Queries**: Automatically routed to News Agent  
- **General Queries**: Handled by Chat Agent

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

## 🎭 Personality System

All agents maintain a consistent personality inspired by Ozzy Osbourne:
- Uses British slang and rockstar phrases
- Maintains chaotic but endearing personality
- Consistent across all specialized agents
- Error messages also follow the personality

## 🚀 Deployment

### Deploy to Vercel

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=your-repo-url)

### Environment Variables for Production

Ensure all environment variables are set in your production environment:
- `OPENAI_API_KEY`
- `OPENWEATHER_API_KEY`
- `NEWSAPI_API_KEY`
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY`
- `SUPABASE_CONNECTION_STRING`

## 🛠️ Development

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run start        # Start production server
npm run format       # Format code with Biome
npm run lint         # Lint code with Biome
npm run check        # Run all Biome checks
```

### Code Quality

The project uses Biome for code formatting and linting:
- Automatic code formatting
- TypeScript linting
- Import sorting
- Consistent code style

## 🔧 Customization

### Adding New Agents

1. Create a new tool in `lib/agent/tools.ts`
2. Add a new agent node in `lib/agent/nodes.ts`
3. Update the graph in `lib/agent/graph.ts`
4. Add routing logic in the chat node

### Modifying Personality

Edit the system prompts in `lib/agent/model.ts` and the specialized prompts in `lib/agent/nodes.ts`.

### Adding New APIs

Follow the pattern in `lib/agent/tools.ts` for creating new API integrations.

## 🐛 Troubleshooting

### Common Issues

1. **API Key Errors**: Ensure all environment variables are set correctly
2. **Tool Call Errors**: Check that tool schemas match the expected input format
3. **Routing Issues**: Verify the routing logic in the chat node function
4. **Database Connection**: Ensure Supabase connection string is correct



## 📈 Future Enhancements

Potential improvements:
- Implement context sharing
- Voice input/output capabilities

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request
