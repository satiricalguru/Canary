#!/usr/bin/env bash

# Canary - Unified Development Launcher
# Starts both Backend (FastAPI via uv/uvicorn) and Frontend (Next.js)
# and opens the user's default browser once ready.

set -euo pipefail

# ANSI color codes for formatted terminal output
BOLD='\033[1m'
CYAN='\033[0;36m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

ROOT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$ROOT_DIR"

FRONTEND_DIR="$ROOT_DIR/frontend"
BACKEND_PORT="${BACKEND_PORT:-8000}"
FRONTEND_PORT="${FRONTEND_PORT:-3000}"
BACKEND_HOST="${BACKEND_HOST:-127.0.0.1}"
FRONTEND_URL="http://localhost:${FRONTEND_PORT}"
BACKEND_URL="http://${BACKEND_HOST}:${BACKEND_PORT}"
BACKEND_DOCS="${BACKEND_URL}/docs"

AUTO_OPEN_BROWSER=true
for arg in "$@"; do
  case "$arg" in
    --no-browser|--no-open)
      AUTO_OPEN_BROWSER=false
      ;;
  esac
done

if [ "${NO_BROWSER:-0}" = "1" ]; then
  AUTO_OPEN_BROWSER=false
fi

BACKEND_PID=""
FRONTEND_PID=""

cleanup() {
  local exit_status=$?
  # Avoid duplicate runs
  trap - SIGINT SIGTERM EXIT
  echo -e "\n${YELLOW}[Canary] Shutting down services...${NC}"

  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    echo -e "${CYAN}[Canary] Stopping frontend (PID $FRONTEND_PID)...${NC}"
    kill "$FRONTEND_PID" 2>/dev/null || true
  fi

  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    echo -e "${CYAN}[Canary] Stopping backend (PID $BACKEND_PID)...${NC}"
    kill "$BACKEND_PID" 2>/dev/null || true
  fi

  # Give processes a moment to cleanly exit
  sleep 1

  # Force kill lingering processes if needed
  if [ -n "$FRONTEND_PID" ] && kill -0 "$FRONTEND_PID" 2>/dev/null; then
    kill -9 "$FRONTEND_PID" 2>/dev/null || true
  fi
  if [ -n "$BACKEND_PID" ] && kill -0 "$BACKEND_PID" 2>/dev/null; then
    kill -9 "$BACKEND_PID" 2>/dev/null || true
  fi

  echo -e "${GREEN}[Canary] All services cleanly stopped. Goodbye!${NC}"
  exit "$exit_status"
}

# Trap termination signals
trap cleanup EXIT
trap 'exit 130' SIGINT
trap 'exit 143' SIGTERM

echo -e "${BOLD}${CYAN}==================================================${NC}"
echo -e "${BOLD}${CYAN}        Canary Surveillance Platform Launcher     ${NC}"
echo -e "${BOLD}${CYAN}==================================================${NC}"

# Check prerequisites
echo -e "${CYAN}[Canary] Checking environment prerequisites...${NC}"

# Port check helper
check_port() {
  local port="$1"
  local service_name="$2"
  if command -v lsof >/dev/null 2>&1; then
    local pid
    pid=$(lsof -ti :"$port" -sTCP:LISTEN 2>/dev/null | head -n 1 || true)
    if [ -n "$pid" ]; then
      echo -e "${RED}[Canary ERROR] Port $port ($service_name) is already in use by process PID $pid.${NC}"
      echo -e "${YELLOW}Please stop the process using port $port or change the port via environment variables.${NC}"
      exit 1
    fi
  fi
}

check_port "$BACKEND_PORT" "Backend"
check_port "$FRONTEND_PORT" "Frontend"

