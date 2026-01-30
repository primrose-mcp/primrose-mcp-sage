/**
 * Payment Tools for Sage MCP Server
 *
 * MCP tools for managing payments and receipts:
 * - Contact Payments (customer receipts and vendor payments)
 * - Other Payments (ad-hoc payments and receipts)
 * - Contact Allocations
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

const allocatedArtefactSchema = z.object({
  artefactType: z.string().describe('Type of artefact (e.g., SALES_INVOICE, PURCHASE_INVOICE)'),
  artefactId: z.string().describe('ID of the invoice/credit note to allocate'),
  amount: z.number().describe('Amount to allocate'),
  discount: z.number().optional().describe('Discount amount'),
});

const paymentLineSchema = z.object({
  ledgerAccountId: z.string().describe('Ledger account ID'),
  netAmount: z.number().describe('Net amount'),
  taxRateId: z.string().optional().describe('Tax rate ID'),
  details: z.string().optional().describe('Line details'),
});

/**
 * Register all payment-related tools
 */
export function registerPaymentTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // CONTACT PAYMENTS
  // ===========================================================================

  server.tool(
    'sage_list_contact_payments',
    `List contact payments (customer receipts and vendor payments) with pagination and filtering.

Args:
  - contactId: Filter by contact ID
  - bankAccountId: Filter by bank account ID
  - transactionTypeId: Filter by transaction type (CUSTOMER_RECEIPT, VENDOR_PAYMENT)
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of contact payments.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      bankAccountId: z.string().optional().describe('Filter by bank account ID'),
      transactionTypeId: z.string().optional().describe('Filter by transaction type'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, bankAccountId, transactionTypeId, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listContactPayments({ contactId, bankAccountId, transactionTypeId, search, page, itemsPerPage });
        return formatResponse(result, format, 'contact_payments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_contact_payment',
    `Get a contact payment by ID.

Args:
  - id: Contact payment ID
  - format: Response format

Returns:
  The contact payment with all details.`,
    {
      id: z.string().describe('Contact payment ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const payment = await client.getContactPayment(id);
        return formatResponse(payment, format, 'contact_payment');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_contact_payment',
    `Create a new contact payment (customer receipt or vendor payment).

Args:
  - transactionTypeId: Transaction type ID (CUSTOMER_RECEIPT or VENDOR_PAYMENT) (required)
  - contactId: Contact ID (required)
  - bankAccountId: Bank account ID (required)
  - date: Payment date in YYYY-MM-DD format (required)
  - totalAmount: Total payment amount (required)
  - reference: Payment reference
  - paymentMethodId: Payment method ID
  - allocatedArtefacts: Array of invoices/credit notes to allocate payment to

Returns:
  The created contact payment.`,
    {
      transactionTypeId: z.string().describe('Transaction type ID'),
      contactId: z.string().describe('Contact ID'),
      bankAccountId: z.string().describe('Bank account ID'),
      date: z.string().describe('Payment date (YYYY-MM-DD)'),
      totalAmount: z.number().describe('Total payment amount'),
      reference: z.string().optional().describe('Payment reference'),
      paymentMethodId: z.string().optional().describe('Payment method ID'),
      allocatedArtefacts: z.array(allocatedArtefactSchema).optional().describe('Allocated invoices/credit notes'),
    },
    async (input) => {
      try {
        const payment = await client.createContactPayment(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Contact payment created', payment }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_contact_payment',
    `Delete a contact payment.

Args:
  - id: Contact payment ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Contact payment ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteContactPayment(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Contact payment ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // OTHER PAYMENTS
  // ===========================================================================

  server.tool(
    'sage_list_other_payments',
    `List other payments (ad-hoc payments and receipts) with pagination and filtering.

Args:
  - bankAccountId: Filter by bank account ID
  - transactionTypeId: Filter by transaction type (OTHER_PAYMENT, OTHER_RECEIPT)
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of other payments.`,
    {
      bankAccountId: z.string().optional().describe('Filter by bank account ID'),
      transactionTypeId: z.string().optional().describe('Filter by transaction type'),
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ bankAccountId, transactionTypeId, search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listOtherPayments({ bankAccountId, transactionTypeId, search, page, itemsPerPage });
        return formatResponse(result, format, 'other_payments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_other_payment',
    `Get an other payment by ID.

Args:
  - id: Other payment ID
  - format: Response format

Returns:
  The other payment with all details.`,
    {
      id: z.string().describe('Other payment ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const payment = await client.getOtherPayment(id);
        return formatResponse(payment, format, 'other_payment');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_other_payment',
    `Create a new other payment (ad-hoc expense or income).

Args:
  - transactionTypeId: Transaction type ID (OTHER_PAYMENT or OTHER_RECEIPT) (required)
  - bankAccountId: Bank account ID (required)
  - date: Payment date in YYYY-MM-DD format (required)
  - paymentLines: Array of payment line items (required)
  - contactId: Optional contact ID
  - reference: Payment reference
  - paymentMethodId: Payment method ID

Returns:
  The created other payment.`,
    {
      transactionTypeId: z.string().describe('Transaction type ID'),
      bankAccountId: z.string().describe('Bank account ID'),
      date: z.string().describe('Payment date (YYYY-MM-DD)'),
      paymentLines: z.array(paymentLineSchema).describe('Payment line items'),
      contactId: z.string().optional().describe('Contact ID'),
      reference: z.string().optional().describe('Payment reference'),
      paymentMethodId: z.string().optional().describe('Payment method ID'),
    },
    async (input) => {
      try {
        const payment = await client.createOtherPayment(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Other payment created', payment }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_other_payment',
    `Delete an other payment.

Args:
  - id: Other payment ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Other payment ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteOtherPayment(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Other payment ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // CONTACT ALLOCATIONS
  // ===========================================================================

  server.tool(
    'sage_list_contact_allocations',
    `List contact allocations (payment allocations to invoices/credit notes).

Args:
  - contactId: Filter by contact ID
  - transactionTypeId: Filter by transaction type
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of contact allocations.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      transactionTypeId: z.string().optional().describe('Filter by transaction type'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, transactionTypeId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listContactAllocations({ contactId, transactionTypeId, page, itemsPerPage });
        return formatResponse(result, format, 'contact_allocations');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_contact_allocation',
    `Get a contact allocation by ID.

Args:
  - id: Contact allocation ID
  - format: Response format

Returns:
  The contact allocation with all details.`,
    {
      id: z.string().describe('Contact allocation ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const allocation = await client.getContactAllocation(id);
        return formatResponse(allocation, format, 'contact_allocation');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_contact_allocation',
    `Create a new contact allocation to match payments with invoices/credit notes.

Args:
  - contactId: Contact ID (required)
  - transactionTypeId: Transaction type ID (required)
  - date: Allocation date in YYYY-MM-DD format (required)
  - allocatedArtefacts: Array of items to allocate (required)
  - reference: Allocation reference

Returns:
  The created contact allocation.`,
    {
      contactId: z.string().describe('Contact ID'),
      transactionTypeId: z.string().describe('Transaction type ID'),
      date: z.string().describe('Allocation date (YYYY-MM-DD)'),
      allocatedArtefacts: z.array(allocatedArtefactSchema).describe('Items to allocate'),
      reference: z.string().optional().describe('Allocation reference'),
    },
    async (input) => {
      try {
        const allocation = await client.createContactAllocation(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Contact allocation created', allocation }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_contact_allocation',
    `Delete a contact allocation.

Args:
  - id: Contact allocation ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Contact allocation ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteContactAllocation(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Contact allocation ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
