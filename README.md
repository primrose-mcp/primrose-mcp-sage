# Sage MCP Server

[![Primrose MCP](https://img.shields.io/badge/Primrose-MCP-blue)](https://primrose.dev/mcp/sage)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

A Model Context Protocol (MCP) server for the Sage Business Cloud Accounting API. This server enables AI assistants to interact with Sage for accounting, invoicing, and financial management.

## Features

- **Accounting** - General ledger and journal entries
- **Banking** - Bank accounts and transactions
- **Contacts** - Customer and supplier management
- **Payments** - Payment processing
- **Products** - Product and service catalog
- **Purchases** - Purchase invoices and bills
- **Sales** - Sales invoices and quotes
- **Settings** - Company settings and configuration

## Quick Start

The easiest way to get started is using the [Primrose SDK](https://github.com/primrose-ai/primrose-mcp):

```bash
npm install primrose-mcp
```

```typescript
import { createMCPClient } from 'primrose-mcp';

const client = createMCPClient('sage', {
  headers: {
    'X-Sage-Access-Token': 'your-oauth-access-token'
  }
});
```

## Manual Installation

Clone and install dependencies:

```bash
git clone https://github.com/primrose-ai/primrose-mcp-sage.git
cd primrose-mcp-sage
npm install
```

## Configuration

### Required Headers

| Header | Description |
|--------|-------------|
| `X-Sage-Access-Token` | OAuth access token for Sage API |

### Optional Headers

| Header | Description |
|--------|-------------|
| `X-Sage-Base-URL` | Override the default Sage API base URL |
| `X-Sage-Client-ID` | OAuth client ID |
| `X-Sage-Client-Secret` | OAuth client secret |

### Getting Your Credentials

1. Register at [Sage Developer Portal](https://developer.sage.com/)
2. Create an application to get OAuth credentials
3. Implement OAuth 2.0 flow to get access tokens

## Available Tools

### Accounting Tools
- `sage_list_ledger_accounts` - List ledger accounts
- `sage_get_ledger_account` - Get account details
- `sage_create_ledger_account` - Create an account
- `sage_update_ledger_account` - Update an account
- `sage_list_journal_entries` - List journal entries
- `sage_get_journal_entry` - Get journal entry details
- `sage_create_journal_entry` - Create a journal entry
- `sage_list_tax_rates` - List tax rates
- `sage_get_tax_rate` - Get tax rate details

### Banking Tools
- `sage_list_bank_accounts` - List bank accounts
- `sage_get_bank_account` - Get bank account details
- `sage_create_bank_account` - Create a bank account
- `sage_update_bank_account` - Update a bank account
- `sage_list_bank_transactions` - List bank transactions
- `sage_create_bank_transaction` - Create a transaction
- `sage_reconcile_transaction` - Reconcile a transaction

### Contact Tools
- `sage_list_contacts` - List all contacts
- `sage_get_contact` - Get contact details
- `sage_create_contact` - Create a contact
- `sage_update_contact` - Update a contact
- `sage_delete_contact` - Delete a contact
- `sage_list_customers` - List customers only
- `sage_list_suppliers` - List suppliers only

### Payment Tools
- `sage_list_customer_payments` - List customer payments
- `sage_get_customer_payment` - Get payment details
- `sage_create_customer_payment` - Record a customer payment
- `sage_list_supplier_payments` - List supplier payments
- `sage_get_supplier_payment` - Get payment details
- `sage_create_supplier_payment` - Record a supplier payment

### Product Tools
- `sage_list_products` - List all products
- `sage_get_product` - Get product details
- `sage_create_product` - Create a product
- `sage_update_product` - Update a product
- `sage_delete_product` - Delete a product
- `sage_list_services` - List all services
- `sage_create_service` - Create a service

### Purchase Tools
- `sage_list_purchase_invoices` - List purchase invoices
- `sage_get_purchase_invoice` - Get invoice details
- `sage_create_purchase_invoice` - Create an invoice
- `sage_update_purchase_invoice` - Update an invoice
- `sage_delete_purchase_invoice` - Delete an invoice
- `sage_list_purchase_credit_notes` - List credit notes
- `sage_create_purchase_credit_note` - Create a credit note

### Sales Tools
- `sage_list_sales_invoices` - List sales invoices
- `sage_get_sales_invoice` - Get invoice details
- `sage_create_sales_invoice` - Create an invoice
- `sage_update_sales_invoice` - Update an invoice
- `sage_delete_sales_invoice` - Delete an invoice
- `sage_email_sales_invoice` - Email an invoice
- `sage_list_sales_quotes` - List sales quotes
- `sage_get_sales_quote` - Get quote details
- `sage_create_sales_quote` - Create a quote
- `sage_convert_quote_to_invoice` - Convert quote to invoice
- `sage_list_sales_credit_notes` - List credit notes
- `sage_create_sales_credit_note` - Create a credit note

### Settings Tools
- `sage_get_business` - Get business details
- `sage_update_business` - Update business settings
- `sage_get_financial_settings` - Get financial settings
- `sage_list_countries` - List available countries
- `sage_list_currencies` - List available currencies

## Development

```bash
# Install dependencies
npm install

# Run in development mode
npm run dev

# Build for production
npm run build

# Run tests
npm test

# Type check
npm run typecheck

# Lint
npm run lint
```

## Related Resources

- [Primrose SDK](https://github.com/primrose-ai/primrose-mcp) - Unified SDK for all Primrose MCP servers
- [Sage API Documentation](https://developer.sage.com/accounting/reference/)
- [Sage Developer Portal](https://developer.sage.com/)
- [Model Context Protocol](https://modelcontextprotocol.io/)
