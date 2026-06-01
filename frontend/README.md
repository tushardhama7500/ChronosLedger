# ChronosLedger Frontend

React + TypeScript frontend for ChronosLedger.

## Deploy Target

- Frontend: Vercel
- Backend: Render
- Database: Neon PostgreSQL

## Deployment Diagram

```text
GitHub Repository
│
├── frontend/
│   │
│   └── Vercel
│       ├── Root Directory: frontend
│       ├── Build Command: npm run build
│       ├── Output Directory: dist
│       └── Environment Variable:
│           VITE_API_URL=https://{your-render-service-name}.onrender.com/api/v1
│
└── backend/
    │
    └── Render Web Service
        ├── Root Directory: backend
        ├── Build Command: pip install -r requirements.txt
        ├── Start Command:
        │   uvicorn app.main:app --host 0.0.0.0 --port $PORT
        ├── Environment Variables:
        │   DATABASE_URL=postgresql+asyncpg://...
        │   BACKEND_CORS_ORIGINS=["https://{your-vercel-app}.vercel.app"]
        │
        └── Neon PostgreSQL
            └── Provides DATABASE_URL for Render

Browser
│
└── https://{your-vercel-app}.vercel.app
    │
    └── calls VITE_API_URL
        │
        └── https://{your-render-service-name}.onrender.com/api/v1
            │
            └── connects to Neon PostgreSQL
```

## Deployment Flow

```text
1. Push code to GitHub
        │
        ▼
2. Create Neon PostgreSQL database
        │
        ▼
3. Deploy backend folder to Render
        │
        ▼
4. Add Neon DATABASE_URL to Render
        │
        ▼
5. Confirm backend docs load
        │
        ▼
6. Deploy frontend folder to Vercel
        │
        ▼
7. Add Render backend URL as VITE_API_URL in Vercel
        │
        ▼
8. Add Vercel frontend URL to BACKEND_CORS_ORIGINS in Render
        │
        ▼
9. Redeploy/restart Render backend
        │
        ▼
10. Open Vercel app and test the UI
```

## Required Environment Variables

Set this in Vercel under Project Settings > Environment Variables:

```env
VITE_API_URL=https://{your-render-service-name}.onrender.com/api/v1
```

Do not include a trailing slash.

Correct:

```text
https://{your-render-service-name}.onrender.com/api/v1
```

Avoid:

```text
https://{your-render-service-name}.onrender.com/api/v1/
```

## Vercel Setup

1. Push the project to GitHub.
2. Create a new project on Vercel.
3. Import the GitHub repository.
4. Set the root directory to:

```text
frontend
```

5. Set the framework preset to:

```text
Vite
```

6. Set the build command:

```bash
npm run build
```

7. Set the output directory:

```text
dist
```

8. Add the environment variable:

```env
VITE_API_URL=https://{your-render-service-name}.onrender.com/api/v1
```

9. Deploy.

## Backend CORS Requirement

After Vercel deploys, copy the Vercel production URL and add it to the backend `BACKEND_CORS_ORIGINS` variable on Render.

Example:

```env
BACKEND_CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

For local and production access:

```env
BACKEND_CORS_ORIGINS=["http://localhost:5173","https://your-vercel-app.vercel.app"]
```

## Deployment Order

Recommended order:

1. Create Neon PostgreSQL database.
2. Deploy backend to Render.
3. Confirm backend docs load.
4. Deploy frontend to Vercel.
5. Add the Vercel domain to backend CORS settings.
6. Redeploy or restart the Render backend.

## Local Development

Create `.env.development`:

```env
VITE_API_URL=http://localhost:8000/api/v1
```

Then run the frontend locally:

```bash
npm run dev
```

## Common Issues

If the frontend cannot call the backend:

- Confirm `VITE_API_URL` points to the Render backend.
- Confirm the Render backend is awake and deployed.
- Confirm the Vercel domain is listed in backend CORS origins.
- Confirm the backend URL includes `/api/v1`.
- Confirm the backend database connection works on Render.
