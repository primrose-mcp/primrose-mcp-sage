/**
 * Response Formatting Utilities for Sage MCP Server
 *
 * Helpers for formatting tool responses in JSON or Markdown.
 */

import type {
  BankAccount,
  Contact,
  LedgerAccount,
  PaginatedResponse,
  Product,
  PurchaseInvoice,
  ResponseFormat,
  SalesCreditNote,
  SalesInvoice,
  SalesQuote,
  Service,
  TaxRate,
} from '../types/entities.js';
import { formatErrorForLogging, SageApiError } from './errors.js';

/**
 * MCP tool response type
 * Note: Index signature required for MCP SDK 1.25+ compatibility
 */
export interface ToolResponse {
  [key: string]: unknown;
  content: Array<{ type: 'text'; text: string }>;
  isError?: boolean;
}

/**
 * Format a successful response
 */
export function formatResponse(
  data: unknown,
  format: ResponseFormat,
  entityType: string
): ToolResponse {
  if (format === 'markdown') {
    return {
      content: [{ type: 'text', text: formatAsMarkdown(data, entityType) }],
    };
  }
  return {
    content: [{ type: 'text', text: JSON.stringify(data, null, 2) }],
  };
}

/**
 * Format an error response
 */
export function formatError(error: unknown): ToolResponse {
  const errorInfo = formatErrorForLogging(error);

  let message: string;
  if (error instanceof SageApiError) {
    message = `Error: ${error.message}`;
    if (error.retryable) {
      message += ' (retryable)';
    }
  } else if (error instanceof Error) {
    message = `Error: ${error.message}`;
  } else {
    message = `Error: ${String(error)}`;
  }

  return {
    content: [
      {
        type: 'text',
        text: JSON.stringify({ error: message, details: errorInfo }, null, 2),
      },
    ],
    isError: true,
  };
}

/**
 * Format data as Markdown
 */
function formatAsMarkdown(data: unknown, entityType: string): string {
  if (isPaginatedResponse(data)) {
    return formatPaginatedAsMarkdown(data, entityType);
  }

  if (Array.isArray(data)) {
    return formatArrayAsMarkdown(data, entityType);
  }

  if (typeof data === 'object' && data !== null) {
    return formatObjectAsMarkdown(data as Record<string, unknown>, entityType);
  }

  return String(data);
}

/**
 * Type guard for paginated response
 */
function isPaginatedResponse(data: unknown): data is PaginatedResponse<unknown> {
  return (
    typeof data === 'object' &&
    data !== null &&
    'items' in data &&
    Array.isArray((data as PaginatedResponse<unknown>).items)
  );
}

/**
 * Format paginated response as Markdown
 */
function formatPaginatedAsMarkdown(data: PaginatedResponse<unknown>, entityType: string): string {
  const lines: string[] = [];

  lines.push(`## ${capitalize(entityType)}`);
  lines.push('');

  if (data.total !== undefined) {
    lines.push(`**Total:** ${data.total} | **Showing:** ${data.count}`);
  } else {
    lines.push(`**Showing:** ${data.count}`);
  }

  if (data.hasMore && data.nextPage) {
    lines.push(`**More available:** Yes (next page: ${data.nextPage})`);
  }
  lines.push('');

  if (data.items.length === 0) {
    lines.push('_No items found._');
    return lines.join('\n');
  }

  // Format items based on entity type
  switch (entityType) {
    case 'contacts':
      lines.push(formatContactsTable(data.items as Contact[]));
      break;
    case 'sales_invoices':
      lines.push(formatSalesInvoicesTable(data.items as SalesInvoice[]));
      break;
    case 'sales_quotes':
      lines.push(formatSalesQuotesTable(data.items as SalesQuote[]));
      break;
    case 'sales_credit_notes':
      lines.push(formatSalesCreditNotesTable(data.items as SalesCreditNote[]));
      break;
    case 'purchase_invoices':
      lines.push(formatPurchaseInvoicesTable(data.items as PurchaseInvoice[]));
      break;
    case 'bank_accounts':
      lines.push(formatBankAccountsTable(data.items as BankAccount[]));
      break;
    case 'ledger_accounts':
      lines.push(formatLedgerAccountsTable(data.items as LedgerAccount[]));
      break;
    case 'tax_rates':
      lines.push(formatTaxRatesTable(data.items as TaxRate[]));
      break;
    case 'products':
      lines.push(formatProductsTable(data.items as Product[]));
      break;
    case 'services':
      lines.push(formatServicesTable(data.items as Service[]));
      break;
    default:
      lines.push(formatGenericTable(data.items));
  }

  return lines.join('\n');
}

