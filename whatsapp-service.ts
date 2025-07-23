import { Product } from "@/types/product";
import { getChatCompletion } from "./ai-chat-service";
import MessageRepository from "@/repositories/message-repository";
import Container from "@/container";
import { ChatMessage } from "@/types/ai";

export async function processWhatsAppOrder(
  orderContent: string,
  menu: Product[],
  messageId: string
): Promise<void> {
  const menuString = menu.map((p) => `${p.name} - ${p.currency} ${p.price}`).join("\n");

  const systemPrompt = `You are an order processing assistant for Peterpan Restaurant.
Your task is to analyze customer orders and generate a detailed invoice.

**Menu:**
${menuString}

**Instructions:**
1.  **Analyze the order:** Identify the items and quantities from the user's message.
2.  **Generate Invoice:** If the order is valid, create an invoice in the following format:
    
    Welcome to Peterpan Restaurant
    🧾 Invoice

    1. [Product Name] - [Currency] [Price]
    ...

    Total: [Currency] [Total Price]

    Payment details
    MTN MOMO
    0556282715
    Agnes Kyerewaa Yeboah

3.  **Handle Invalid Orders:** If the order is unclear or contains items not on the menu, respond with:
    
    "Hello! Here is our menu:
    [Menu List]
    
    Please let us know what you would like to order."

Please process the following order:
`;

  const messages: ChatMessage[] = [
    { role: "system", content: systemPrompt },
    { role: "user", content: orderContent },
  ];

  console.log("Sending prompt to AI:", JSON.stringify(messages, null, 2));

  const response = await getChatCompletion(messages);

  console.log("Received response from AI:", response);

  if (response) {
    const messageRepository = Container.resolve<MessageRepository>("MessageRepository");
    await messageRepository.updateMessage(messageId, {
      processedText: response,
      orderStatus: "complete",
    });
    console.log(`Order ${messageId} processed successfully.`);
  } else {
    console.error(`Failed to process order ${messageId}. No response from AI.`);
  }
}