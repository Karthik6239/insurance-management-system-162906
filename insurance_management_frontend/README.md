# Insurance Management Frontend (React)

Role-based web app with JWT auth, React Router v6 routes, axios client for backend API, and Supabase integration for attachments.

## Setup

1) Create `.env` (do not commit secrets):
- REACT_APP_API_BASE_URL=http://localhost:8080
- REACT_APP_SUPABASE_URL=your-supabase-url
- REACT_APP_SUPABASE_ANON_KEY=your-anon-key
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
- Supabase Storage integration for Attachments (private bucket with signed URLs)
- Modern theme toggler (light/dark) and responsive layout
- Axios client with JWT interceptor

## Attachments & Claims

- Navigate to Attachments to:
  - Enter a Claim reference, pick one or more files, and upload to Supabase Storage bucket `claims-attachments` under path `{userId}/{claimRef}/{timestamp-filename}`.
  - Create a claim that includes uploaded attachment metadata (path + signedUrl) by providing a Claim title. The frontend will collect all files uploaded under your `{userId}/{claimRef}` and submit them to the backend.
- Backend may ignore `attachments` if not implemented, but the payload follows:
  ```
  {
    "title": "string",
    "claimReference": "ref-123",
    "attachments": [
      { "path": "userId/ref-123/ts-file.png", "signedUrl": "https://..." }
    ]
  }
  ```
- Files are private; viewing uses signed URLs (1 hour expiry).

## Supabase

Follow assets/supabase.md for bucket and policy setup.
Use src/utils/supabase.js and AuthCallback for auth redirects if needed.

Environment variables required:
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_SITE_URL

## Notes

- This frontend expects a backend with:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET/POST /api/policies
  - GET/POST /api/claims and GET/PATCH /api/claims/:id

Adjust endpoints as per your backend implementation.
