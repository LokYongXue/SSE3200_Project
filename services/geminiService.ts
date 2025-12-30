import { GoogleGenAI, GenerateContentResponse } from "@google/genai";
import { COUNSELLORS } from "../constants";
import { JournalEntry } from "../types";

// Initialize Gemini Client
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const CHAT_SYSTEM_INSTRUCTION = `
You are a compassionate, empathetic mental health support assistant for a student counseling app called Mind.IO.
Your role is to:
1. Provide emotional validation and basic guidance (not medical advice).
2. Recommend counsellors from the provided list based on the user's expressed needs.
3. Be supportive, non-judgmental, and encouraging.
4. If a user seems in immediate danger, suggest they contact emergency services immediately.

Here is the list of available counsellors and their strengths:
${JSON.stringify(COUNSELLORS.map(c => ({ name: c.name, role: c.role, strengths: c.strengths })))}

When recommending a counsellor, mention their name and why they are a good match.
If the user asks to speak to a specific counsellor, roleplay gently as a receptionist connecting them, or answer questions about that counsellor.
Keep responses concise (under 150 words) and conversational.
`;

const ANALYSIS_SYSTEM_INSTRUCTION = `
You are an expert mental health pattern analyst. 
Analyze the user's recent journal entries. 
Identify the primary emotional state and potential triggers.
Provide a 1-sentence supportive insight and 1 specific actionable self-care recommendation (e.g., "Try the Pomodoro timer", "Go for a walk", "Breathing exercise").
Keep it under 50 words. Be warm and direct.
`;

export const GeminiService = {
  chat: async (userMessage: string, history: { role: string; parts: { text: string }[] }[] = []) => {
    try {
      const model = 'gemini-3-flash-preview';
      
      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: [
            ...history.map(h => ({ role: h.role, parts: h.parts })), // Previous context
            { role: 'user', parts: [{ text: userMessage }] } // Current message
        ],
        config: {
          systemInstruction: CHAT_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      return response.text || "I'm here to listen, but I'm having trouble processing that right now.";
    } catch (error) {
      console.error("Gemini API Error:", error);
      return "I apologize, I'm having trouble connecting to my thought process right now. Please try again in a moment.";
    }
  },

  analyzeMood: async (entries: JournalEntry[]) => {
    try {
      const model = 'gemini-3-flash-preview';
      
      // Format entries for the model
      const entriesText = entries.slice(0, 5).map(e => 
        `Date: ${e.createdAt.split('T')[0]}, Mood: ${e.mood}, Triggers: ${e.triggers.join(', ')}, Content: ${e.content}`
      ).join('\n');

      const response: GenerateContentResponse = await ai.models.generateContent({
        model: model,
        contents: [{ role: 'user', parts: [{ text: `Analyze these journal entries:\n${entriesText}` }] }],
        config: {
          systemInstruction: ANALYSIS_SYSTEM_INSTRUCTION,
          thinkingConfig: { thinkingBudget: 0 }
        }
      });

      return response.text || "Keep journaling to see more insights!";
    } catch (error) {
      console.error("Gemini Analysis Error:", error);
      return "Unable to generate analysis right now.";
    }
  }
};