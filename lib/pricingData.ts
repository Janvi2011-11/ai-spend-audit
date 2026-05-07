// Real pricing data - sourced from official vendor pages
// All prices in USD per month

export const PRICING_DATA = {
    cursor: {
      name: "Cursor",
      plans: {
        hobby: { price: 0, maxSeats: 1, features: "2000 completions/month" },
        pro: { price: 20, maxSeats: 1, features: "Unlimited completions" },
        business: { price: 40, maxSeats: null, features: "Unlimited + admin dashboard" },
      },
    },
  
    github_copilot: {
      name: "GitHub Copilot",
      plans: {
        individual: { price: 10, maxSeats: 1, features: "Basic completions" },
        business: { price: 19, maxSeats: null, features: "Team management + policies" },
        enterprise: { price: 39, maxSeats: null, features: "Custom models + security" },
      },
    },
  
    claude: {
      name: "Claude",
      plans: {
        free: { price: 0, maxSeats: 1, features: "Limited messages" },
        pro: { price: 20, maxSeats: 1, features: "5x more usage than free" },
        max: { price: 100, maxSeats: 1, features: "20x more usage than free" },
        team: { price: 30, maxSeats: null, features: "Minimum 5 seats" },
        enterprise: { price: null, maxSeats: null, features: "Custom pricing" },
      },
    },
  
    chatgpt: {
      name: "ChatGPT",
      plans: {
        free: { price: 0, maxSeats: 1, features: "Limited GPT-4o" },
        plus: { price: 20, maxSeats: 1, features: "Full GPT-4o access" },
        team: { price: 30, maxSeats: null, features: "Minimum 2 seats" },
        enterprise: { price: null, maxSeats: null, features: "Custom pricing" },
      },
    },
  
    anthropic_api: {
      name: "Anthropic API",
      plans: {
        payg: { price: null, maxSeats: null, features: "Pay as you go" },
      },
    },
  
    openai_api: {
      name: "OpenAI API",
      plans: {
        payg: { price: null, maxSeats: null, features: "Pay as you go" },
      },
    },
  
    gemini: {
      name: "Gemini",
      plans: {
        free: { price: 0, maxSeats: 1, features: "Basic Gemini access" },
        pro: { price: 19.99, maxSeats: 1, features: "Gemini Advanced" },
        enterprise: { price: null, maxSeats: null, features: "Custom pricing" },
      },
    },
  
    windsurf: {
      name: "Windsurf",
      plans: {
        free: { price: 0, maxSeats: 1, features: "Limited credits" },
        pro: { price: 15, maxSeats: 1, features: "Unlimited completions" },
        team: { price: 35, maxSeats: null, features: "Team features + admin" },
      },
    },
  } as const;
  
  // Alternative tools suggestions for each use case
  export const ALTERNATIVES: Record<string, string[]> = {
    coding: ["cursor", "windsurf", "github_copilot"],
    writing: ["claude", "chatgpt"],
    data: ["chatgpt", "claude", "gemini"],
    research: ["claude", "chatgpt", "gemini"],
    mixed: ["claude", "chatgpt"],
  };