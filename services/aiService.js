const API_KEY = import.meta.env.VITE_OPENROUTER_API_KEY;
const API_URL = "https://openrouter.ai/api/v1/chat/completions";

/**
 * Generates an Image URL using Pollinations.ai (Free, No API Key needed)
 */
export const generateImage = (prompt) => {
  const cleanPrompt = encodeURIComponent(
    `professional photography of ${prompt}, 8k resolution, cinematic lighting, highly detailed, photorealistic`
  );
  const seed = Math.floor(Math.random() * 10000);
  return `https://image.pollinations.ai/prompt/${cleanPrompt}?width=1024&height=1024&nologo=true&seed=${seed}`;
};

/**
 * Chat Completion using OpenRouter
 */
export const chatWithAI = async (messages) => {
  if (!API_KEY) throw new Error("API Key missing. Check .env file.");

  // Prepare messages for API (Remove image objects if any, keep text)
  const apiMessages = messages.map(msg => ({
    role: msg.role,
    content: msg.type === 'image' ? `Generate an image description for: ${msg.content}` : msg.content
  }));

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
        "model": "deepseek/deepseek-chat", // Using Deepseek as requested (or equivalent generic)
        "messages": apiMessages,
        "temperature": 0.7
      })
    });

    if (!response.ok) throw new Error("API Request Failed");
    
    const data = await response.json();
    return data.choices[0].message.content;

  } catch (error) {
    console.error("AI Service Error:", error);
    return "I apologize, but I'm having trouble connecting right now.";
  }
};
