
## 🫧 Luma – AI Mental Wellness Platform

Luma is an AI-powered mental wellness platform designed to support emotional well-being in a simple and safe way. It helps users understand their feelings, manage stress, and build healthier habits.

## ✨ Features
- 🤖 AI Chat Support – talk freely and get guided responses  
- 📊 Mood Tracker – track daily emotions  
- 📓 Journaling – express thoughts privately  
- 🧘 Self-care Tips – improve mental health habits  

## 🚀 Tech Stack
- Frontend: HTML, CSS, JavaScript / React  
- Backend: Node.js , express.js , local storage  
- AI: OpenAI API  

## 🎯 Goal
To create a calm, accessible space where users can reflect, heal, and grow.

## 👥 Team
Built with ❤️ by a team of 3 developers.

---

> “Your mind matters. Luma listens.”


## 🚀 Quick Start

### 1. Install frontend dependencies
```bash
npm install
```

### 2. Install backend dependencies
```bash
cd server
npm install
cd ..
```

### 3. Add your Anthropic API key
```bash
cp server/.env.example server/.env
```
Open `server/.env` and paste your key:
```
ANTHROPIC_API_KEY=sk-ant-your-key-here
```
Get your key at: https://console.anthropic.com/settings/keys

### 4. Run frontend + backend together
```bash
npm run dev:all
```

This starts:
- **Frontend** → http://localhost:5173 (Vite / React)
- **Backend**  → http://localhost:3001 (Express API)

---

## 📁 Project Structure

```
luma/
├── src/                    # React frontend
│   ├── components/
│   │   ├── Chatbot.jsx     # Calls /api/chat → Express backend
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   └── ...
│   └── styles/global.css
├── server/                 # Express backend ← NEW
│   ├── index.js            # Express API server (port 3001)
│   ├── package.json
│   └── .env.example        # copy to .env and add your key
├── vite.config.js          # Proxies /api → localhost:3001
└── package.json
```

---

## 🔌 API Endpoints

| Method | Path         | Description                     |
|--------|--------------|---------------------------------|
| POST   | /api/chat    | Send messages, get LUMA's reply |
| GET    | /api/health  | Check server + API key status   |

---

## 🧩 Available Scripts

| Command           | Description                          |
|-------------------|--------------------------------------|
| npm run dev:all   | Start frontend + backend together ✅ |
| npm run dev       | Frontend only (chatbot won't work)   |
| npm run build     | Build frontend for production        |
>>>>>>> e721b8f (first commit)
