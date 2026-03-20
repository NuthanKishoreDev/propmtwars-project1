import { GoogleGenerativeAI } from "@google/generative-ai";

const API_KEY = import.meta.env.VITE_GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(API_KEY);

export async function analyzeFridgeImage(imageBuffer, mimeType) {
  const model = genAI.getGenerativeModel({ model: "gemini-3-flash-preview" });

  const prompt = `Act as a Universal Nutrition & Sustainability Bridge. 
Analyze the provided image of a refrigerator interior. 

### Constraints:
1. **Identify:** Detect all visible food items, including open jars, produce, and containers.
2. **Estimate:** Provide a "Shelf Life" status (e.g., "Use Soon", "Fresh", "Check Date").
3. **Reason:** Suggest ONE recipe that takes under 15 minutes and uses ONLY the identified ingredients to prevent food waste.
4. **Bridge:** Identify 3 common staples (e.g., milk, eggs, butter) that appear to be missing or low.

### Response Format:
Return ONLY a valid JSON object. Do not include markdown code blocks or conversational text.
{
  "inventory": [
    {"item": "Spinach", "status": "Use Soon", "reason": "Wilting noticed"},
    {"item": "Greek Yogurt", "status": "Fresh", "reason": "Sealed container"}
  ],
  "bridge_action": {
    "recipe_name": "Quick Spinach & Yogurt Dip",
    "instructions": ["Chop spinach fine", "Mix with yogurt and salt", "Serve with identified carrots"],
    "time_estimate": "5 minutes"
  },
  "missing_staples": ["Whole Milk", "Large Eggs"]
}`;

  const imageParts = [
    {
      inlineData: {
        data: imageBuffer,
        mimeType,
      },
    },
  ];

  try {
    const result = await model.generateContent([prompt, ...imageParts]);
    const response = await result.response;
    const text = response.text();

    // Clean up response if Gemini adds markdown backticks
    const cleanedText = text.replace(/```json|```/g, "").trim();
    return JSON.parse(cleanedText);
  } catch (error) {
    console.error("Gemini Analysis Error:", error);
    throw error;
  }
}
