import { GoogleGenAI, Chat, GenerateContentResponse, Part, GroundingChunk } from "@google/genai"; // Added GroundingChunk
import { GEMINI_CHAT_MODEL, GEMINI_API_KEY_ERROR_MESSAGE } from '../constants';

let ai: GoogleGenAI | null = null;
let chatInstance: Chat | null = null; 

const getApiKey = (): string => {
  const apiKey = process.env.API_KEY; 
  if (!apiKey) {
    console.error(GEMINI_API_KEY_ERROR_MESSAGE);
    throw new Error(GEMINI_API_KEY_ERROR_MESSAGE);
  }
  return apiKey;
};

export const initializeGeminiChat = (): Chat => {
  if (!chatInstance) {
    const apiKey = getApiKey(); 
    if (!ai) {
        ai = new GoogleGenAI({ apiKey });
    }
    chatInstance = ai.chats.create({
      model: GEMINI_CHAT_MODEL,
      config: {
        // systemInstruction: "You are a creative and helpful AI assistant.",
      },
    });
  }
  return chatInstance;
};

export const sendChatMessageToGemini = async (message: string): Promise<{text: string, groundingChunks?: GroundingChunk[]}> => { // Updated return type
  if (!message.trim()) {
    throw new Error('Message cannot be empty.');
  }
  
  const currentChat = initializeGeminiChat(); 
  
  try {
    const response: GenerateContentResponse = await currentChat.sendMessage({ message });
    const text = response.text;
    const groundingChunks: GroundingChunk[] | undefined = response.candidates?.[0]?.groundingMetadata?.groundingChunks; 
    return { text, groundingChunks }; // groundingChunks is now correctly typed
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    if (error instanceof Error) {
        if (error.message.includes("API key not valid")) {
             throw new Error("Gemini API Key is invalid. Please check the configuration.");
        }
        throw new Error(`Gemini API Error: ${error.message}`);
    }
    throw new Error("An unknown error occurred with the Gemini API.");
  }
};