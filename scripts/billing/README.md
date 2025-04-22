# Billing Scripts

This directory contains scripts for testing and managing billing-related functionality in the RadOrderPad application.

## Setup Scripts

### setup-test-radiology-org.js

This script creates a test radiology organization with a valid Stripe customer ID for testing the billing usage reporting functionality.

#### Usage

```bash
# Windows
setup-test-radiology-org.bat [options]

# Unix/Mac
./setup-test-radiology-org.sh [options]
```

#### Options

- `--org-name <name>`: Name for the test radiology organization (default: 'Test Radiology Group')
- `--email <email>`: Email for the test radiology organization (default: 'test-radiology@example.com')

#### Examples

```bash
# Run with default options
setup-test-radiology-org.bat

# Run with custom organization name and email
setup-test-radiology-org.bat --org-name "My Radiology Group" --email "my-radiology@example.com"
```

### setup-test-referring-org.js

This script creates a test referring organization for testing the billing usage reporting functionality.

#### Usage

```bash
# Windows
setup-test-referring-org.bat [options]

# Unix/Mac
./setup-test-referring-org.sh [options]
```

#### Options

- `--org-name <name>`: Name for the test referring organization (default: 'Test Referring Practice')
- `--email <email>`: Email for the test referring organization (default: 'test-referring@example.com')

#### Examples

```bash
# Run with default options
setup-test-referring-org.bat

# Run with custom organization name and email
setup-test-referring-org.bat --org-name "My Referring Practice" --email "my-referring@example.com"
```

#### Setup Sequence

For complete test setup, run the scripts in this order:

1. `setup-billing-tables.bat` - Creates necessary billing tables in the database
2. `setup-test-radiology-org.bat` - Creates a test radiology organization
3. `setup-test-referring-org.bat` - Creates a test referring organization
4. `test-billing-usage-reporting.bat --insert-test-data` - Creates test orders and tests the usage reporting

### setup-billing-tables.js

This script checks if the necessary billing tables exist in the database and creates them if they don't.

#### Usage

```bash
# Windows
setup-billing-tables.bat

# Unix/Mac
./setup-billing-tables.sh
```

#### Tables Created

- `billing_events` - Records billing-related events (payments, invoices, etc.)
- `credit_usage_logs` - Tracks credit consumption by organizations
- `purgatory_events` - Records when organizations enter/exit purgatory mode

## Usage Reporting Scripts

### test-billing-usage-reporting.js

This script tests the Radiology Order Usage Reporting functionality, which is used to bill Radiology Groups based on the number and type of orders they receive.

#### Usage

```bash
# Windows
test-billing-usage-reporting.bat [options]

# Unix/Mac
./test-billing-usage-reporting.sh [options]
```

#### Options

- `--insert-test-data`: Insert sample test data before running the report
- `--start-date <date>`: Start date for the reporting period (YYYY-MM-DD)
- `--end-date <date>`: End date for the reporting period (YYYY-MM-DD)

#### Examples

```bash
# Run with default date range (current month)
test-billing-usage-reporting.bat

# Run with specific date range
test-billing-usage-reporting.bat --start-date 2025-04-01 --end-date 2025-04-21

# Insert test data and run report
test-billing-usage-reporting.bat --insert-test-data
```

#### Verification

After running the script, check the Stripe Test Dashboard to verify that invoice items were created correctly:
https://dashboard.stripe.com/test/invoices

## Implementation Details

The script tests the `reportRadiologyOrderUsage` function in the BillingService, which:

1. Queries the orders database to count orders received by each Radiology Group
2. Categorizes orders as standard or advanced imaging based on modality or CPT code
3. Creates Stripe invoice items for billing purposes
4. Logs billing events in the database

For more details, see the [Radiology Usage Reporting documentation](../../DOCS/implementation/radiology-usage-reporting.md).

## Webhook Testing Scripts

### test-stripe-webhooks.js

This script tests the Stripe webhook handlers by triggering webhook events using the Stripe CLI.

#### Prerequisites

- Stripe CLI installed and configured
- Stripe CLI listening for webhook events:
  ```
  stripe listen --forward-to http://host.docker.internal:3000/api/webhooks/stripe
  ```

#### Usage

```bash
# Windows
test-stripe-webhooks.bat [--event-type EVENT_TYPE]

# Unix/Mac
./test-stripe-webhooks.sh [--event-type EVENT_TYPE]
```

#### Options

- `--event-type <type>`: Stripe event type to trigger (default: 'invoice.payment_succeeded')

#### Available Event Types

- `checkout.session.completed`
- `invoice.payment_succeeded`
- `invoice.payment_failed`
- `customer.subscription.updated`
- `customer.subscription.deleted`
- `payment_intent.succeeded`
- `payment_intent.payment_failed`

#### Examples

```bash
# Trigger invoice.payment_succeeded event
test-stripe-webhooks.bat

# Trigger checkout.session.completed event
test-stripe-webhooks.bat --event-type checkout.session.completed
```

## Related Documentation

- [Radiology Order Usage Reporting](../../DOCS/implementation/radiology-usage-reporting.md) - The current batch billing implementation
- [Radiology Usage Real-Time Monitoring](../../DOCS/implementation/radiology-usage-real-time-monitoring.md) - Proposed enhancement for real-time monitoring
- [Billing Credits](../../DOCS/billing_credits.md) - Overview of the billing system
- [Stripe Integration Setup](../../DOCS/implementation/stripe-integration-setup.md) - Details on Stripe integration
- [Stripe Webhook Handlers](../../DOCS/implementation/stripe-webhook-handlers.md) - Details on Stripe webhook handlers