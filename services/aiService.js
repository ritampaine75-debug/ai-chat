const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

export const chatWithAI = async (messages) => {
  if (!API_KEY) throw new Error("API Key missing");

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${API_KEY}`,
        "Content-Type": "application/json",
        "HTTP-Referer": "https://your-site.com", 
        "X-Title": "Premium AI Chat"
      },
      body: JSON.stringify({
        "model": "deepseek/deepseek-chat", // Good for coding
        "messages": messages,
        "temperature": 0.7
      })
    });

    if (!response.ok) throw new Error("API Request Failed");
    
    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("AI Service Error:", error);
    throw error;
  }
};
