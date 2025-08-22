# Insurance Management Frontend (React)

Role-based web app with JWT auth, React Router v6 routes, axios client for backend API, and Supabase integration for attachments.

## Setup

1) Create `.env` from `.env.example`:
- REACT_APP_API_BASE_URL=http://localhost:8080
- REACT_APP_SUPABASE_URL=...
- REACT_APP_SUPABASE_ANON_KEY=...
- REACT_APP_SITE_URL=http://localhost:3000

2) Install dependencies:
- npm install

3) Start app:
- npm start

## Features

- React Router v6 route structure with protected routes
- Auth flows (login/registration) using backend JWT
- Role-based dashboards (admin/agent/customer)
- Policies and Claims pages wired to backend REST endpoints
- Supabase Storage integration for Attachments
- Modern theme toggler (light/dark) and responsive layout
- Axios client with JWT interceptor

## Supabase

Follow assets/supabase.md for bucket and policy setup.
Use src/utils/supabase.js and AuthCallback for auth redirects if needed.

## Notes

- This frontend expects a backend with:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET/POST /api/policies
  - GET/POST /api/claims and GET/PATCH /api/claims/:id

Adjust endpoints as per your backend implementation.
