#!/bin/bash

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

echo "========================================"
echo "  Solar Panel Platform - Restart Script"
echo "========================================"
echo ""

# Function to check if a process is running on a specific port
check_port() {
    local port=$1
    lsof -i:$port -t 2>/dev/null
}

# Function to kill process on a specific port
kill_port() {
    local port=$1
    local pids=$(lsof -i:$port -t 2>/dev/null)
    
    if [ -n "$pids" ]; then
        echo -e "${YELLOW}Killing process on port $port (PIDs: $pids)${NC}"
        kill -9 $pids 2>/dev/null
        return 0
    else
        return 1
    fi
}

# Step 1: Stop running processes
echo -e "${BLUE}[1/3] Stopping frontend and backend processes...${NC}"
echo ""

stopped=false

# Try to kill processes on common ports
if kill_port 3000; then
    echo -e "${GREEN}✓ Frontend (port 3000) stopped${NC}"
    stopped=true
fi

if kill_port 3001; then
    echo -e "${GREEN}✓ Backend (port 3001) stopped${NC}"
    stopped=true
fi

# Also try to kill any node processes running turbo or nest
pkill -f "turbo run dev" 2>/dev/null && stopped=true
pkill -f "next dev" 2>/dev/null && stopped=true
pkill -f "nest start" 2>/dev/null && stopped=true

if [ "$stopped" = false ]; then
    echo -e "${YELLOW}ℹ No running processes found or already stopped${NC}"
fi

# Step 2: Wait for processes to fully terminate
echo ""
echo -e "${BLUE}[2/3] Waiting for processes to fully terminate...${NC}"
sleep 3

# Verify ports are free
for i in {1..5}; do
    if [ -z "$(check_port 3000)" ] && [ -z "$(check_port 3001)" ]; then
        break
    fi
    echo "Waiting for ports to be released..."
    sleep 1
done

echo ""

# Step 3: Start both frontend and backend
echo -e "${BLUE}[3/3] Starting frontend and backend...${NC}"
echo ""
echo "Starting development servers..."

# Start in the background
npm run dev &

echo ""
echo "========================================"
echo -e "${GREEN}✓ Restart Complete!${NC}"
echo "========================================"
echo ""
echo "The development servers are starting..."
echo "- Frontend (Next.js) will run on http://localhost:3000"
echo "- Backend (NestJS) will run on http://localhost:3001"
echo ""
echo "Press Ctrl+C to stop the servers"
echo "========================================"

# Wait for the background process
wait
