// ai.ts (This file runs in the browser/frontend)
import ModelClient from "@azure-rest/ai-inference";
import { AzureKeyCredential } from "@azure/core-auth";

// IMPORTANT SECURITY WARNING:
// If VITE_GITHUB_TOKEN is a sensitive API key that directly grants access
// to a paid or private AI service (like models.github.ai usually is),
// then EXPOSING IT IN FRONTEND CODE (even via import.meta.env) IS A MAJOR SECURITY RISK.
// A malicious user can easily extract this token from your compiled frontend code.
//
// THE SECURE SOLUTION IS TO ALWAYS ROUTE THESE REQUESTS THROUGH YOUR OWN BACKEND.
// Your frontend should call YOUR backend, and YOUR backend should use its
// securely stored API key (via process.env) to call the AI service.
// This ai.ts file (and the ModelClient) should NOT be used directly in the frontend
// if the endpoint requires a sensitive token.

const endpoint = "/github-api"; // Using the proxied endpoint

export class AI {
  private static instance: ReturnType<typeof ModelClient>;

  private constructor() {}

  public static getAI(): ReturnType<typeof ModelClient> {
    if (!AI.instance) {
      AI.instance = ModelClient(endpoint, new AzureKeyCredential("dummy-key"));
      console.log("ModelClient instance created for the proxied endpoint.");
    }
    return AI.instance;
  }
}