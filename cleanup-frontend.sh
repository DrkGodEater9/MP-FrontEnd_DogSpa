#!/bin/bash

# DogSpa Frontend Cleanup Script
# Removes all unnecessary database-related files and dependencies

echo "🧹 Starting DogSpa Frontend Cleanup..."
echo ""

# Change to frontend directory (assuming script is run from project root)
# Adjust path if needed
FRONTEND_DIR="."

cd "$FRONTEND_DIR" || exit 1

echo "📂 Current directory: $(pwd)"
echo ""

# ========================================
# 1. DELETE FOLDERS
# ========================================
echo "🗑️  Step 1: Deleting unnecessary folders..."

if [ -d "db" ]; then
    echo "   ❌ Removing db/"
    rm -rf db/
fi

if [ -d "prisma" ]; then
    echo "   ❌ Removing prisma/"
    rm -rf prisma/
fi

echo "   ✅ Folders cleaned"
echo ""

# ========================================
# 2. DELETE FILES
# ========================================
echo "🗑️  Step 2: Deleting unnecessary files..."

if [ -f "src/lib/db.ts" ]; then
    echo "   ❌ Removing src/lib/db.ts"
    rm -f src/lib/db.ts
fi

echo "   ✅ Files cleaned"
echo ""

# ========================================
# 3. REMOVE NPM DEPENDENCIES
# ========================================
echo "📦 Step 3: Removing Prisma dependencies..."

npm uninstall @prisma/client prisma

echo "   ✅ Dependencies removed"
echo ""

# ========================================
# 4. UPDATE PACKAGE.JSON SCRIPTS
# ========================================
echo "📝 Step 4: Cleaning package.json scripts..."

# Create temporary file
TEMP_FILE=$(mktemp)

# Remove database-related scripts from package.json
if [ -f "package.json" ]; then
    # Use Node.js to properly parse and update JSON
    node -e "
    const fs = require('fs');
    const pkg = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    
    // Remove database scripts
    delete pkg.scripts['db:push'];
    delete pkg.scripts['db:generate'];
    delete pkg.scripts['db:migrate'];
    delete pkg.scripts['db:reset'];
    
    fs.writeFileSync('package.json', JSON.stringify(pkg, null, 2) + '\n');
    " 2>/dev/null && echo "   ✅ package.json scripts cleaned" || echo "   ⚠️  Could not auto-clean package.json scripts (remove manually)"
fi

echo ""

# ========================================
# 5. CLEAN NODE_MODULES AND CACHE
# ========================================
echo "🧼 Step 5: Cleaning build artifacts..."

if [ -d "node_modules" ]; then
    echo "   🗑️  Removing node_modules/ (will be reinstalled)"
    rm -rf node_modules/
fi

if [ -d ".next" ]; then
    echo "   🗑️  Removing .next/"
    rm -rf .next/
fi

echo "   ✅ Build artifacts cleaned"
echo ""

# ========================================
# 6. REINSTALL DEPENDENCIES
# ========================================
echo "📦 Step 6: Reinstalling clean dependencies..."

npm install

echo "   ✅ Dependencies reinstalled"
echo ""

# ========================================
# SUMMARY
# ========================================
echo "✅ =========================================="
echo "✅ CLEANUP COMPLETE!"
echo "✅ =========================================="
echo ""
echo "📋 What was removed:"
echo "   ❌ db/ folder (SQLite database)"
echo "   ❌ prisma/ folder (Prisma schema)"
echo "   ❌ src/lib/db.ts (Prisma client)"
echo "   ❌ @prisma/client dependency"
echo "   ❌ prisma devDependency"
echo "   ❌ Database-related npm scripts"
echo ""
echo "✅ Your frontend is now clean!"
echo ""
echo "🚀 Next steps:"
echo "   1. Verify package.json has no Prisma dependencies"
echo "   2. Run 'npm run dev' to test the application"
echo "   3. Ensure API calls work with Spring Boot backend"
echo ""
echo "📍 Backend URL (configured in your code):"
echo "   Production: https://dogspa-backend-production.up.railway.app"
echo "   Development: https://dogspa-backend-production.up.railway.app"
echo ""
