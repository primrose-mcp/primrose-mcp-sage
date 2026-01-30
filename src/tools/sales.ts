/**
 * Sales Tools for Sage MCP Server
 *
 * MCP tools for managing sales transactions:
 * - Sales Invoices
 * - Sales Quotes
 * - Sales Estimates
 * - Sales Credit Notes
 * - Sales Quick Entries
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

const invoiceLineSchema = z.object({
  description: z.string().describe('Line item description'),
  quantity: z.number().describe('Quantity'),
  unitPrice: z.number().describe('Unit price'),
  ledgerAccountId: z.string().describe('Ledger account ID'),
  taxRateId: z.string().optional().describe('Tax rate ID'),
  productId: z.string().optional().describe('Product ID'),
  serviceId: z.string().optional().describe('Service ID'),
  discountAmount: z.number().optional().describe('Discount amount'),
  discountPercentage: z.number().optional().describe('Discount percentage'),
});

/**
 * Register all sales-related tools
 */
export function registerSalesTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // SALES INVOICES
  // ===========================================================================

  server.tool(
    'sage_list_sales_invoices',
    `List sales invoices with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - status: Filter by status (DRAFT, SENT, PAID, PART_PAID, VOID)
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of sales invoices.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listSalesInvoices({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'sales_invoices');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_sales_invoice',
    `Get a sales invoice by ID.

Args:
  - id: Sales invoice ID
  - format: Response format

Returns:
  The sales invoice with all details including line items.`,
    {
      id: z.string().describe('Sales invoice ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const invoice = await client.getSalesInvoice(id);
        return formatResponse(invoice, format, 'sales_invoice');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_sales_invoice',
    `Create a new sales invoice.

Args:
  - contactId: Customer contact ID (required)
  - date: Invoice date in YYYY-MM-DD format (required)
  - dueDate: Due date in YYYY-MM-DD format
  - reference: Invoice reference
  - invoiceLines: Array of invoice line items (required)
  - notes: Invoice notes
  - termsAndConditions: Terms and conditions
  - currencyId: Currency ID
  - exchangeRate: Exchange rate

Returns:
  The created sales invoice.`,
    {
      contactId: z.string().describe('Customer contact ID'),
      date: z.string().describe('Invoice date (YYYY-MM-DD)'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Invoice reference'),
      invoiceLines: z.array(invoiceLineSchema).describe('Invoice line items'),
      notes: z.string().optional().describe('Invoice notes'),
      termsAndConditions: z.string().optional().describe('Terms and conditions'),
      currencyId: z.string().optional().describe('Currency ID'),
      exchangeRate: z.number().optional().describe('Exchange rate'),
    },
    async (input) => {
      try {
        const invoice = await client.createSalesInvoice(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sales invoice created', invoice }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_sales_invoice',
    `Delete a sales invoice.

Args:
  - id: Sales invoice ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Sales invoice ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteSalesInvoice(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sales invoice ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // SALES QUOTES
  // ===========================================================================

  server.tool(
    'sage_list_sales_quotes',
    `List sales quotes with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - status: Filter by status (DRAFT, SENT, ACCEPTED, DECLINED, EXPIRED)
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of sales quotes.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listSalesQuotes({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'sales_quotes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_sales_quote',
    `Get a sales quote by ID.

Args:
  - id: Sales quote ID
  - format: Response format

Returns:
  The sales quote with all details.`,
    {
      id: z.string().describe('Sales quote ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const quote = await client.getSalesQuote(id);
        return formatResponse(quote, format, 'sales_quote');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_sales_quote',
    `Create a new sales quote.

Args:
  - contactId: Customer contact ID (required)
  - date: Quote date in YYYY-MM-DD format (required)
  - expiryDate: Expiry date in YYYY-MM-DD format
  - reference: Quote reference
  - quoteLines: Array of quote line items (required)
  - notes: Quote notes
  - termsAndConditions: Terms and conditions

Returns:
  The created sales quote.`,
    {
      contactId: z.string().describe('Customer contact ID'),
      date: z.string().describe('Quote date (YYYY-MM-DD)'),
      expiryDate: z.string().optional().describe('Expiry date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Quote reference'),
      quoteLines: z.array(invoiceLineSchema).describe('Quote line items'),
      notes: z.string().optional().describe('Quote notes'),
      termsAndConditions: z.string().optional().describe('Terms and conditions'),
    },
    async (input) => {
      try {
        const quote = await client.createSalesQuote(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sales quote created', quote }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_sales_quote',
    `Delete a sales quote.

Args:
  - id: Sales quote ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Sales quote ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteSalesQuote(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sales quote ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // SALES ESTIMATES
  // ===========================================================================

  server.tool(
    'sage_list_sales_estimates',
    `List sales estimates with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - status: Filter by status
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of sales estimates.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listSalesEstimates({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'sales_estimates');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_sales_estimate',
    `Get a sales estimate by ID.

Args:
  - id: Sales estimate ID
  - format: Response format

Returns:
  The sales estimate with all details.`,
    {
      id: z.string().describe('Sales estimate ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const estimate = await client.getSalesEstimate(id);
        return formatResponse(estimate, format, 'sales_estimate');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_sales_estimate',
    `Create a new sales estimate.

Args:
  - contactId: Customer contact ID (required)
  - date: Estimate date in YYYY-MM-DD format (required)
  - expiryDate: Expiry date in YYYY-MM-DD format
  - reference: Estimate reference
  - estimateLines: Array of estimate line items (required)
  - notes: Estimate notes
  - termsAndConditions: Terms and conditions

Returns:
  The created sales estimate.`,
    {
      contactId: z.string().describe('Customer contact ID'),
      date: z.string().describe('Estimate date (YYYY-MM-DD)'),
      expiryDate: z.string().optional().describe('Expiry date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Estimate reference'),
      estimateLines: z.array(invoiceLineSchema).describe('Estimate line items'),
      notes: z.string().optional().describe('Estimate notes'),
      termsAndConditions: z.string().optional().describe('Terms and conditions'),
    },
    async (input) => {
      try {
        const estimate = await client.createSalesEstimate(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sales estimate created', estimate }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_sales_estimate',
    `Delete a sales estimate.

Args:
  - id: Sales estimate ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Sales estimate ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteSalesEstimate(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sales estimate ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // SALES CREDIT NOTES
  // ===========================================================================

  server.tool(
    'sage_list_sales_credit_notes',
    `List sales credit notes with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - status: Filter by status
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of sales credit notes.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listSalesCreditNotes({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'sales_credit_notes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_sales_credit_note',
    `Get a sales credit note by ID.

Args:
  - id: Sales credit note ID
  - format: Response format

Returns:
  The sales credit note with all details.`,
    {
      id: z.string().describe('Sales credit note ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const creditNote = await client.getSalesCreditNote(id);
        return formatResponse(creditNote, format, 'sales_credit_note');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_sales_credit_note',
    `Create a new sales credit note.

Args:
  - contactId: Customer contact ID (required)
  - date: Credit note date in YYYY-MM-DD format (required)
  - reference: Credit note reference
  - creditNoteLines: Array of credit note line items (required)
  - notes: Credit note notes
  - originalInvoiceId: Original invoice ID if crediting an invoice

Returns:
  The created sales credit note.`,
    {
      contactId: z.string().describe('Customer contact ID'),
      date: z.string().describe('Credit note date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Credit note reference'),
      creditNoteLines: z.array(invoiceLineSchema).describe('Credit note line items'),
      notes: z.string().optional().describe('Credit note notes'),
      originalInvoiceId: z.string().optional().describe('Original invoice ID'),
    },
    async (input) => {
      try {
        const creditNote = await client.createSalesCreditNote(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sales credit note created', creditNote }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_sales_credit_note',
    `Delete a sales credit note.

Args:
  - id: Sales credit note ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Sales credit note ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteSalesCreditNote(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sales credit note ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // SALES QUICK ENTRIES
  // ===========================================================================

  server.tool(
    'sage_list_sales_quick_entries',
    `List sales quick entries with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of sales quick entries.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listSalesQuickEntries({ contactId, search, page, itemsPerPage });
        return formatResponse(result, format, 'sales_quick_entries');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_sales_quick_entry',
    `Get a sales quick entry by ID.

Args:
  - id: Sales quick entry ID
  - format: Response format

Returns:
  The sales quick entry with all details.`,
    {
      id: z.string().describe('Sales quick entry ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const entry = await client.getSalesQuickEntry(id);
        return formatResponse(entry, format, 'sales_quick_entry');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_sales_quick_entry',
    `Create a new sales quick entry for fast invoice/credit note creation.

Args:
  - contactId: Customer contact ID (required)
  - date: Entry date in YYYY-MM-DD format (required)
  - quickEntryTypeId: Quick entry type ID (required)
  - ledgerAccountId: Ledger account ID (required)
  - netAmount: Net amount (required)
  - taxRateId: Tax rate ID
  - reference: Reference
  - details: Additional details
  - dueDate: Due date in YYYY-MM-DD format

Returns:
  The created sales quick entry.`,
    {
      contactId: z.string().describe('Customer contact ID'),
      date: z.string().describe('Entry date (YYYY-MM-DD)'),
      quickEntryTypeId: z.string().describe('Quick entry type ID'),
      ledgerAccountId: z.string().describe('Ledger account ID'),
      netAmount: z.number().describe('Net amount'),
      taxRateId: z.string().optional().describe('Tax rate ID'),
      reference: z.string().optional().describe('Reference'),
      details: z.string().optional().describe('Additional details'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
    },
    async (input) => {
      try {
        const entry = await client.createSalesQuickEntry(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Sales quick entry created', entry }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_sales_quick_entry',
    `Delete a sales quick entry.

Args:
  - id: Sales quick entry ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Sales quick entry ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteSalesQuickEntry(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Sales quick entry ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
