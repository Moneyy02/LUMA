// ============================================================
//  Chatbot.jsx — UPDATED
//  Now calls the real Express backend at /api/chat.
//  No API keys in the browser. No CORS issues.
// ============================================================
import { useState, useRef, useEffect } from 'react'

const suggestions = [
  "I'm feeling anxious today",
  "Help me calm down",
  "I need to talk",
  "Give me a breathing exercise",
  "I'm feeling overwhelmed",
]

export default function Chatbot() {
  const [messages, setMessages] = useState([{
    role: 'assistant',
    content: "Hello, I'm LUMA 🌙 I'm here to listen, support, and help you find your calm. How are you feeling right now?",
  }])
  const [input, setInput]     = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError]     = useState(null)
  const bottomRef = useRef(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  const send = async (text) => {
    const userText = text || input.trim()
    if (!userText || loading) return

    const userMsg = { role: 'user', content: userText }
    const updated = [...messages, userMsg]
    setMessages(updated)
    setInput('')
    setLoading(true)
    setError(null)

    try {
      // Calls Express backend — no CORS, no key exposure
      const res = await fetch('/api/chat', {
        method : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body   : JSON.stringify({ messages: updated }),
      })

      const data = await res.json()

      if (!res.ok) throw new Error(data.error || `Server error ${res.status}`)

      setMessages(prev => [...prev, { role: 'assistant', content: data.reply }])
    } catch (err) {
      console.error('LUMA chat error:', err)
      setError(err.message)
      setMessages(prev => [...prev, {
        role: 'assistant',
        content: "I'm having a quiet moment — something went wrong on my end. Please try again. 🌙",
        isError: true,
      }])
    }
    setLoading(false)
  }

  const clearChat = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello, I'm LUMA 🌙 I'm here to listen, support, and help you find your calm. How are you feeling right now?",
    }])
    setError(null)
  }

  return (
    <div>
      {/* ── Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: 12, marginBottom: 4 }}>
        <div>
          <span className="section-tag">AI Companion</span>
          <h2 className="section-title">Talk to LUMA</h2>
          <p className="section-sub">A safe space to express yourself, anytime.</p>
        </div>
        <button
          onClick={clearChat}
          style={{
            marginTop: 6, background: 'rgba(255,255,255,0.04)',
            border: '1px solid var(--border)', borderRadius: 100,
            padding: '7px 16px', color: 'var(--text-dim)',
            fontFamily: 'var(--font-heading)', fontSize: '0.65rem',
            letterSpacing: '0.08em', cursor: 'pointer', transition: 'all 0.2s ease',
          }}
          onMouseEnter={e => { e.currentTarget.style.borderColor='rgba(251,113,133,0.4)'; e.currentTarget.style.color='var(--rose)' }}
          onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)';          e.currentTarget.style.color='var(--text-dim)' }}
        >Clear ✕</button>
      </div>

      {/* ── Error banner ── */}
      {error && (
        <div style={{
          background: 'rgba(251,113,133,0.08)', border: '1px solid rgba(251,113,133,0.25)',
          borderRadius: 10, padding: '10px 16px', marginBottom: 12,
          display: 'flex', alignItems: 'center', gap: 10,
        }}>
          <span style={{ fontSize: 14 }}>⚠️</span>
          <span style={{ fontFamily: 'var(--font-body)', fontSize: '0.78rem', color: 'var(--rose)' }}>{error}</span>
        </div>
      )}

      {/* ── Chat window ── */}
      <div style={{
        background: 'var(--surface)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius)',
        height: 460, display: 'flex', flexDirection: 'column',
        marginBottom: 16, overflow: 'hidden',
      }}>
        {/* Messages */}
        <div style={{ flex: 1, overflowY: 'auto', padding: '28px 28px 16px', display: 'flex', flexDirection: 'column', gap: 20 }}>
          {messages.map((msg, i) => (
            <div key={i} style={{
              display: 'flex',
              justifyContent: msg.role === 'user' ? 'flex-end' : 'flex-start',
              animation: 'fadeUp 0.3s ease',
            }}>
              {msg.role === 'assistant' && (
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: msg.isError
                    ? 'linear-gradient(135deg, #fb7185, #e11d48)'
                    : 'linear-gradient(135deg, var(--accent), var(--accent2))',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14, marginRight: 12, marginTop: 2,
                  boxShadow: msg.isError ? '0 0 12px rgba(251,113,133,0.4)' : '0 0 12px var(--accent-glow)',
                }}>{msg.isError ? '!' : '✦'}</div>
              )}
              <div style={{
                maxWidth: '72%',
                background: msg.role === 'user'
                  ? 'linear-gradient(135deg, var(--accent2), #4c1d95)'
                  : msg.isError ? 'rgba(251,113,133,0.08)' : 'rgba(255,255,255,0.05)',
                border: msg.role === 'user' ? 'none'
                  : msg.isError ? '1px solid rgba(251,113,133,0.2)' : '1px solid var(--border)',
                borderRadius: msg.role === 'user' ? '18px 18px 4px 18px' : '18px 18px 18px 4px',
                padding: '14px 18px',
                fontFamily: 'var(--font-body)', fontSize: '0.875rem',
                color: msg.role === 'user' ? '#fff' : 'var(--text)',
                lineHeight: 1.75, fontWeight: 400,
                boxShadow: msg.role === 'user' ? '0 4px 20px rgba(124,58,237,0.3)' : 'none',
              }}>{msg.content}</div>
            </div>
          ))}

          {/* Typing dots */}
          {loading && (
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, animation: 'fadeUp 0.3s ease' }}>
              <div style={{
                width: 32, height: 32, borderRadius: '50%',
                background: 'linear-gradient(135deg, var(--accent), var(--accent2))',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: 14, boxShadow: '0 0 12px var(--accent-glow)',
              }}>✦</div>
              <div style={{
                background: 'rgba(255,255,255,0.05)', border: '1px solid var(--border)',
                borderRadius: '18px 18px 18px 4px', padding: '14px 20px',
                display: 'flex', gap: 6, alignItems: 'center',
              }}>
                {[0,1,2].map(d => (
                  <div key={d} style={{
                    width: 6, height: 6, borderRadius: '50%', background: 'var(--accent)',
                    animation: `breathe 1.2s ease ${d * 0.2}s infinite`,
                  }} />
                ))}
              </div>
            </div>
          )}
          <div ref={bottomRef} />
        </div>

        {/* ── Input bar ── */}
        <div style={{
          padding: '16px 20px', borderTop: '1px solid var(--border)',
          display: 'flex', gap: 12, alignItems: 'flex-end',
          background: 'rgba(4,4,10,0.4)',
        }}>
          <textarea
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); send() } }}
            placeholder="Share what's on your mind…"
            rows={1}
            style={{
              flex: 1, background: 'rgba(255,255,255,0.04)',
              border: '1px solid var(--border)', borderRadius: 14,
              padding: '12px 18px', color: 'var(--text)',
              fontFamily: 'var(--font-body)', fontSize: '0.875rem',
              lineHeight: 1.6, resize: 'none', outline: 'none',
              maxHeight: 100, overflowY: 'auto', transition: 'border-color 0.2s ease',
            }}
            onFocus={e => e.target.style.borderColor = 'rgba(167,139,250,0.45)'}
            onBlur={e  => e.target.style.borderColor = 'var(--border)'}
          />
          <button
            onClick={() => send()}
            disabled={!input.trim() || loading}
            style={{
              width: 46, height: 46,
              background: input.trim() && !loading
                ? 'linear-gradient(135deg, var(--accent), var(--accent2))'
                : 'rgba(255,255,255,0.05)',
              border: 'none', borderRadius: 12,
              color: input.trim() && !loading ? '#fff' : 'var(--text-dim)',
              fontSize: 20, cursor: input.trim() && !loading ? 'pointer' : 'not-allowed',
              flexShrink: 0, transition: 'all 0.25s ease',
              boxShadow: input.trim() && !loading ? '0 0 20px var(--accent-glow)' : 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}
          >↑</button>
        </div>
      </div>

      {/* ── Suggestion chips ── */}
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        {suggestions.map(s => (
          <button key={s} onClick={() => send(s)} disabled={loading}
            style={{
              background: 'var(--surface)', border: '1px solid var(--border)',
              borderRadius: 100, padding: '8px 18px', color: 'var(--text-muted)',
              fontFamily: 'var(--font-body)', fontSize: '0.76rem',
              cursor: loading ? 'not-allowed' : 'pointer',
              transition: 'all 0.2s ease', opacity: loading ? 0.5 : 1,
            }}
            onMouseEnter={e => { if (!loading) { e.currentTarget.style.borderColor='rgba(167,139,250,0.35)'; e.currentTarget.style.color='var(--accent)'; e.currentTarget.style.background='rgba(167,139,250,0.06)' }}}
            onMouseLeave={e => { e.currentTarget.style.borderColor='var(--border)'; e.currentTarget.style.color='var(--text-muted)'; e.currentTarget.style.background='var(--surface)' }}
          >{s}</button>
        ))}
      </div>
    </div>
  )
}
