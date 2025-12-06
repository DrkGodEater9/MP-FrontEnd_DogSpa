#!/bin/bash

# DogSpa Frontend Verification Script
# Verifies that cleanup was successful

echo "🔍 DogSpa Frontend Cleanup Verification"
echo "========================================"
echo ""

ERRORS=0
WARNINGS=0

# ========================================
# Check 1: db/ folder should not exist
# ========================================
echo "📁 Checking db/ folder..."
if [ -d "db" ]; then
    echo "   ❌ ERROR: db/ folder still exists!"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ PASS: db/ folder removed"
fi
echo ""

# ========================================
# Check 2: prisma/ folder should not exist
# ========================================
echo "📁 Checking prisma/ folder..."
if [ -d "prisma" ]; then
    echo "   ❌ ERROR: prisma/ folder still exists!"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ PASS: prisma/ folder removed"
fi
echo ""

# ========================================
# Check 3: src/lib/db.ts should not exist
# ========================================
echo "📄 Checking src/lib/db.ts file..."
if [ -f "src/lib/db.ts" ]; then
    echo "   ❌ ERROR: src/lib/db.ts still exists!"
    ERRORS=$((ERRORS + 1))
else
    echo "   ✅ PASS: src/lib/db.ts removed"
fi
echo ""

# ========================================
# Check 4: package.json should not contain Prisma
# ========================================
echo "📦 Checking package.json for Prisma..."
if [ -f "package.json" ]; then
    if grep -q "prisma" package.json; then
        echo "   ❌ ERROR: package.json still contains Prisma!"
        echo "   Found:"
        grep "prisma" package.json
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ PASS: No Prisma in package.json"
    fi
else
    echo "   ⚠️  WARNING: package.json not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ========================================
# Check 5: @prisma should not be in node_modules
# ========================================
echo "📦 Checking node_modules for @prisma..."
if [ -d "node_modules" ]; then
    if [ -d "node_modules/@prisma" ]; then
        echo "   ❌ ERROR: @prisma still in node_modules!"
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ PASS: @prisma removed from node_modules"
    fi
else
    echo "   ⚠️  WARNING: node_modules not found (run npm install)"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ========================================
# Check 6: Essential files should exist
# ========================================
echo "📝 Checking essential files..."

ESSENTIAL_FILES=(
    "src/hooks/useApi.ts"
    "src/store/auth.ts"
    "src/types/index.ts"
    "package.json"
    "next.config.ts"
)

for file in "${ESSENTIAL_FILES[@]}"; do
    if [ -f "$file" ]; then
        echo "   ✅ $file exists"
    else
        echo "   ❌ ERROR: $file missing!"
        ERRORS=$((ERRORS + 1))
    fi
done
echo ""

# ========================================
# Check 7: Search for any db.ts imports
# ========================================
echo "🔎 Searching for db.ts imports in source code..."
if [ -d "src" ]; then
    DB_IMPORTS=$(grep -r "from '@/lib/db'" src/ 2>/dev/null | wc -l)
    if [ "$DB_IMPORTS" -gt 0 ]; then
        echo "   ❌ ERROR: Found $DB_IMPORTS files importing db.ts:"
        grep -r "from '@/lib/db'" src/ 2>/dev/null
        ERRORS=$((ERRORS + 1))
    else
        echo "   ✅ PASS: No files importing db.ts"
    fi
else
    echo "   ⚠️  WARNING: src/ directory not found"
    WARNINGS=$((WARNINGS + 1))
fi
echo ""

# ========================================
# SUMMARY
# ========================================
echo "========================================"
echo "📊 VERIFICATION SUMMARY"
echo "========================================"

if [ $ERRORS -eq 0 ] && [ $WARNINGS -eq 0 ]; then
    echo "✅ ALL CHECKS PASSED!"
    echo ""
    echo "Your frontend is clean and ready to use!"
    echo ""
    echo "Next steps:"
    echo "  1. Run 'npm run dev' to start development server"
    echo "  2. Test API calls to Spring Boot backend"
    echo "  3. Verify authentication works"
    echo ""
    exit 0
elif [ $ERRORS -eq 0 ]; then
    echo "✅ All critical checks passed"
    echo "⚠️  $WARNINGS warning(s) found (non-critical)"
    echo ""
    echo "Your cleanup is successful!"
    echo ""
    exit 0
else
    echo "❌ $ERRORS error(s) found"
    echo "⚠️  $WARNINGS warning(s) found"
    echo ""
    echo "Please review the errors above and:"
    echo "  1. Run ./cleanup-frontend.sh again"
    echo "  2. Or manually fix the remaining issues"
    echo ""
    exit 1
fi
