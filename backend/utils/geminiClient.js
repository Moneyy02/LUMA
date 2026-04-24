import https from 'https'
import { SYSTEM_PROMPT } from '../models/systemPrompt.js'

export const generateChatResponse = async (messages) => {
  // Convert messages to Gemini format
  let geminiMessages = messages.map(m => ({
    role: m.role === 'assistant' ? 'model' : 'user',
    parts: [{ text: m.content }]
  }))

  // Gemini strictly requires the first message in the array to be from a 'user'.
  if (geminiMessages.length > 0 && geminiMessages[0].role === 'model') {
    geminiMessages.shift()
  }

  // Inject the system prompt securely as the initial message exchange
  geminiMessages.unshift(
    { role: 'user', parts: [{ text: "SYSTEM PROMPT INSTRUCTION: " + SYSTEM_PROMPT }] },
    { role: 'model', parts: [{ text: "Understood. I am ready to follow these instructions fully." }] }
  )

  const payloadString = JSON.stringify({
    contents: geminiMessages,
    generationConfig: { maxOutputTokens: 1000 }
  })

  const options = {
    hostname: 'generativelanguage.googleapis.com',
    port: 443,
    path: '/v1beta/models/gemini-2.5-flash:generateContent?key=' + process.env.GEMINI_API_KEY,
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Content-Length': Buffer.byteLength(payloadString)
    }
  }

  const data = await new Promise((resolve, reject) => {
    const request = https.request(options, (response) => {
      response.setEncoding('utf8');
      let rawData = '';
      response.on('data', (chunk) => rawData += chunk);
      response.on('end', () => {
        try { 
          resolve({ statusCode: response.statusCode, parsed: JSON.parse(rawData) }); 
        } 
        catch (e) { 
          resolve({ statusCode: response.statusCode, parsed: { error: { message: "JSON Parse error: " + e.message } } }); 
        }
      });
    });
    request.on('error', reject);
    request.write(payloadString);
    request.end();
  });

  if (data.statusCode < 200 || data.statusCode >= 300) {
    throw new Error(data.parsed?.error?.message || 'Failed to fetch from Gemini API')
  }

  return data.parsed.candidates?.[0]?.content?.parts?.[0]?.text ?? "I'm here with you. Could you tell me more?"
}
