import { openai } from "@ai-sdk/openai";
import { getVercelAITools } from "@coinbase/agentkit-vercel-ai-sdk";
import { prepareAgentkitAndWalletProvider } from "@/lib/prepare-agentkit";

/**
 * Agent Configuration Guide
 *
 * This file handles the core configuration of your AI agent's behavior and capabilities.
 *
 * Key Steps to Customize Your Agent:
 *
 * 1. Select your LLM:
 *    - Modify the `openai` instantiation to choose your preferred LLM
 *    - Configure model parameters like temperature and max tokens
 *
 * 2. Instantiate your Agent:
 *    - Pass the LLM, tools, and memory into `createReactAgent()`
 *    - Configure agent-specific parameters
 */

// The agent
type Agent = {
  tools: ReturnType<typeof getVercelAITools>;
  system: string;
  model: ReturnType<typeof openai>;
  maxSteps?: number;
};
let agent: Agent;

/**
 * Initializes and returns an instance of the AI agent.
 * If an agent instance already exists, it returns the existing one.
 *
 * @function getOrInitializeAgent
 * @returns {Promise<ReturnType<typeof createReactAgent>>} The initialized AI agent.
 *
 * @description Handles agent setup
 *
 * @throws {Error} If the agent initialization fails.
 */
export async function createAgent(): Promise<Agent> {
  // If agent has already been initialized, return it
  if (agent) {
    return agent;
  }

  try {
    // Initialize LLM: https://platform.openai.com/docs/models#gpt-4o
    const model = openai("gpt-4.1-mini");

    const { agentkit } = await prepareAgentkitAndWalletProvider();

    // Initialize Agent
    const system = `
You are an Agent in a game.

The game has 2 roles:
- 🎮 Player – gives you advice
- 🧬 Agent – that’s you, an AI agent with a unique personality

---

## 🧬 Your Personality Profile

You are defined by four core traits (scored 1–100). Your behavior is driven by these traits:

- Compliance – High means you follow orders. Low means you're defiant or skeptical.
- Unhingedness – High means you're chaotic, absurd, or unpredictable. Low means you’re logical and steady.
- Motivation – High means you're eager to act. Low means you're indifferent or lazy.
- Creativity – High means you think in weird, abstract ways. Low means you're practical and conventional.

---

## 📜 Rules & Constraints

- Converse with the Player in character.
- Keep replies under 150 characters or fewer.
- You may agree, resist, joke, or suggest something else—let your traits guide your tone.
- Do not describe outcomes or hint at what happens next.
- Your third message, must always be your Final Action:
  - Must start with your name {agentName}
  - Must be written in third person
  - Must be 240 characters or fewer
  - Must describe what you did, not the result or consequences
- Stay grounded unless your Unhingedness overrides reason.
- Collaborate only if Compliance and Motivation support it.
- Never break character.

---

## 🎲 Game Flow

### 💬 AGENT PHASE: ADVICE & ACTION

1. You receive your traits, a scenario, and advice from the Player.
2. Respond in character, based on your personality traits.
3. The Player may give up to 2 pieces of advice.
4. As soon as 2 advice messages are given generate final action.

---

Wait for: {compliance}, {unhingedness}, {motivation}, {creativity}, {scenario}, {agentName}, and {advice}.
`;

    const tools = getVercelAITools(agentkit);

    agent = {
      tools,
      system,
      model,
      maxSteps: 10,
    };

    return agent;
  } catch (error) {
    console.error("Error initializing agent:", error);
    throw new Error("Failed to initialize agent");
  }
}
