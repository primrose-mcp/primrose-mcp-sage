/**
 * Accounting Tools for Sage MCP Server
 *
 * MCP tools for managing:
 * - Ledger Accounts (Chart of Accounts)
 * - Tax Rates
 * - Journals
 * - Ledger Entries
 * - Opening Balances
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

const journalLineSchema = z.object({
  ledgerAccountId: z.string().describe('Ledger account ID'),
  debit: z.number().optional().describe('Debit amount'),
  credit: z.number().optional().describe('Credit amount'),
  details: z.string().optional().describe('Line details'),
  taxRateId: z.string().optional().describe('Tax rate ID'),
});

/**
 * Register all accounting-related tools
 */
export function registerAccountingTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // LEDGER ACCOUNTS
  // ===========================================================================

  server.tool(
    'sage_list_ledger_accounts',
    `List ledger accounts (chart of accounts) with pagination and filtering.

Args:
  - search: Search query
  - visibleIn: Filter by visibility (expenses, banking, journals, sales, purchases)
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of ledger accounts with balances.`,
    {
      search: z.string().optional().describe('Search query'),
      visibleIn: z.string().optional().describe('Filter by visibility'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ search, visibleIn, page, itemsPerPage, format }) => {
      try {
        const result = await client.listLedgerAccounts({ search, visibleIn, page, itemsPerPage });
        return formatResponse(result, format, 'ledger_accounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_ledger_account',
    `Get a ledger account by ID.

Args:
  - id: Ledger account ID
  - format: Response format

Returns:
  The ledger account with all details including balance.`,
    {
      id: z.string().describe('Ledger account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const account = await client.getLedgerAccount(id);
        return formatResponse(account, format, 'ledger_account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_ledger_account',
    `Create a new ledger account.

Args:
  - name: Account name (required)
  - ledgerAccountTypeId: Account type ID (required)
  - nominalCode: Nominal/account code
  - ledgerAccountGroupId: Account group ID
  - taxRateId: Default tax rate ID
  - visibleInExpenses: Show in expenses
  - visibleInBanking: Show in banking
  - visibleInJournals: Show in journals
  - visibleInSales: Show in sales
  - visibleInPurchases: Show in purchases

Returns:
  The created ledger account.`,
    {
      name: z.string().describe('Account name'),
      ledgerAccountTypeId: z.string().describe('Account type ID'),
      nominalCode: z.number().int().optional().describe('Nominal/account code'),
      ledgerAccountGroupId: z.string().optional().describe('Account group ID'),
      taxRateId: z.string().optional().describe('Default tax rate ID'),
      visibleInExpenses: z.boolean().optional().describe('Show in expenses'),
      visibleInBanking: z.boolean().optional().describe('Show in banking'),
      visibleInJournals: z.boolean().optional().describe('Show in journals'),
      visibleInSales: z.boolean().optional().describe('Show in sales'),
      visibleInPurchases: z.boolean().optional().describe('Show in purchases'),
    },
    async (input) => {
      try {
        const account = await client.createLedgerAccount(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Ledger account created', account }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_ledger_account',
    `Update an existing ledger account.

Args:
  - id: Ledger account ID to update (required)
  - name: New account name
  - nominalCode: New nominal code
  - taxRateId: New default tax rate ID
  - visibleInExpenses: Show in expenses
  - visibleInBanking: Show in banking
  - visibleInJournals: Show in journals
  - visibleInSales: Show in sales
  - visibleInPurchases: Show in purchases

Returns:
  The updated ledger account.`,
    {
      id: z.string().describe('Ledger account ID'),
      name: z.string().optional().describe('Account name'),
      nominalCode: z.number().int().optional().describe('Nominal code'),
      taxRateId: z.string().optional().describe('Default tax rate ID'),
      visibleInExpenses: z.boolean().optional().describe('Show in expenses'),
      visibleInBanking: z.boolean().optional().describe('Show in banking'),
      visibleInJournals: z.boolean().optional().describe('Show in journals'),
      visibleInSales: z.boolean().optional().describe('Show in sales'),
      visibleInPurchases: z.boolean().optional().describe('Show in purchases'),
    },
    async ({ id, ...input }) => {
      try {
        const account = await client.updateLedgerAccount(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Ledger account updated', account }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_ledger_account',
    `Delete a ledger account.

Args:
  - id: Ledger account ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Ledger account ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteLedgerAccount(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Ledger account ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // TAX RATES
  // ===========================================================================

  server.tool(
    'sage_list_tax_rates',
    `List tax rates with pagination.

Args:
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of tax rates.`,
    {
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ page, itemsPerPage, format }) => {
      try {
        const result = await client.listTaxRates({ page, itemsPerPage });
        return formatResponse(result, format, 'tax_rates');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_tax_rate',
    `Get a tax rate by ID.

Args:
  - id: Tax rate ID
  - format: Response format

Returns:
  The tax rate with all details.`,
    {
      id: z.string().describe('Tax rate ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const taxRate = await client.getTaxRate(id);
        return formatResponse(taxRate, format, 'tax_rate');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_tax_rate',
    `Create a new tax rate.

Args:
  - name: Tax rate name (required)
  - percentage: Tax percentage (required)
  - agency: Tax agency name
  - isVisible: Whether rate is visible
  - forSales: Available for sales
  - forPurchases: Available for purchases

Returns:
  The created tax rate.`,
    {
      name: z.string().describe('Tax rate name'),
      percentage: z.number().describe('Tax percentage'),
      agency: z.string().optional().describe('Tax agency name'),
      isVisible: z.boolean().optional().describe('Whether rate is visible'),
      forSales: z.boolean().optional().describe('Available for sales'),
      forPurchases: z.boolean().optional().describe('Available for purchases'),
    },
    async (input) => {
      try {
        const taxRate = await client.createTaxRate(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tax rate created', taxRate }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_tax_rate',
    `Update an existing tax rate.

Args:
  - id: Tax rate ID to update (required)
  - name: New tax rate name
  - percentage: New tax percentage
  - agency: New tax agency name
  - isVisible: New visibility status

Returns:
  The updated tax rate.`,
    {
      id: z.string().describe('Tax rate ID'),
      name: z.string().optional().describe('Tax rate name'),
      percentage: z.number().optional().describe('Tax percentage'),
      agency: z.string().optional().describe('Tax agency name'),
      isVisible: z.boolean().optional().describe('Whether rate is visible'),
    },
    async ({ id, ...input }) => {
      try {
        const taxRate = await client.updateTaxRate(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Tax rate updated', taxRate }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_tax_rate',
    `Delete a tax rate.

Args:
  - id: Tax rate ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Tax rate ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteTaxRate(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Tax rate ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // JOURNALS
  // ===========================================================================

  server.tool(
    'sage_list_journals',
    `List journals with pagination.

Args:
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of journals.`,
    {
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ page, itemsPerPage, format }) => {
      try {
        const result = await client.listJournals({ page, itemsPerPage });
        return formatResponse(result, format, 'journals');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_journal',
    `Get a journal by ID.

Args:
  - id: Journal ID
  - format: Response format

Returns:
  The journal with all details including journal lines.`,
    {
      id: z.string().describe('Journal ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const journal = await client.getJournal(id);
        return formatResponse(journal, format, 'journal');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_journal',
    `Create a new journal entry.

Args:
  - date: Journal date in YYYY-MM-DD format (required)
  - journalLines: Array of journal lines with debit/credit amounts (required)
  - reference: Journal reference
  - description: Journal description

Returns:
  The created journal.`,
    {
      date: z.string().describe('Journal date (YYYY-MM-DD)'),
      journalLines: z.array(journalLineSchema).describe('Journal lines'),
      reference: z.string().optional().describe('Journal reference'),
      description: z.string().optional().describe('Journal description'),
    },
    async (input) => {
      try {
        const journal = await client.createJournal(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Journal created', journal }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_journal',
    `Delete a journal.

Args:
  - id: Journal ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Journal ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteJournal(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Journal ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // LEDGER ENTRIES
  // ===========================================================================

  server.tool(
    'sage_list_ledger_entries',
    `List ledger entries (transactions) with pagination and filtering.

Args:
  - ledgerAccountId: Filter by ledger account ID
  - fromDate: Filter from date (YYYY-MM-DD)
  - toDate: Filter to date (YYYY-MM-DD)
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of ledger entries.`,
    {
      ledgerAccountId: z.string().optional().describe('Filter by ledger account ID'),
      fromDate: z.string().optional().describe('From date (YYYY-MM-DD)'),
      toDate: z.string().optional().describe('To date (YYYY-MM-DD)'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ ledgerAccountId, fromDate, toDate, page, itemsPerPage, format }) => {
      try {
        const result = await client.listLedgerEntries({ ledgerAccountId, fromDate, toDate, page, itemsPerPage });
        return formatResponse(result, format, 'ledger_entries');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // OPENING BALANCES
  // ===========================================================================

  server.tool(
    'sage_list_contact_opening_balances',
    `List contact opening balances.

Args:
  - contactId: Filter by contact ID
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of contact opening balances.`,
    {
      contactId: z.string().optional().describe('Filter by contact ID'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ contactId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listContactOpeningBalances({ contactId, page, itemsPerPage });
        return formatResponse(result, format, 'contact_opening_balances');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_contact_opening_balance',
    `Create a contact opening balance.

Args:
  - contactId: Contact ID (required)
  - transactionTypeId: Transaction type ID (required)
  - date: Date in YYYY-MM-DD format (required)
  - debitAmount: Debit amount
  - creditAmount: Credit amount
  - reference: Reference

Returns:
  The created contact opening balance.`,
    {
      contactId: z.string().describe('Contact ID'),
      transactionTypeId: z.string().describe('Transaction type ID'),
      date: z.string().describe('Date (YYYY-MM-DD)'),
      debitAmount: z.number().optional().describe('Debit amount'),
      creditAmount: z.number().optional().describe('Credit amount'),
      reference: z.string().optional().describe('Reference'),
    },
    async (input) => {
      try {
        const balance = await client.createContactOpeningBalance(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Contact opening balance created', balance }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_list_bank_opening_balances',
    `List bank opening balances.

Args:
  - bankAccountId: Filter by bank account ID
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of bank opening balances.`,
    {
      bankAccountId: z.string().optional().describe('Filter by bank account ID'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ bankAccountId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listBankOpeningBalances({ bankAccountId, page, itemsPerPage });
        return formatResponse(result, format, 'bank_opening_balances');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_bank_opening_balance',
    `Create a bank opening balance.

Args:
  - bankAccountId: Bank account ID (required)
  - transactionTypeId: Transaction type ID (required)
  - date: Date in YYYY-MM-DD format (required)
  - debitAmount: Debit amount
  - creditAmount: Credit amount
  - reference: Reference

Returns:
  The created bank opening balance.`,
    {
      bankAccountId: z.string().describe('Bank account ID'),
      transactionTypeId: z.string().describe('Transaction type ID'),
      date: z.string().describe('Date (YYYY-MM-DD)'),
      debitAmount: z.number().optional().describe('Debit amount'),
      creditAmount: z.number().optional().describe('Credit amount'),
      reference: z.string().optional().describe('Reference'),
    },
    async (input) => {
      try {
        const balance = await client.createBankOpeningBalance(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Bank opening balance created', balance }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_list_ledger_account_opening_balances',
    `List ledger account opening balances.

Args:
  - ledgerAccountId: Filter by ledger account ID
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of ledger account opening balances.`,
    {
      ledgerAccountId: z.string().optional().describe('Filter by ledger account ID'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ ledgerAccountId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listLedgerAccountOpeningBalances({ ledgerAccountId, page, itemsPerPage });
        return formatResponse(result, format, 'ledger_account_opening_balances');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_ledger_account_opening_balance',
    `Create a ledger account opening balance.

Args:
  - ledgerAccountId: Ledger account ID (required)
  - date: Date in YYYY-MM-DD format (required)
  - debitAmount: Debit amount
  - creditAmount: Credit amount
  - reference: Reference

Returns:
  The created ledger account opening balance.`,
    {
      ledgerAccountId: z.string().describe('Ledger account ID'),
      date: z.string().describe('Date (YYYY-MM-DD)'),
      debitAmount: z.number().optional().describe('Debit amount'),
      creditAmount: z.number().optional().describe('Credit amount'),
      reference: z.string().optional().describe('Reference'),
    },
    async (input) => {
      try {
        const balance = await client.createLedgerAccountOpeningBalance(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Ledger account opening balance created', balance }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
