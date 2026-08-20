# Insurance Management Frontend (React)

This app provides role-based dashboards, JWT authentication, policy and claim flows, and Supabase-backed file attachments for claims.

Setup

1) Create .env (do not commit secrets)
- REACT_APP_API_BASE_URL=http://localhost:8080
- REACT_APP_SUPABASE_URL=your-supabase-url
- REACT_APP_SUPABASE_ANON_KEY=your-anon-key
- REACT_APP_SITE_URL=http://localhost:3000

2) Install dependencies
- npm install

3) Start app
- npm start
Open http://localhost:3000

Environment variables
- REACT_APP_API_BASE_URL: Backend base URL for axios client
- REACT_APP_SUPABASE_URL: Supabase project URL
- REACT_APP_SUPABASE_ANON_KEY: Supabase anon key for client-side access
- REACT_APP_SITE_URL: Site/redirect URL used by Supabase auth flows

Features
- React Router v6 route structure with protected routes
- Auth flows (login/registration) using backend JWT
- Role-based dashboards (admin/agent/customer)
- Policies and Claims pages wired to backend REST endpoints
- Supabase Storage integration for attachments (private bucket with signed URLs)
- Theme toggler (light/dark) and responsive layout
- Axios client with JWT interceptor

Attachments & claims
- Go to Attachments:
  - Enter a claim reference, select one or more files, and upload to Supabase Storage bucket claims-attachments under path {userId}/{claimRef}/{timestamp-filename}.
  - Provide a claim title to create a claim that includes uploaded attachment metadata (path + signedUrl). The frontend collects files uploaded for your {userId}/{claimRef} and submits them to the backend.
- The payload shape:
  {
    "title": "string",
    "claimReference": "ref-123",
    "attachments": [
      { "path": "userId/ref-123/ts-file.png", "signedUrl": "https://..." }
    ]
  }
- Files are private; viewing uses signed URLs (default 1 hour expiry).

Supabase
- Follow assets/supabase.md for bucket creation (claims-attachments) and RLS policies.
- Client is initialized in src/utils/supabase.js.
- Auth callback handling is provided in src/components/AuthCallback.js.

Notes
- Expected backend endpoints include:
  - POST /api/auth/login
  - POST /api/auth/register
  - GET/POST /api/policies
  - GET/POST /api/claims and GET/PATCH /api/claims/:id
- Adjust endpoints to match your backend if they differ.
