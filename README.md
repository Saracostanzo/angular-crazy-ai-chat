🚀 **Angular Crazy AI Chat**

✨ Interactive AI Chat Application built with Angular & Node.js
Una web app moderna che simula una chat AI con backend personalizzato e integrazione API esterna.

📸 **Features**

💬 Chat UI dinamica stile messaging app

⚡ Loading state con feedback visivo

🔁 Comunicazione frontend-backend via HTTP

🤖 Integrazione con AI API (Hugging Face Router)

🛡 Gestione errori lato client e server

🎨 UI personalizzata con layout user/bot separato

🌈 Versione "Crazy Mode" con animazioni e stile creativo

🏗 **Architettura**

angular-crazy-ai-chat/
├── angular-crazy-ai-chat-frontend/ → Angular Standalone App
└── angular-crazy-ai-chat-backend/ → Node.js + Express API server

🔹 **Frontend**

Angular (Standalone Components)

HttpClient

Reactive UI state

Component architecture (Chat, Message)

CSS personalizzato

🔹 **Backend**

Express server

CORS

Environment variables (.env)

API integration (Hugging Face Router)

Error handling & fallback logic

🛠 **Tech Stack**
Frontend	
Angular 15+		
TypeScript		
HTML5 / CSS3

Backend	
Node.js	
Express
CORS

AI
Hugging Face
LLM API


▶️ **Setup Locale**

1️⃣ Backend

cd angular-crazy-ai-chat-backend
npm install
node server.js

Server attivo su:
http://localhost:3000

2️⃣ **Frontend**

cd angular-crazy-ai-chat-frontend
npm install
ng serve

Apri:
http://localhost:57297

🔐 **Environment Variables**

Nel backend crea un file .env:

HF_API_TOKEN=your_huggingface_token_here

