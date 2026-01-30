/**
 * Purchase Tools for Sage MCP Server
 *
 * MCP tools for managing purchase transactions:
 * - Purchase Invoices
 * - Purchase Credit Notes
 * - Purchase Quick Entries
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
 * Register all purchase-related tools
 */
export function registerPurchaseTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // PURCHASE INVOICES
  // ===========================================================================

  server.tool(
    'sage_list_purchase_invoices',
    `List purchase invoices (bills) with pagination and filtering.

Args:
  - contactId: Filter by vendor contact ID
  - status: Filter by status (DRAFT, SENT, PAID, PART_PAID, VOID)
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of purchase invoices.`,
    {
      contactId: z.string().optional().describe('Filter by vendor contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listPurchaseInvoices({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'purchase_invoices');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_purchase_invoice',
    `Get a purchase invoice by ID.

Args:
  - id: Purchase invoice ID
  - format: Response format

Returns:
  The purchase invoice with all details including line items.`,
    {
      id: z.string().describe('Purchase invoice ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const invoice = await client.getPurchaseInvoice(id);
        return formatResponse(invoice, format, 'purchase_invoice');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_purchase_invoice',
    `Create a new purchase invoice (bill from vendor).

Args:
  - contactId: Vendor contact ID (required)
  - date: Invoice date in YYYY-MM-DD format (required)
  - dueDate: Due date in YYYY-MM-DD format
  - reference: Your reference
  - vendorReference: Vendor's invoice reference
  - invoiceLines: Array of invoice line items (required)
  - notes: Invoice notes
  - currencyId: Currency ID
  - exchangeRate: Exchange rate

Returns:
  The created purchase invoice.`,
    {
      contactId: z.string().describe('Vendor contact ID'),
      date: z.string().describe('Invoice date (YYYY-MM-DD)'),
      dueDate: z.string().optional().describe('Due date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Your reference'),
      vendorReference: z.string().optional().describe('Vendor invoice reference'),
      invoiceLines: z.array(invoiceLineSchema).describe('Invoice line items'),
      notes: z.string().optional().describe('Invoice notes'),
      currencyId: z.string().optional().describe('Currency ID'),
      exchangeRate: z.number().optional().describe('Exchange rate'),
    },
    async (input) => {
      try {
        const invoice = await client.createPurchaseInvoice(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Purchase invoice created', invoice }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_purchase_invoice',
    `Delete a purchase invoice.

Args:
  - id: Purchase invoice ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Purchase invoice ID'),
    },
    async ({ id }) => {
      try {
        await client.deletePurchaseInvoice(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Purchase invoice ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // PURCHASE CREDIT NOTES
  // ===========================================================================

  server.tool(
    'sage_list_purchase_credit_notes',
    `List purchase credit notes with pagination and filtering.

Args:
  - contactId: Filter by vendor contact ID
  - status: Filter by status
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of purchase credit notes.`,
    {
      contactId: z.string().optional().describe('Filter by vendor contact ID'),
      status: z.string().optional().describe('Filter by status'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, status, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listPurchaseCreditNotes({ contactId, status, search, page, itemsPerPage });
        return formatResponse(result, format, 'purchase_credit_notes');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_purchase_credit_note',
    `Get a purchase credit note by ID.

Args:
  - id: Purchase credit note ID
  - format: Response format

Returns:
  The purchase credit note with all details.`,
    {
      id: z.string().describe('Purchase credit note ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const creditNote = await client.getPurchaseCreditNote(id);
        return formatResponse(creditNote, format, 'purchase_credit_note');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_purchase_credit_note',
    `Create a new purchase credit note.

Args:
  - contactId: Vendor contact ID (required)
  - date: Credit note date in YYYY-MM-DD format (required)
  - reference: Your reference
  - vendorReference: Vendor's credit note reference
  - creditNoteLines: Array of credit note line items (required)
  - notes: Credit note notes
  - originalInvoiceId: Original purchase invoice ID if crediting an invoice

Returns:
  The created purchase credit note.`,
    {
      contactId: z.string().describe('Vendor contact ID'),
      date: z.string().describe('Credit note date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Your reference'),
      vendorReference: z.string().optional().describe('Vendor credit note reference'),
      creditNoteLines: z.array(invoiceLineSchema).describe('Credit note line items'),
      notes: z.string().optional().describe('Credit note notes'),
      originalInvoiceId: z.string().optional().describe('Original purchase invoice ID'),
    },
    async (input) => {
      try {
        const creditNote = await client.createPurchaseCreditNote(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Purchase credit note created', creditNote }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_purchase_credit_note',
    `Delete a purchase credit note.

Args:
  - id: Purchase credit note ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Purchase credit note ID'),
    },
    async ({ id }) => {
      try {
        await client.deletePurchaseCreditNote(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Purchase credit note ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // PURCHASE QUICK ENTRIES
  // ===========================================================================

  server.tool(
    'sage_list_purchase_quick_entries',
    `List purchase quick entries with pagination and filtering.

Args:
  - contactId: Filter by vendor contact ID
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of purchase quick entries.`,
    {
      contactId: z.string().optional().describe('Filter by vendor contact ID'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listPurchaseQuickEntries({ contactId, search, page, itemsPerPage });
        return formatResponse(result, format, 'purchase_quick_entries');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_purchase_quick_entry',
    `Get a purchase quick entry by ID.

Args:
  - id: Purchase quick entry ID
  - format: Response format

Returns:
  The purchase quick entry with all details.`,
    {
      id: z.string().describe('Purchase quick entry ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const entry = await client.getPurchaseQuickEntry(id);
        return formatResponse(entry, format, 'purchase_quick_entry');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_purchase_quick_entry',
    `Create a new purchase quick entry for fast bill/credit note creation.

Args:
  - contactId: Vendor contact ID (required)
  - date: Entry date in YYYY-MM-DD format (required)
  - quickEntryTypeId: Quick entry type ID (required)
  - ledgerAccountId: Ledger account ID (required)
  - netAmount: Net amount (required)
  - taxRateId: Tax rate ID
  - reference: Reference
  - details: Additional details
  - dueDate: Due date in YYYY-MM-DD format

Returns:
  The created purchase quick entry.`,
    {
      contactId: z.string().describe('Vendor contact ID'),
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
        const entry = await client.createPurchaseQuickEntry(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Purchase quick entry created', entry }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_purchase_quick_entry',
    `Delete a purchase quick entry.

Args:
  - id: Purchase quick entry ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Purchase quick entry ID'),
    },
    async ({ id }) => {
      try {
        await client.deletePurchaseQuickEntry(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Purchase quick entry ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
