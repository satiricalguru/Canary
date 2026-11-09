# Deploy Canary

## Vercel website

The public [Canary demo](https://canary-jatinjio1212-8258s-projects.vercel.app) runs on the `canary` Vercel project. The project uses Next.js, Node.js 24, the `frontend` root directory, and the `main` production branch. Pushes to `main` trigger production deployments through the Git integration.

The site uses bundled synthetic scenarios and demo endpoints. The FastAPI engine below runs as a separate service.

## FastAPI backend

## Local demo

```bash
docker compose up --build --wait
curl --fail http://127.0.0.1:8000/healthz
```

Open Swagger UI at `http://127.0.0.1:8000/docs`. Demo startup generates both site and district snapshots. Wait for the health check before making replay requests. Demo ingest is disabled. GitHub Actions builds the container, checks health and exercises the respiratory replay.

## Hosted demo

The repository includes a [Render Blueprint](../render.yaml) for a free Docker web service running synthetic read-only mode. In a signed-in Render workspace, create a Blueprint and select the Canary repository. The service uses the provider's `PORT` and `/healthz` as its health check. After deploy, open `/docs` and `/replay/respiratory?day=16` on the assigned hostname. The free service's local audit database is ephemeral. [Render Docker setup](https://render.com/docs/docker) · [Blueprint reference](https://render.com/docs/blueprint-spec)

## Authenticated local or private operation

| Setting | Meaning |
| --- | --- |
| `CANARY_DEMO=0` | Start with only ingested counts and cached weather. Require bearer credentials. |
| `CANARY_API_KEYS` | JSON object mapping bearer keys of at least 24 ASCII characters to a unique `subject`, `role` and array of `units`. Set through a secret store or local environment. |
| `CANARY_DATABASE` | SQLite file path. Defaults to `var/canary.sqlite`. Use a restricted persistent volume and a single API worker. |
| `CANARY_WEATHER_CACHE` | Parquet path. Defaults to `var/weather.parquet`. |
| `CANARY_SUPPRESSION_K` | Small-cell threshold. Defaults to 5. |
| `CANARY_CORS_ORIGINS` | Comma-separated frontend origins. Authenticated mode requires explicit origins when serving a cross-origin frontend. |

Credential structure example, using placeholder values.

```json
{
  "replace-with-a-random-hse-secret": {
    "subject": "hse-al-ain-demo",
    "role": "site_hse",
    "units": ["site-07"]
  },
  "replace-with-a-random-feed-secret": {
    "subject": "al-ain-daily-feed",
    "role": "ingest",
    "units": ["site-07", "al-ain"]
  }
}
```

Fetch and cache forecast values. To fetch an archive range, provide both dates, up to 31 days per request.

```bash
uv run python -m backend.app.data.openmeteo
uv run python -m backend.app.data.openmeteo --start 2024-11-01 --end 2024-11-02
```

Schedule the forecast refresh on the same volume as the API. A newer Parquet file is picked up on the next scoped read. The cache includes the forecast horizon. The current scorer uses days through the current Asia/Dubai date. [Data source and retention details](data.md)
