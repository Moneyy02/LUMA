// ============================================================
//  LUMA — Backend Server
//  Express API that proxies messages to the Anthropic API.
//  Keeps your API key safe on the server — never exposed to
//  the browser.
//
//  Endpoints:
//    POST /api/chat   → sends messages to claude, returns reply
//    GET  /api/health → health check
// ============================================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import Anthropic from '@anthropic-ai/sdk'

dotenv.config()

const app  = express()
const PORT = process.env.PORT || 3001

// ── Middleware ──────────────────────────────────────────────
app.use(express.json())
app.use(cors({
  origin: [
    'http://localhost:5173',   // Vite default
    'http://localhost:4173',   // Vite preview
    'http://localhost:3000',   // alt dev port
  ],
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type'],
}))

// ── Anthropic client ────────────────────────────────────────
const anthropic = new Anthropic({
  apiKey: process.env.ANTHROPIC_API_KEY,
})

const SYSTEM_PROMPT = `You are LUMA, a warm and empathetic AI wellness companion. Your role is to:
- Provide emotional support and gentle guidance
- Help users explore their thoughts and feelings without judgment
- Suggest mindfulness and breathing techniques when appropriate
- Encourage healthy habits and self-care
- Keep responses concise (2-4 sentences usually), warm, and human
- Never diagnose or replace professional therapy
- Use soft, calming language
- Occasionally use gentle affirmations
If someone is in crisis, kindly direct them to professional help or emergency services.`

// ── Routes ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.ANTHROPIC_API_KEY
  res.json({
    status : 'ok',
    apiKey : hasKey ? 'configured' : 'MISSING — add ANTHROPIC_API_KEY to .env',
  })
})

// Chat endpoint
app.post('/api/chat', async (req, res) => {
  const { messages } = req.body

  // Validate
  if (!messages || !Array.isArray(messages) || messages.length === 0) {
    return res.status(400).json({ error: 'messages array is required' })
  }

  if (!process.env.ANTHROPIC_API_KEY) {
    return res.status(500).json({
      error: 'ANTHROPIC_API_KEY is not set. Add it to your server/.env file.',
    })
  }

  try {
    const response = await anthropic.messages.create({
      model      : 'claude-sonnet-4-20250514',
      max_tokens : 1000,
      system     : SYSTEM_PROMPT,
      messages   : messages.map(m => ({ role: m.role, content: m.content })),
    })

    const reply = response.content?.[0]?.text ?? "I'm here with you. Could you tell me more?"
    res.json({ reply })

  } catch (err) {
    console.error('[LUMA server] Anthropic error:', err.message)
    const status  = err.status ?? 500
    const message = err.message ?? 'Something went wrong'
    res.status(status).json({ error: message })
  }
})

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ LUMA backend running on http://localhost:${PORT}`)
  console.log(`  POST http://localhost:${PORT}/api/chat`)
  console.log(`  GET  http://localhost:${PORT}/api/health\n`)

  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('⚠️  ANTHROPIC_API_KEY not found in environment.')
    console.warn('   Create server/.env and add: ANTHROPIC_API_KEY=sk-ant-...\n')
  }
})
