import { AgentRequest, AgentResponse } from "@/types/api";
import { NextResponse } from "next/server";
import { createAgent } from "./create-agent";
import { Message, generateId, generateText } from "ai";
import { createCorsResponse, handleOptions } from "@/lib/cors";

const messages: Message[] = [];

// Handle CORS preflight requests
export async function OPTIONS() {
  return handleOptions();
}

/**
 * Handles incoming POST requests to interact with the AgentKit-powered AI agent.
 * This function processes user messages and streams responses from the agent.
 *
 * @function POST
 * @param {Request & { json: () => Promise<AgentRequest> }} req - The incoming request object containing the user message.
 * @returns {Promise<NextResponse<AgentResponse>>} JSON response containing the AI-generated reply or an error message.
 *
 * @description Sends a single message to the agent and returns the agents' final response.
 *
 * @example
 * const response = await fetch("/api/agent", {
 *     method: "POST",
 *     headers: { "Content-Type": "application/json" },
 *     body: JSON.stringify({ userMessage: input }),
 * });
 */
export async function POST(
  req: Request & { json: () => Promise<AgentRequest> },
): Promise<NextResponse<AgentResponse>> {
  try {
    // 1️. Extract user message from the request body
    const { userMessage } = await req.json();

    // 2. Get the agent
    const agent = await createAgent();

    // 3.Start streaming the agent's response
    messages.push({ id: generateId(), role: "user", content: userMessage });
    const { text } = await generateText({
      ...agent,
      messages,
    });

    // 4. Add the agent's response to the messages
    messages.push({ id: generateId(), role: "assistant", content: text });

    // 5️. Return the final response
    return createCorsResponse({ response: text });
  } catch (error) {
    console.error("Error processing request:", error);
    return createCorsResponse({ error: "Failed to process message" }, { status: 500 });
  }
}
