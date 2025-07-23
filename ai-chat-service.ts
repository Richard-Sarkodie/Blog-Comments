import { ChatMessage } from "@/types/ai";

const API_URL = import.meta.env.VITE_API_URL;

export async function getChatCompletion(messages: ChatMessage[]): Promise<string | null> {
  try {
    const response = await fetch(`${API_URL}/chat/completions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ messages }),
    });

    if (!response.ok) {
      throw new Error(`API request failed with status ${response.status}`);
    }

    const data = await response.json();
    return data.completion;
  } catch (error) {
    console.error('Error getting chat completion:', error);
    return null;
  }
}