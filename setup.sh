#!/bin/bash

echo "🚀 Setting up JAMB CBT Prep System..."

# Check Node.js version
NODE_VERSION=$(node -v | cut -d'v' -f2 | cut -d'.' -f1)
if [ "$NODE_VERSION" -lt 20 ]; then
  echo "❌ Error: Node.js 20 or higher is required"
  exit 1
fi

echo "✅ Node.js version check passed"

# Install root dependencies
echo "📦 Installing root dependencies..."
npm install

# Install workspace dependencies
echo "📦 Installing workspace dependencies..."
npm install --workspaces

# Build shared package
echo "🔨 Building shared package..."
npm run build:shared

# Set up Husky
echo "🪝 Setting up Git hooks..."
npx husky install
chmod +x .husky/pre-commit

# Create .env files if they don't exist
if [ ! -f apps/backend/.env ]; then
  echo "📝 Creating backend .env file..."
  cp apps/backend/.env.example apps/backend/.env
fi

if [ ! -f apps/frontend/.env ]; then
  echo "📝 Creating frontend .env file..."
  cp apps/frontend/.env.example apps/frontend/.env
fi

echo "✅ Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update apps/backend/.env with your database and Redis configuration"
echo "2. Run 'npm run migrate:up --workspace=apps/backend' to set up the database"
echo "3. Run 'npm run seed:db' to populate demo data"
echo "4. Run 'npm run dev' to start the development servers"
