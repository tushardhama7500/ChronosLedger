# ChronosLedger Backend

FastAPI backend for ChronosLedger.

## Deploy Target

- Backend: Render
- Database: Neon PostgreSQL
- Runtime: Python

## Required Environment Variables

Set these in Render under your backend service environment settings:

```env
PROJECT_NAME=ChronosLedger
VERSION=1.0.0
API_V1_STR=/api/v1
SECRET_KEY=replace-with-a-secure-random-secret
ACCESS_TOKEN_EXPIRE_MINUTES=10080
DATABASE_URL=postgresql+asyncpg://USER:PASSWORD@HOST/DBNAME?ssl=require
BACKEND_CORS_ORIGINS=["https://your-frontend.vercel.app","http://localhost:5173"]
LOW_STOCK_THRESHOLD_DEFAULT=10
REORDER_LEAD_DAYS_DEFAULT=7
```

Use the Neon connection string for `DATABASE_URL`. Make sure it uses the async SQLAlchemy format:

```text
postgresql+asyncpg://...
```

If Neon gives you a URL starting with `postgresql://`, change it to `postgresql+asyncpg://`.

## Render Setup

1. Push the project to GitHub.
2. Create a new Web Service on Render.
3. Connect the GitHub repository.
4. Set the root directory to:

```text
backend
```

5. Set the build command:

```bash
pip install -r requirements.txt
```

6. Set the start command:

```bash
uvicorn app.main:app --host 0.0.0.0 --port $PORT
```

7. Add the environment variables listed above.
8. Deploy the service.

## Neon PostgreSQL Setup

1. Create a Neon project.
2. Create or select a database.
3. Copy the pooled or direct connection string.
4. Add it to Render as `DATABASE_URL`.
5. Confirm the database allows SSL connections.

## CORS Setup

After deploying the frontend on Vercel, update `BACKEND_CORS_ORIGINS` in Render:

```env
BACKEND_CORS_ORIGINS=["https://your-vercel-app.vercel.app"]
```

For local development plus production:

```env
BACKEND_CORS_ORIGINS=["http://localhost:5173","https://your-vercel-app.vercel.app"]
```

## API Docs

After deployment, the API docs will be available at:

```text
https://{your-render-service-name}.onrender.com/api/v1/docs
```

If you configure the backend to expose docs at the root path, the docs URL will be:

```text
https://{your-render-service-name}.onrender.com/docs
```

## Health Check

Open:

```text
https://{your-render-service-name}.onrender.com/api/v1/docs
```

If the docs load, the backend is running.

If API calls fail from Vercel, check:

- `DATABASE_URL` is correct.
- `BACKEND_CORS_ORIGINS` includes the Vercel domain.
- Render service start command is correct.
- Neon database is active.
