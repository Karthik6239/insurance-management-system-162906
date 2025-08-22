# Insurance Management System — Frontend Workspace

This workspace contains the React frontend application in insurance_management_frontend. The app provides role-based dashboards, authentication, policies and claims management, and Supabase-based attachments.

Getting started
- See insurance_management_frontend/README.md for detailed environment variables, setup, and run instructions.
- Backend base URL defaults and other client settings are configured via .env in the app directory.

Required environment variables (app)
- REACT_APP_API_BASE_URL
- REACT_APP_SUPABASE_URL
- REACT_APP_SUPABASE_ANON_KEY
- REACT_APP_SITE_URL

Supabase for claim attachments
- The frontend uploads files to a Supabase Storage bucket named claims-attachments under the path {userId}/{claimRef}/{timestamp-filename}, then includes signed URLs with claim submissions.
- Refer to assets/supabase.md for bucket creation and RLS policies.