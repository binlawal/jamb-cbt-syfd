#!/bin/bash

# JAMB CBT Prep - Setup and Run Script
# This script sets up and starts the entire application

set -e

echo "🚀 JAMB CBT Prep - Setup and Run"
echo "================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

echo -e "${BLUE}Step 1: Starting Database Services${NC}"
echo "-----------------------------------"
docker-compose up -d
echo -e "${GREEN}✅ PostgreSQL and Redis started${NC}"
echo ""

echo "⏳ Waiting for services to be ready (10 seconds)..."
sleep 10
echo ""

echo -e "${BLUE}Step 2: Setting up Backend${NC}"
echo "-----------------------------------"
cd apps/backend

# Create .env if it doesn't exist
if [ ! -f .env ]; then
    echo "Creating .env file..."
    cp .env.example .env
    echo -e "${GREEN}✅ .env file created${NC}"
else
    echo -e "${YELLOW}⚠️  .env file already exists, skipping${NC}"
fi

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing backend dependencies..."
    npm install
    echo -e "${GREEN}✅ Backend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Backend dependencies already installed${NC}"
fi

# Run migrations
echo "Running database migrations..."
npm run migrate:up
echo -e "${GREEN}✅ Migrations completed${NC}"

# Seed subjects
echo "Seeding subjects and topics..."
npm run seed:subjects 2>/dev/null || echo -e "${YELLOW}⚠️  Subjects already seeded${NC}"

# Seed demo data
echo "Seeding demo data..."
npm run seed:demo 2>/dev/null || echo -e "${YELLOW}⚠️  Demo data already seeded${NC}"

cd ../..
echo ""

echo -e "${BLUE}Step 3: Setting up Frontend${NC}"
echo "-----------------------------------"
cd apps/frontend

# Install dependencies if needed
if [ ! -d "node_modules" ]; then
    echo "Installing frontend dependencies..."
    npm install
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
else
    echo -e "${YELLOW}⚠️  Frontend dependencies already installed${NC}"
fi

cd ../..
echo ""

echo -e "${GREEN}✅ Setup Complete!${NC}"
echo ""
echo "================================"
echo "🎉 JAMB CBT Prep is ready!"
echo "================================"
echo ""
echo "📝 Demo Credentials:"
echo "   Admin:      admin@jamb-cbt.com / admin123"
echo "   Candidate:  chidi@example.com / candidate123"
echo ""
echo "🌐 URLs:"
echo "   Frontend:   http://localhost:5173"
echo "   Backend:    http://localhost:3000"
echo "   Health:     http://localhost:3000/health/ready"
echo ""
echo "To start the application:"
echo "  1. Backend:  cd apps/backend && npm run dev"
echo "  2. Frontend: cd apps/frontend && npm run dev"
echo ""
echo "Or run both in separate terminals:"
echo "  Terminal 1: npm run dev:backend"
echo "  Terminal 2: npm run dev:frontend"
echo ""
