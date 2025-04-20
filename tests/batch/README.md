# Test Scripts Organization

This directory contains batch scripts and shell scripts for running various tests in the RadOrderPad application.

## Directory Structure

The test scripts are organized into the following subdirectories based on their functionality:

- **redis/**: Redis-related test scripts
  - `run-redis-basic-test.bat/sh`: Basic Redis connection and functionality tests
  - `run-redis-search-test.bat`: Tests for Redis search functionality
  - `test-redis-connection.bat/sh`: Tests for Redis connection

- **stripe/**: Stripe payment processing test scripts
  - `test-stripe-webhooks.bat/sh`: Tests for Stripe webhook handlers
  - `run-stripe-webhook-tests.bat`: Runner for all Stripe webhook tests

- **notifications/**: Notification service test scripts
  - `test-notifications.bat/sh`: Tests for the notification service

- **superadmin/**: SuperAdmin API test scripts
  - `test-superadmin-logs.bat/sh`: Tests for SuperAdmin logs API
  - `test-superadmin-prompt-assignments.bat/sh`: Tests for SuperAdmin prompt assignments API
  - `test-superadmin-prompts.bat`: Tests for SuperAdmin prompts API

- **ses/**: AWS SES (Simple Email Service) test scripts
  - `test-ses-email.bat/sh`: Tests for AWS SES email sending

- **general/**: General test runners
  - `run-all-tests.bat/sh`: Runs all tests
  - `run-all-optimization-tests.bat`: Runs all optimization tests

## Usage

### Windows

Run the batch files (.bat) from the command line:

```
cd tests/batch
redis\run-redis-basic-test.bat
```

### Unix/Linux/macOS

Run the shell scripts (.sh) from the terminal:

```
cd tests/batch
chmod +x redis/run-redis-basic-test.sh
./redis/run-redis-basic-test.sh
```

## Adding New Tests

When adding new test scripts:

1. Place them in the appropriate subdirectory based on functionality
2. Follow the naming convention: `test-[feature].bat/sh` or `run-[feature]-test.bat/sh`
3. Make shell scripts executable with `chmod +x`
4. Update this README if you add a new category of tests

## Organization Script

If you have test scripts in the root directory that need to be organized, you can use the organization scripts:

- Windows: `organize-test-scripts.bat`
- Unix/Linux/macOS: `organize-test-scripts.sh`

These scripts will automatically move test scripts to their appropriate directories based on their names and functionality.
