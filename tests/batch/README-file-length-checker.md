# File Length Checker

This tool helps identify files that may need refactoring based on their line count. It generates a report categorizing files into three groups:

1. **Critical**: Files that exceed the critical threshold (150 lines) and should be refactored immediately.
2. **Warning**: Files that exceed the warning threshold (100 lines) and are approaching the need for refactoring.
3. **OK**: Files that are below the warning threshold and don't need refactoring.

## Usage

### Windows

```
check-file-lengths.bat [path] [extension]
```

### Unix/Linux/macOS

```
./check-file-lengths.sh [path] [extension]
```

### Parameters

- `path`: The directory to scan (default: `../../src` which is the src directory from the tests/batch folder)
- `extension`: The file extension to check (default: `ts` for TypeScript files)

### Examples

Check all TypeScript files in the src directory:

```
check-file-lengths.bat ..\..\src ts
```

Check all JavaScript files in the src/services directory:

```
check-file-lengths.bat ..\..\src\services js
```

## Output

The script generates:

1. A console report showing:
   - Total number of files scanned
   - List of critical files with their line counts
   - List of warning files with their line counts
   - Summary statistics

2. A CSV file (`file-length-report.csv`) containing all files and their line counts, which can be imported into Excel or other tools for further analysis.

## Thresholds

- **Warning Threshold**: 100 lines
- **Critical Threshold**: 150 lines

These thresholds are based on the project's code quality guidelines, which recommend keeping files under 150 lines to ensure maintainability.

## Integration with Development Workflow

It's recommended to run this tool:

1. Before starting a new feature implementation to identify files that may need refactoring
2. After completing a feature to ensure no new files exceed the thresholds
3. As part of regular code quality checks

## Refactoring Strategies

When files are identified as needing refactoring, consider these approaches:

1. **Extract Components**: Move related functionality into separate files
2. **Extract Utility Functions**: Move helper functions to utility files
3. **Apply Single Responsibility Principle**: Ensure each file has a single, well-defined purpose
4. **Create Service Classes**: For business logic that can be separated from controllers