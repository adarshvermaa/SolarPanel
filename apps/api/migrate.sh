#!/bin/bash

# Solar Panel API - Database Migration Script
# This script helps manage database migrations safely

set -e  # Exit on error

# Colors for output
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

echo -e "${GREEN}╔═══════════════════════════════════════╗${NC}"
echo -e "${GREEN}║  Solar Panel - Database Migrations   ║${NC}"
echo -e "${GREEN}╚═══════════════════════════════════════╝${NC}"
echo ""

# Check if .env file exists
if [ ! -f "../../.env" ]; then
    echo -e "${RED}❌ Error: .env file not found in root directory${NC}"
    exit 1
fi

# Load environment variables
export $(cat ../../.env | grep -v '^#' | xargs)

# Check if DATABASE_URL is set
if [ -z "$DATABASE_URL" ]; then
    echo -e "${RED}❌ Error: DATABASE_URL not set in .env file${NC}"
    exit 1
fi

echo -e "${GREEN}✓${NC} Environment variables loaded"
echo ""

# Function to run migrations
run_migrations() {
    echo -e "${YELLOW}🔄 Running database migrations...${NC}"
    npm run db:migrate
    echo -e "${GREEN}✅ Migrations completed successfully!${NC}"
}

# Function to generate migrations
generate_migrations() {
    echo -e "${YELLOW}🔄 Generating migration files...${NC}"
    npm run db:generate
    echo -e "${GREEN}✅ Migration files generated!${NC}"
    echo ""
    echo -e "${YELLOW}📝 Review the generated files in the drizzle/ folder${NC}"
    echo -e "${YELLOW}📝 Then run: npm run db:migrate${NC}"
}

# Function to seed database
seed_database() {
    echo -e "${YELLOW}🌱 Seeding database...${NC}"
    npm run db:seed
    echo -e "${GREEN}✅ Database seeded successfully!${NC}"
}

# Function to reset database
reset_database() {
    echo -e "${RED}⚠️  WARNING: This will delete all data!${NC}"
    read -p "Are you sure you want to reset the database? (yes/no): " confirm
    
    if [ "$confirm" = "yes" ]; then
        echo -e "${YELLOW}🔄 Resetting database...${NC}"
        npm run db:reset
        echo -e "${GREEN}✅ Database reset completed!${NC}"
    else
        echo -e "${YELLOW}❌ Reset cancelled${NC}"
    fi
}

# Function to open Drizzle Studio
open_studio() {
    echo -e "${GREEN}🎨 Opening Drizzle Studio...${NC}"
    echo -e "${YELLOW}📝 Studio will be available at: http://localhost:4983${NC}"
    npm run db:studio
}

# Main menu
echo "Select an option:"
echo "1) Generate migrations (from schema changes)"
echo "2) Run migrations (apply to database)"
echo "3) Seed database"
echo "4) Reset database (⚠️  DANGEROUS)"
echo "5) Open Drizzle Studio"
echo "6) Exit"
echo ""
read -p "Enter choice [1-6]: " choice

case $choice in
    1)
        generate_migrations
        ;;
    2)
        run_migrations
        ;;
    3)
        seed_database
        ;;
    4)
        reset_database
        ;;
    5)
        open_studio
        ;;
    6)
        echo -e "${GREEN}👋 Goodbye!${NC}"
        exit 0
        ;;
    *)
        echo -e "${RED}❌ Invalid option${NC}"
        exit 1
        ;;
esac
