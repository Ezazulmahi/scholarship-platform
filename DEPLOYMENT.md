# Deployment Guide

This project is split into two apps:

- `backend/` -> deploy to Render
- `frontend/` -> deploy to Vercel

## 1. Prepare environment variables

Backend variables are documented in `backend/.env.example`:

- `PORT=5000`
- `FRONTEND_URL=http://localhost:3000`

Frontend variables are documented in `frontend/.env.example`:

- `NEXT_PUBLIC_API_URL=http://localhost:5000`

## 2. Deploy the backend to Render

1. Push the repository to GitHub.
2. Open Render and create a new `Web Service`.
3. Connect the GitHub repository.
4. Use these backend settings:

- Root Directory: `backend`
- Build Command: `npm install`
- Start Command: `npm start`

5. Add the environment variable:

- `FRONTEND_URL` = your Vercel frontend URL after the frontend is deployed

6. Deploy the service.

Render will assign a public URL like `https://your-backend.onrender.com`.

## 3. Deploy the frontend to Vercel

1. Open Vercel and create a new project from the same GitHub repository.
2. Set the Root Directory to `frontend`.
3. Add the environment variable:

- `NEXT_PUBLIC_API_URL` = your Render backend URL

4. Deploy the project.

Vercel will assign a public URL like `https://your-frontend.vercel.app`.

## 4. Connect both deployments

After Vercel gives you the real frontend URL:

1. Go back to Render.
2. Update `FRONTEND_URL` to the exact Vercel domain.
3. Redeploy the backend if Render does not do it automatically.

If the Render backend URL changes or you create a custom domain:

1. Update `NEXT_PUBLIC_API_URL` in Vercel.
2. Redeploy the frontend.

## 5. Health check

After deployment, test:

- Backend root: `https://your-backend.onrender.com/`
- Backend health: `https://your-backend.onrender.com/health`

The backend should return JSON.

## 6. When you add frontend API calls

Use `process.env.NEXT_PUBLIC_API_URL` in the frontend for all backend requests so local and hosted environments use different URLs without changing code.