# 1. Determine backend launcher
if command -v uv >/dev/null 2>&1; then
  BACKEND_CMD=(uv run uvicorn backend.app.api.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" --reload)
elif [ -d "$ROOT_DIR/.venv" ] && [ -f "$ROOT_DIR/.venv/bin/uvicorn" ]; then
  BACKEND_CMD=("$ROOT_DIR/.venv/bin/uvicorn" backend.app.api.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" --reload)
elif command -v uvicorn >/dev/null 2>&1; then
  BACKEND_CMD=(uvicorn backend.app.api.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" --reload)
elif command -v python3 >/dev/null 2>&1; then
  BACKEND_CMD=(python3 -m uvicorn backend.app.api.main:app --host "$BACKEND_HOST" --port "$BACKEND_PORT" --reload)
else
  echo -e "${RED}[Canary ERROR] Neither uv nor python3/uvicorn found. Please install uv (https://docs.astral.sh/uv/) or Python 3.12+.${NC}"
  exit 1
fi

# 2. Check frontend runner
if ! command -v npm >/dev/null 2>&1; then
  echo -e "${RED}[Canary ERROR] npm is not installed or not in PATH. Please install Node.js (v18+).${NC}"
  exit 1
fi

# Function to launch the user's default browser
open_browser() {
  local target_url="$1"
  echo -e "${CYAN}[Canary] Launching default browser to ${target_url}...${NC}"
  if command -v open >/dev/null 2>&1; then
    # macOS
    open "$target_url"
  elif command -v xdg-open >/dev/null 2>&1; then
    # Linux
    xdg-open "$target_url" >/dev/null 2>&1 &
  elif command -v powershell.exe >/dev/null 2>&1; then
    # Windows / WSL
    powershell.exe -Command "Start-Process '$target_url'"
  elif command -v cmd.exe >/dev/null 2>&1; then
    cmd.exe /c start "$target_url"
  else
    echo -e "${YELLOW}[Canary] Could not automatically open browser. Please navigate to: ${target_url}${NC}"
  fi
}

# 3. Start Backend
echo -e "${CYAN}[Canary] Starting backend on ${BACKEND_URL}...${NC}"
"${BACKEND_CMD[@]}" &
BACKEND_PID=$!
echo -e "${GREEN}[Canary] Backend started with PID $BACKEND_PID${NC}"

# 4. Check and start Frontend
if [ -d "$FRONTEND_DIR" ]; then
  if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}[Canary] frontend/node_modules not found. Installing dependencies...${NC}"
    (cd "$FRONTEND_DIR" && npm ci)
  fi
  echo -e "${CYAN}[Canary] Starting frontend on ${FRONTEND_URL}...${NC}"
  (cd "$FRONTEND_DIR" && npm run dev -- -p "$FRONTEND_PORT") &
  FRONTEND_PID=$!
  echo -e "${GREEN}[Canary] Frontend started with PID $FRONTEND_PID${NC}"
else
  echo -e "${YELLOW}[Canary WARN] Frontend directory not found.${NC}"
fi

# 5. Wait for services to respond, then launch browser
if [ "$AUTO_OPEN_BROWSER" = true ]; then
  TARGET_LAUNCH_URL="$FRONTEND_URL"
  if [ ! -d "$FRONTEND_DIR" ]; then
    TARGET_LAUNCH_URL="$BACKEND_DOCS"
  fi

  echo -e "${CYAN}[Canary] Waiting for web service to become ready on ${TARGET_LAUNCH_URL}...${NC}"
  MAX_WAIT=60
  WAITED=0
  READY=false

  while [ $WAITED -lt $MAX_WAIT ]; do
    if [ -d "$FRONTEND_DIR" ]; then
      if curl -s -o /dev/null -w "%{http_code}" "http://localhost:${FRONTEND_PORT}" 2>/dev/null | grep -qE "200|304|307|308|404"; then
        READY=true
        break
      fi
    else
      if curl -s -o /dev/null -w "%{http_code}" "${BACKEND_DOCS}" 2>/dev/null | grep -qE "200|304"; then
        READY=true
        break
      fi
    fi
    sleep 1
    WAITED=$((WAITED + 1))
  done

  if [ "$READY" = true ]; then
    echo -e "${GREEN}[Canary] Server is ready!${NC}"
  else
    echo -e "${YELLOW}[Canary WARN] Reached wait threshold (${MAX_WAIT}s). Launching browser...${NC}"
  fi
  open_browser "$TARGET_LAUNCH_URL"
fi

echo -e "\n${BOLD}${GREEN}==================================================${NC}"
echo -e "${BOLD}${GREEN}  Canary Platform is running!                      ${NC}"
echo -e "${BOLD}${GREEN}==================================================${NC}"
echo -e "  ${BOLD}Frontend:${NC}  ${FRONTEND_URL}"
echo -e "  ${BOLD}Backend:${NC}   ${BACKEND_URL}"
echo -e "  ${BOLD}API Docs:${NC}  ${BACKEND_DOCS}"
echo -e "=================================================="
echo -e "${YELLOW}Press Ctrl+C to terminate both servers.${NC}\n"

# Keep running and wait for background processes
wait
