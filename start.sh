#!/bin/bash

# QueryGPT Startup Script

echo "🚀 Starting QueryGPT - AI Analytics Assistant"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo -e "${RED}❌ Python 3 is not installed${NC}"
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo -e "${RED}❌ Node.js is not installed${NC}"
    exit 1
fi

# Check if database file exists
if [ ! -f "nf_buildathon.db" ]; then
    echo -e "${RED}❌ Database file 'nf_buildathon.db' not found${NC}"
    exit 1
fi

echo -e "${BLUE}📋 Pre-flight checks passed${NC}"

# Setup backend
echo -e "${YELLOW}🔧 Setting up backend...${NC}"
cd backend

# Check if virtual environment exists
if [ ! -d "venv" ]; then
    echo -e "${YELLOW}📦 Creating virtual environment...${NC}"
    python3 -m venv venv
fi

# Activate virtual environment
source venv/bin/activate

# Install backend dependencies
echo -e "${YELLOW}📦 Installing Python dependencies...${NC}"
pip install -r requirements.txt > /dev/null 2>&1

# Check if .env exists
if [ ! -f ".env" ]; then
    echo -e "${YELLOW}⚙️  Creating .env file...${NC}"
    cp .env.example .env
    echo -e "${RED}⚠️  Please add your OpenAI API key to backend/.env${NC}"
fi

# Start backend in background
echo -e "${GREEN}🚀 Starting FastAPI backend...${NC}"
python main.py &
BACKEND_PID=$!

# Go back to root and setup frontend
cd ..
echo -e "${YELLOW}🔧 Setting up frontend...${NC}"

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    echo -e "${YELLOW}📦 Installing Node.js dependencies...${NC}"
    npm install > /dev/null 2>&1
fi

# Wait a moment for backend to start
sleep 3

# Start frontend
echo -e "${GREEN}🚀 Starting Next.js frontend...${NC}"
npm run dev &
FRONTEND_PID=$!

echo -e "${GREEN}✅ QueryGPT is starting up!${NC}"
echo ""
echo -e "${BLUE}📍 Access URLs:${NC}"
echo -e "   Frontend: ${GREEN}http://localhost:3000${NC}"
echo -e "   Backend:  ${GREEN}http://localhost:8000${NC}"
echo -e "   API Docs: ${GREEN}http://localhost:8000/docs${NC}"
echo ""
echo -e "${YELLOW}💡 Try these sample queries:${NC}"
echo '   - "How many active users are there?"'
echo '   - "Show revenue by subscription plan"'
echo '   - "Gold plan kitne users ne purchase kiya?"'
echo ""
echo -e "${BLUE}Press Ctrl+C to stop all services${NC}"

# Function to cleanup on exit
cleanup() {
    echo -e "\n${YELLOW}🛑 Stopping services...${NC}"
    kill $BACKEND_PID 2>/dev/null
    kill $FRONTEND_PID 2>/dev/null
    echo -e "${GREEN}✅ All services stopped${NC}"
    exit 0
}

# Set up trap for cleanup
trap cleanup SIGINT SIGTERM

# Wait for user to stop
wait