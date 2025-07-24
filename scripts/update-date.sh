#!/bin/bash

# Update Date Script for Memory Bank
# This script automatically updates the current date in memory bank files

# Get current date in the required format
CURRENT_DATE=$(date '+%B %d, %Y')
CURRENT_DATE_SHORT=$(date '+%B %d')

echo "Updating memory bank with current date: $CURRENT_DATE"

# Update 00-current-date.md
sed -i '' "s/\*\*Current Date\*\*: .*/\*\*Current Date\*\*: $CURRENT_DATE/" memory-bank/00-current-date.md

# Update 01-projectbrief.md
sed -i '' "s/\*\*Today\*\*: .*/\*\*Today\*\*: $CURRENT_DATE/" memory-bank/01-projectbrief.md

# Update 05-activeContext.md
sed -i '' "s/As of .*, the primary focus is on:/As of $CURRENT_DATE, the primary focus is on:/" memory-bank/05-activeContext.md

# Update README.md
sed -i '' "s/## Current Project State (.*)/## Current Project State ($CURRENT_DATE)/" memory-bank/README.md

echo "✅ Memory bank updated with current date: $CURRENT_DATE"
echo "📅 Date format: $CURRENT_DATE"
echo "📁 Updated files:"
echo "   - memory-bank/00-current-date.md"
echo "   - memory-bank/01-projectbrief.md"
echo "   - memory-bank/05-activeContext.md"
echo "   - memory-bank/README.md" 