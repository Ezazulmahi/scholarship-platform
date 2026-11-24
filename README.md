# ScholarPath

A study-abroad helper for students. It matches scholarships to your profile, writes a first draft of your statement of purpose, estimates yearly costs by country, university and programme, gives step-by-step application guides and has an AI advisor chat. The requirements are in [SRS.md](SRS.md).

## How it is built

| Part | Folder | Stack |
|---|---|---|
| Web app | `frontend/` | Next.js 16 (App Router), React 19, TypeScript, Tailwind CSS 4, axios |
| API | `backend/` | Node.js, Express 5, Supabase (Postgres) client, JWT in an httpOnly cookie, bcrypt, nodemailer |
| AI service | `ai-service/` | FastAPI, LangChain, Groq (`llama-3.3-70b-versatile`), Chroma vector store with `all-MiniLM-L6-v2` embeddings |

The browser only talks to the Express API. The API checks the session and forwards AI requests to the FastAPI service, which runs retrieval over the scholarship knowledge base in `ai-service/rag/` and calls Groq.

```
browser ──► Next.js ──(rewrite /auth /profile /ai)──► Express API ──► Supabase Postgres
                                                        │
                                                        └──► FastAPI AI service ──► Groq LLM
                                                                   └── Chroma (local vector store)
```

## Running it locally

You need Node.js 20+, Python 3.11+, a Supabase project, a Groq API key and an SMTP account for OTP emails.

1. Database: run `supabase/schema.sql` in the Supabase SQL editor.
2. AI service
   ```bash
   cd ai-service
   python -m venv venv && venv/Scripts/activate   # source venv/bin/activate on macOS/Linux
   pip install -r requirements.txt
   cp .env.example .env                            # add GROQ_API_KEY
   uvicorn main:app --port 8000
   ```
3. API
   ```bash
   cd backend
   npm install
   cp .env.example .env                            # add JWT_SECRET, SUPABASE_URL, SUPABASE_KEY, SMTP settings
   npm run dev                                     # http://localhost:5000
   ```
4. Web app
   ```bash
   cd frontend
   npm install
   cp .env.example .env.local
   npm run dev                                     # http://localhost:3000
   ```

## Tests

```bash
cd backend
npm test
```

The tests stub the Supabase user model, so they need no database, network or email account.

## Security notes

- Passwords are hashed with bcrypt (cost 12). Sessions are a 7-day JWT in an `httpOnly`, `Secure`, `SameSite=None` cookie.
- Sign-up and password reset use a 6-digit email OTP from `crypto.randomInt`, valid for 10 minutes and compared in constant time.
- Rate limits: 50 auth requests per 15 minutes per IP, 5 OTP attempts per 15 minutes per email, 20 AI requests per minute per IP.
- CORS only allows the origins listed in `backend/app.js`, `FRONTEND_URL` and `ALLOWED_ORIGINS`.

Deployment steps are in [DEPLOYMENT.md](DEPLOYMENT.md).
