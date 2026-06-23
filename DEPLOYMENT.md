# Deployment Guide

This repository contains a Next.js frontend in `frontend/` and a Node/Express backend in `backend/`.

## Local development

1. Open a terminal in `frontend/`.
2. Install dependencies with `npm install`.
3. Start the app with `npm run dev`.
4. Visit `http://localhost:3000`.

## Deploy to Vercel

1. Push the repository to GitHub.
2. Create a new Vercel project from the repository.
3. Set the Root Directory to `frontend`.
4. Set `NEXT_PUBLIC_API_URL` in Vercel to the deployed backend URL, or rely on the built-in Next.js rewrite proxy.
5. Deploy.

Backend deployment must set `FRONTEND_URL` to the deployed frontend URL, for example `https://scholarship-platform-xi.vercel.app`.

For OTP email delivery, configure either Resend or SMTP on the deployed backend:

- Resend: `RESEND_API_KEY` and `RESEND_FROM`.
- SMTP/Gmail: `EMAIL_USER`, `EMAIL_PASS`, `EMAIL_FROM`, `SMTP_HOST`, `SMTP_PORT`, and `SMTP_SECURE`.

The registration endpoint sends the OTP to the normalized email address submitted during sign up.