/**
 * Format contacts as Markdown table
 */
function formatContactsTable(contacts: Contact[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Email | Phone | Reference |');
  lines.push('|---|---|---|---|---|');

  for (const contact of contacts) {
    lines.push(
      `| ${contact.id} | ${contact.name || '-'} | ${contact.email || '-'} | ${contact.telephone || '-'} | ${contact.reference || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format sales invoices as Markdown table
 */
function formatSalesInvoicesTable(invoices: SalesInvoice[]): string {
  const lines: string[] = [];
  lines.push('| ID | Invoice # | Contact | Date | Total | Outstanding | Status |');
  lines.push('|---|---|---|---|---|---|---|');

  for (const invoice of invoices) {
    const contactName = invoice.contact?.displayedAs || invoice.contactName || '-';
    lines.push(
      `| ${invoice.id} | ${invoice.invoiceNumber || '-'} | ${contactName} | ${invoice.date || '-'} | ${invoice.totalAmount ?? '-'} | ${invoice.outstandingAmount ?? '-'} | ${invoice.status || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format sales quotes as Markdown table
 */
function formatSalesQuotesTable(quotes: SalesQuote[]): string {
  const lines: string[] = [];
  lines.push('| ID | Quote # | Contact | Date | Expiry | Total | Status |');
  lines.push('|---|---|---|---|---|---|---|');

  for (const quote of quotes) {
    const contactName = quote.contact?.displayedAs || quote.contactName || '-';
    lines.push(
      `| ${quote.id} | ${quote.quoteNumber || '-'} | ${contactName} | ${quote.date || '-'} | ${quote.expiryDate || '-'} | ${quote.totalAmount ?? '-'} | ${quote.status || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format sales credit notes as Markdown table
 */
function formatSalesCreditNotesTable(creditNotes: SalesCreditNote[]): string {
  const lines: string[] = [];
  lines.push('| ID | Credit Note # | Contact | Date | Total | Status |');
  lines.push('|---|---|---|---|---|---|');

  for (const cn of creditNotes) {
    const contactName = cn.contact?.displayedAs || cn.contactName || '-';
    lines.push(
      `| ${cn.id} | ${cn.creditNoteNumber || '-'} | ${contactName} | ${cn.date || '-'} | ${cn.totalAmount ?? '-'} | ${cn.status || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format purchase invoices as Markdown table
 */
function formatPurchaseInvoicesTable(invoices: PurchaseInvoice[]): string {
  const lines: string[] = [];
  lines.push('| ID | Vendor Ref | Contact | Date | Total | Outstanding | Status |');
  lines.push('|---|---|---|---|---|---|---|');

  for (const invoice of invoices) {
    const contactName = invoice.contact?.displayedAs || invoice.contactName || '-';
    lines.push(
      `| ${invoice.id} | ${invoice.vendorReference || invoice.reference || '-'} | ${contactName} | ${invoice.date || '-'} | ${invoice.totalAmount ?? '-'} | ${invoice.outstandingAmount ?? '-'} | ${invoice.status || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format bank accounts as Markdown table
 */
function formatBankAccountsTable(accounts: BankAccount[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Account # | Sort Code | Balance | Type |');
  lines.push('|---|---|---|---|---|---|');

  for (const account of accounts) {
    lines.push(
      `| ${account.id} | ${account.accountName || '-'} | ${account.accountNumber || '-'} | ${account.sortCode || '-'} | ${account.balance ?? '-'} | ${account.bankAccountType?.displayedAs || '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format ledger accounts as Markdown table
 */
function formatLedgerAccountsTable(accounts: LedgerAccount[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Nominal Code | Type | Balance |');
  lines.push('|---|---|---|---|---|');

  for (const account of accounts) {
    lines.push(
      `| ${account.id} | ${account.name || '-'} | ${account.nominalCode ?? '-'} | ${account.ledgerAccountType?.displayedAs || '-'} | ${account.balance ?? '-'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format tax rates as Markdown table
 */
function formatTaxRatesTable(taxRates: TaxRate[]): string {
  const lines: string[] = [];
  lines.push('| ID | Name | Percentage | Agency | For Sales | For Purchases |');
  lines.push('|---|---|---|---|---|---|');

  for (const rate of taxRates) {
    lines.push(
      `| ${rate.id} | ${rate.name || '-'} | ${rate.percentage ?? '-'}% | ${rate.agency || '-'} | ${rate.forSales ? 'Yes' : 'No'} | ${rate.forPurchases ? 'Yes' : 'No'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format products as Markdown table
 */
function formatProductsTable(products: Product[]): string {
  const lines: string[] = [];
  lines.push('| ID | Description | Item Code | Cost Price | Active |');
  lines.push('|---|---|---|---|---|');

  for (const product of products) {
    lines.push(
      `| ${product.id} | ${product.description || '-'} | ${product.itemCode || '-'} | ${product.costPrice ?? '-'} | ${product.active ? 'Yes' : 'No'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format services as Markdown table
 */
function formatServicesTable(services: Service[]): string {
  const lines: string[] = [];
  lines.push('| ID | Description | Item Code | Cost Price | Active |');
  lines.push('|---|---|---|---|---|');

  for (const service of services) {
    lines.push(
      `| ${service.id} | ${service.description || '-'} | ${service.itemCode || '-'} | ${service.costPrice ?? '-'} | ${service.active ? 'Yes' : 'No'} |`
    );
  }

  return lines.join('\n');
}

/**
 * Format a generic array as Markdown table
 */
function formatGenericTable(items: unknown[]): string {
  if (items.length === 0) return '_No items_';

  const first = items[0] as Record<string, unknown>;
  const keys = Object.keys(first).slice(0, 5); // Limit columns

  const lines: string[] = [];
  lines.push(`| ${keys.join(' | ')} |`);
  lines.push(`|${keys.map(() => '---').join('|')}|`);

  for (const item of items) {
    const record = item as Record<string, unknown>;
    const values = keys.map((k) => String(record[k] ?? '-'));
    lines.push(`| ${values.join(' | ')} |`);
  }

  return lines.join('\n');
}

/**
 * Format an array as Markdown
 */
function formatArrayAsMarkdown(data: unknown[], entityType: string): string {
  return formatGenericTable(data);
}

/**
 * Format a single object as Markdown
 */
function formatObjectAsMarkdown(data: Record<string, unknown>, entityType: string): string {
  const lines: string[] = [];
  lines.push(`## ${capitalize(entityType.replace(/s$/, ''))}`);
  lines.push('');

  for (const [key, value] of Object.entries(data)) {
    if (value === null || value === undefined) continue;

    if (typeof value === 'object') {
      lines.push(`**${formatKey(key)}:**`);
      lines.push('```json');
      lines.push(JSON.stringify(value, null, 2));
      lines.push('```');
    } else {
      lines.push(`**${formatKey(key)}:** ${value}`);
    }
  }

  return lines.join('\n');
}

/**
 * Capitalize first letter
 */
function capitalize(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1);
}

/**
 * Format a key for display (snake_case to Title Case)
 */
function formatKey(key: string): string {
  return key
    .replace(/_/g, ' ')
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, (str) => str.toUpperCase())
    .trim();
}
