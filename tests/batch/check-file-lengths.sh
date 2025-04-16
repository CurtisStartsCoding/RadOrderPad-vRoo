#!/bin/bash
# Script to check file lengths and identify files that need refactoring
# Usage: ./check-file-lengths.sh [path] [extension]
# Example: ./check-file-lengths.sh ../../src ts

# Default values
path=${1:-"../../src"}
extension=${2:-"ts"}

# Define thresholds
warning_threshold=100  # Files approaching refactor status
critical_threshold=150  # Files that need immediate refactoring

echo "===== FILE LENGTH REPORT ====="
echo "Path: $path"
echo "Extension: .$extension"

# Get all files with the specified extension
files=$(find "$path" -type f -name "*.$extension" | sort)
total_files=$(echo "$files" | wc -l)
echo "Total files: $total_files"
echo ""

# Initialize counters
critical_count=0
warning_count=0
ok_count=0

# Create temporary files for storing results
critical_file=$(mktemp)
warning_file=$(mktemp)
all_file=$(mktemp)

# CSV header
echo "Path,LineCount" > "$all_file"

echo "===== CRITICAL (>= $critical_threshold lines) ====="
for file in $files; do
    # Count lines in the file
    line_count=$(wc -l < "$file")
    
    # Get relative path
    relative_path=$(echo "$file" | sed "s|$path/||")
    
    # Add to CSV
    echo "$relative_path,$line_count" >> "$all_file"
    
    if [ "$line_count" -ge "$critical_threshold" ]; then
        echo "$relative_path: $line_count lines" >> "$critical_file"
        ((critical_count++))
    elif [ "$line_count" -ge "$warning_threshold" ]; then
        echo "$relative_path: $line_count lines" >> "$warning_file"
        ((warning_count++))
    else
        ((ok_count++))
    fi
done

# Display critical files
echo "Count: $critical_count"
if [ "$critical_count" -gt 0 ]; then
    sort -t: -k2 -nr "$critical_file"
fi
echo ""

# Display warning files
echo "===== WARNING (>= $warning_threshold lines) ====="
echo "Count: $warning_count"
if [ "$warning_count" -gt 0 ]; then
    sort -t: -k2 -nr "$warning_file"
fi
echo ""

# Calculate percentages
critical_percent=$(echo "scale=1; $critical_count * 100 / $total_files" | bc)
warning_percent=$(echo "scale=1; $warning_count * 100 / $total_files" | bc)
ok_percent=$(echo "scale=1; $ok_count * 100 / $total_files" | bc)

# Display summary
echo "===== SUMMARY ====="
echo "Critical files: $critical_count ($critical_percent%)"
echo "Warning files: $warning_count ($warning_percent%)"
echo "OK files: $ok_count ($ok_percent%)"

# Export to CSV
csv_file="file-length-report.csv"
cp "$all_file" "$csv_file"

echo ""
echo "Report exported to $csv_file"

# Clean up temporary files
rm "$critical_file" "$warning_file" "$all_file"