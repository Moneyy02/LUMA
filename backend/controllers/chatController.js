import { generateChatResponse } from '../utils/geminiClient.js'

const handleChat = async (req, res) => {
  const { messages } = req.body

  // Validate
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (!process.env.GEMINI_API_KEY) {
    return res.status(500).json({
      error: 'GEMINI_API_KEY is not set. Add it to your .env file.',
    })
  }

  try {
    const reply = await generateChatResponse(messages)
    res.json({ reply })
  } catch (err) {
    console.error('[LUMA server] error:', err.message)
    res.status(500).json({ error: err.message || 'Something went wrong' })
  }
}

export default { handleChat }
