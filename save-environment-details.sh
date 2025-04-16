#!/bin/bash

echo "Saving current environment details..."

OUTPUT_FILE="environment-snapshot.md"

echo "# RadOrderPad Environment Snapshot" > $OUTPUT_FILE
echo "Created: $(date)" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

echo "## VSCode Open Tabs" >> $OUTPUT_FILE
echo "The following files were open in VSCode at the time of snapshot:" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE

find . -type f \( -name "*.ts" -o -name "*.js" -o -name "*.md" -o -name "*.json" -o -name "*.bat" -o -name "*.sh" -o -name "*.sql" -o -name "*.html" -o -name "*.css" -o -name "*.yml" -o -name "*.yaml" \) 2>/dev/null | while read file; do
    echo "- $file" >> $OUTPUT_FILE
done

echo "" >> $OUTPUT_FILE
echo "## Project Structure" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "```text" >> $OUTPUT_FILE
find . -type f | sort >> $OUTPUT_FILE
echo "```" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "## Git Status" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "```text" >> $OUTPUT_FILE
git status >> $OUTPUT_FILE
echo "```" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "## Recent Git Commits" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "```text" >> $OUTPUT_FILE
git log --max-count=10 --pretty=format:"%h - %an, %ar : %s" >> $OUTPUT_FILE
echo "```" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "## Node.js Environment" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "```text" >> $OUTPUT_FILE
node --version >> $OUTPUT_FILE
npm --version >> $OUTPUT_FILE
echo "```" >> $OUTPUT_FILE

echo "" >> $OUTPUT_FILE
echo "## Package Dependencies" >> $OUTPUT_FILE
echo "" >> $OUTPUT_FILE
echo "```json" >> $OUTPUT_FILE
cat package.json >> $OUTPUT_FILE
echo "```" >> $OUTPUT_FILE

echo "Environment details saved to $OUTPUT_FILE"
echo "You can now commit this file to your Git repository to preserve the environment details."
echo ""
echo "To add this file to your Git commit, run:"
echo "git add $OUTPUT_FILE"