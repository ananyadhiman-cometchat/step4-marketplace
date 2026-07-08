#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
python -m app.db.seed
uvicorn app.main:app --host 0.0.0.0 --port "${APP_PORT:-8000}" --reload
