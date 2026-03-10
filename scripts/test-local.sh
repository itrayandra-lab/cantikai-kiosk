#!/bin/bash

# Cantik AI v2.0 - Local Testing Script
# This script tests if everything is properly configured

echo "🧪 Cantik AI v2.0 - Local Testing"
echo "=================================="
echo ""

# Colors
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check Node.js
echo -n "Checking Node.js... "
if command -v node &> /dev/null; then
    NODE_VERSION=$(node -v)
    echo -e "${GREEN}✓${NC} Found: $NODE_VERSION"
else
    echo -e "${RED}✗${NC} Node.js not found!"
    echo "Install from: https://nodejs.org/"
    exit 1
fi

# Check Python
echo -n "Checking Python... "
if command -v python3 &> /dev/null; then
    PYTHON_VERSION=$(python3 --version)
    echo -e "${GREEN}✓${NC} Found: $PYTHON_VERSION"
else
    echo -e "${RED}✗${NC} Python3 not found!"
    exit 1
fi

# Check npm dependencies
echo -n "Checking npm dependencies... "
if [ -d "node_modules" ]; then
    echo -e "${GREEN}✓${NC} Installed"
else
    echo -e "${YELLOW}!${NC} Not installed"
    echo "Run: npm install"
fi

# Check Python venv
echo -n "Checking Python venv... "
if [ -d "backend-python/venv" ]; then
    echo -e "${GREEN}✓${NC} Created"
else
    echo -e "${YELLOW}!${NC} Not created"
    echo "Run: cd backend-python && python3 -m venv venv && source venv/bin/activate && pip install -r requirements.txt"
fi

# Check .env files
echo -n "Checking .env files... "
ENV_COUNT=0
if [ -f ".env" ]; then
    ENV_COUNT=$((ENV_COUNT + 1))
fi
if [ -f "backend-python/.env" ]; then
    ENV_COUNT=$((ENV_COUNT + 1))
fi

if [ $ENV_COUNT -eq 2 ]; then
    echo -e "${GREEN}✓${NC} Both found"
elif [ $ENV_COUNT -eq 1 ]; then
    echo -e "${YELLOW}!${NC} Only 1 found (need 2)"
else
    echo -e "${RED}✗${NC} Not found"
    echo "Create .env files from .env.example"
fi

# Check backend health
echo -n "Checking backend... "
if curl -s http://localhost:8000/health > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running on port 8000"
else
    echo -e "${YELLOW}!${NC} Not running"
    echo "Start: cd backend-python && source venv/bin/activate && uvicorn app.main:app --reload"
fi

# Check frontend
echo -n "Checking frontend... "
if curl -s http://localhost:5173 > /dev/null 2>&1; then
    echo -e "${GREEN}✓${NC} Running on port 5173"
else
    echo -e "${YELLOW}!${NC} Not running"
    echo "Start: npm run dev"
fi

echo ""
echo "=================================="
echo "📋 Summary:"
echo ""

# Final status
if [ -d "node_modules" ] && [ -d "backend-python/venv" ] && [ -f ".env" ] && [ -f "backend-python/.env" ]; then
    echo -e "${GREEN}✓${NC} All dependencies installed"
    echo ""
    echo "🚀 Ready to test!"
    echo ""
    echo "Start backend:  cd backend-python && source venv/bin/activate && uvicorn app.main:app --reload"
    echo "Start frontend: npm run dev"
    echo "Open browser:   http://localhost:5173"
else
    echo -e "${YELLOW}!${NC} Some dependencies missing"
    echo ""
    echo "Run setup:"
    echo "  npm install"
    echo "  cd backend-python"
    echo "  python3 -m venv venv"
    echo "  source venv/bin/activate"
    echo "  pip install -r requirements.txt"
fi

echo ""
