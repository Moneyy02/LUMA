// ============================================================
//  LUMA — Backend Server
//  Express API that uses Gemini via direct REST fetch call.
// ============================================================

import express from 'express'
import cors from 'cors'
import dotenv from 'dotenv'
import chatController from './controllers/chatController.js'

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

// ── Routes ──────────────────────────────────────────────────

// Health check
app.get('/api/health', (req, res) => {
  const hasKey = !!process.env.GEMINI_API_KEY
  res.json({
    status : 'ok',
    apiKey : hasKey ? 'configured' : 'MISSING — add GEMINI_API_KEY to .env',
  })
})

// Chat endpoint
app.post('/api/chat', chatController.handleChat)

// ── Start ───────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`\n✦ LUMA backend running on http://localhost:${PORT}`)
  console.log(`  POST http://localhost:${PORT}/api/chat (Using Gemini via Fetch)`)
  console.log(`  GET  http://localhost:${PORT}/api/health\n`)

  if (!process.env.GEMINI_API_KEY) {
    console.warn('⚠️  GEMINI_API_KEY not found in environment.')
    console.warn('   Create .env and add: GEMINI_API_KEY=AIzaSy...\\n')
  }
})
