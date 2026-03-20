import { GoogleGenAI } from "@google/genai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
if (!API_KEY) {
  console.error("VITE_GEMINI_API_KEY is not defined. Please check your environment variables.");
}
const ai = new GoogleGenAI({ apiKey: API_KEY || "" });

export async function analyzeFridgeImage(imageBuffer, mimeType) {
  const prompt = `Act as a Universal Nutrition & Sustainability Bridge. 
### Mission:
Analyze the full detailed image uploaded of a refrigerator interior. Detect every visible food item, including open jars, produce, and containers.

### Constraints:
1. **Identify:** If food items are found, list them with details. **Crucially**, treat all food containers, boxes, jars, and meal prep bins as food items (e.g., "Leftovers", "Stored Food", or "Prepared Meal"). Do NOT ignore them.
2. **Zero-State Handling:** If NO food items or containers are detected, return an EMPTY "inventory" array (e.g., "inventory": []). Do NOT hallucinate items.
3. **Status:** Provide a "Shelf Life" status (e.g., "Use Soon", "Fresh", "Check Date").
4. **Sustainability Recipe:** Suggest ONE recipe that takes under 15 minutes and uses ONLY the identified ingredients. If no ingredients are found, return null for "bridge_action".
5. **Smart Shopping:** Identify 3 common staples (e.g., milk, eggs, butter) that appear to be missing or low based on the image context.

### Response Format:
Return ONLY a valid JSON object. 
{
  "inventory": [
    {"item": "Spinach", "status": "Use Soon", "reason": "Wilting noticed"},
    {"item": "Greek Yogurt", "status": "Fresh", "reason": "Sealed container"}
  ],
  "bridge_action": {
    "recipe_name": "Quick Spinach & Yogurt Dip",
    "instructions": ["Chop spinach fine", "Mix with yogurt and salt"],
    "time_estimate": "5 minutes"
  },
  "missing_staples": ["Whole Milk", "Large Eggs"]
}`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.0-flash",
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType,
                data: imageBuffer,
              },
            },
          ],
        },
      ],
    });

    const text = response.text;
    // Clean up response if Gemini adds markdown backticks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
