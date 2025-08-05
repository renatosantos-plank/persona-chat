import { tool } from "@langchain/core/tools";
import { z } from "zod";

// Weather API response types
interface WeatherResponse {
  weather: Array<{
    description: string;
    main: string;
  }>;
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  name: string;
  sys: {
    country: string;
  };
}

// News API response types
interface NewsResponse {
  articles: Array<{
    title: string;
    description: string;
    url: string;
    publishedAt: string;
  }>;
  totalResults: number;
}

export const fetchWeather = tool(
  async (input: unknown) => {
    const { location } = input as { location: string };
    try {
      const apiKey = process.env.OPENWEATHER_API_KEY;

      if (!apiKey) {
        return "Bloody hell, mate! I can't get the weather right now - the weather service is down or something. SHARON!";
      }

      const response = await fetch(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          location
        )}&appid=${apiKey}&units=metric`
      );

      if (!response.ok) {
        if (response.status === 404) {
          return `Blimey! I can't find weather for "${location}" - are you sure that's a real place, mate?`;
        }
        throw new Error(`Weather API error: ${response.status}`);
      }

      const data: WeatherResponse = await response.json();

      const temp = Math.round(data.main.temp);
      const feelsLike = Math.round(data.main.feels_like);
      const description = data.weather[0].description;
      const humidity = data.main.humidity;
      const cityName = data.name;
      const country = data.sys.country;

      return `Right, mate! Here's the weather in ${cityName}, ${country}:
• Temperature: ${temp}°C (feels like ${feelsLike}°C)
• Conditions: ${description}
• Humidity: ${humidity}%

Bloody weather, innit?`;
    } catch (error) {
      console.error("Weather API error:", error);
      return "SHARON! Something went wrong with the weather service. Maybe try again in a bit, mate?";
    }
  },
  {
    name: "fetch_weather",
    description: "Fetch current weather data for a given location (city name)",
    schema: z.object({
      location: z
        .string()
        .describe(
          "The city name to get weather for (e.g., 'London', 'New York', 'Tokyo')"
        ),
    }),
  }
);

export const fetchNews = tool(
  async (input: unknown) => {
    const { query } = input as { query?: string };
    try {
      const apiKey = process.env.NEWSAPI_API_KEY;

      if (!apiKey) {
        return "Bloody hell! The news service is having a moment, mate. Can't get the headlines right now.";
      }

      const baseUrl = "https://newsapi.org/v2/everything";
      const params = new URLSearchParams({
        apiKey: apiKey,
        pageSize: "5", // Limit to 5 headlines
        q: query || "artificial intelligence",
      });

      if (query) {
        params.set("q", query);
      }

      const response = await fetch(`${baseUrl}?${params}`);
      console.log(response);
      if (!response.ok) {
        throw new Error(`News API error: ${response.status}`);
      }

      const data: NewsResponse = await response.json();

      if (!data.articles || data.articles.length === 0) {
        return "Blimey, mate! No news to report right now. Maybe everyone's having a quiet day?";
      }

      const headlines = data.articles
        .map((article, index) => `${index + 1}. ${article.title}`)
        .join("\n");

      return `Right then, here's what's happening in the world, mate:

${headlines}

Bloody interesting times we're living in, innit?`;
    } catch (error) {
      console.error("News API error:", error);
      return "SHARON! The news service is being a bit dodgy right now. Try again later, mate?";
    }
  },
  {
    name: "fetch_news",
    description:
      "Fetch the latest top news headlines from a given topic (query)",
    schema: z.object({
      query: z
        .string()
        .optional()
        .describe(
          "Optional news category (e.g., 'technology', 'sports', 'business')"
        ),
    }),
  }
);
