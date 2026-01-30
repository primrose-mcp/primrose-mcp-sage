/**
 * Banking Tools for Sage MCP Server
 *
 * MCP tools for managing banking:
 * - Bank Accounts
 * - Bank Deposits
 * - Bank Transfers
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all banking-related tools
 */
export function registerBankingTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // BANK ACCOUNTS
  // ===========================================================================

  server.tool(
    'sage_list_bank_accounts',
    `List bank accounts with pagination.

Args:
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of bank accounts with balance information.`,
    {
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ page, itemsPerPage, format }) => {
      try {
        const result = await client.listBankAccounts({ page, itemsPerPage });
        return formatResponse(result, format, 'bank_accounts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_bank_account',
    `Get a bank account by ID.

Args:
  - id: Bank account ID
  - format: Response format

Returns:
  The bank account with all details including balance.`,
    {
      id: z.string().describe('Bank account ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const account = await client.getBankAccount(id);
        return formatResponse(account, format, 'bank_account');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_bank_account',
    `Create a new bank account.

Args:
  - accountName: Account name (required)
  - bankAccountTypeId: Bank account type ID (required)
  - accountNumber: Account number
  - sortCode: Sort code / routing number
  - bic: BIC/SWIFT code
  - iban: IBAN
  - nominalCode: Nominal code
  - ledgerAccountId: Ledger account ID
  - defaultPaymentMethodId: Default payment method ID
  - currencyId: Currency ID

Returns:
  The created bank account.`,
    {
      accountName: z.string().describe('Account name'),
      bankAccountTypeId: z.string().describe('Bank account type ID'),
      accountNumber: z.string().optional().describe('Account number'),
      sortCode: z.string().optional().describe('Sort code / routing number'),
      bic: z.string().optional().describe('BIC/SWIFT code'),
      iban: z.string().optional().describe('IBAN'),
      nominalCode: z.number().int().optional().describe('Nominal code'),
      ledgerAccountId: z.string().optional().describe('Ledger account ID'),
      defaultPaymentMethodId: z.string().optional().describe('Default payment method ID'),
      currencyId: z.string().optional().describe('Currency ID'),
    },
    async (input) => {
      try {
        const account = await client.createBankAccount(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Bank account created', account }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_bank_account',
    `Update an existing bank account.

Args:
  - id: Bank account ID to update (required)
  - accountName: New account name
  - accountNumber: New account number
  - sortCode: New sort code
  - bic: New BIC/SWIFT code
  - iban: New IBAN

Returns:
  The updated bank account.`,
    {
      id: z.string().describe('Bank account ID'),
      accountName: z.string().optional().describe('Account name'),
      accountNumber: z.string().optional().describe('Account number'),
      sortCode: z.string().optional().describe('Sort code'),
      bic: z.string().optional().describe('BIC/SWIFT code'),
      iban: z.string().optional().describe('IBAN'),
    },
    async ({ id, ...input }) => {
      try {
        const account = await client.updateBankAccount(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Bank account updated', account }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_bank_account',
    `Delete a bank account.

Args:
  - id: Bank account ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Bank account ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteBankAccount(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Bank account ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // BANK DEPOSITS
  // ===========================================================================

  server.tool(
    'sage_list_bank_deposits',
    `List bank deposits with pagination and filtering.

Args:
  - bankAccountId: Filter by bank account ID
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of bank deposits.`,
    {
      bankAccountId: z.string().optional().describe('Filter by bank account ID'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ bankAccountId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listBankDeposits({ bankAccountId, page, itemsPerPage });
        return formatResponse(result, format, 'bank_deposits');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_bank_deposit',
    `Get a bank deposit by ID.

Args:
  - id: Bank deposit ID
  - format: Response format

Returns:
  The bank deposit with all details.`,
    {
      id: z.string().describe('Bank deposit ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const deposit = await client.getBankDeposit(id);
        return formatResponse(deposit, format, 'bank_deposit');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_bank_deposit',
    `Create a new bank deposit.

Args:
  - bankAccountId: Bank account ID (required)
  - date: Deposit date in YYYY-MM-DD format (required)
  - reference: Deposit reference
  - cashAmount: Cash amount
  - chequeAmount: Cheque amount

Returns:
  The created bank deposit.`,
    {
      bankAccountId: z.string().describe('Bank account ID'),
      date: z.string().describe('Deposit date (YYYY-MM-DD)'),
      reference: z.string().optional().describe('Deposit reference'),
      cashAmount: z.number().optional().describe('Cash amount'),
      chequeAmount: z.number().optional().describe('Cheque amount'),
    },
    async (input) => {
      try {
        const deposit = await client.createBankDeposit(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Bank deposit created', deposit }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_bank_deposit',
    `Delete a bank deposit.

Args:
  - id: Bank deposit ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Bank deposit ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteBankDeposit(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Bank deposit ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // BANK TRANSFERS
  // ===========================================================================

  server.tool(
    'sage_list_bank_transfers',
    `List bank transfers with pagination.

Args:
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of bank transfers.`,
    {
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ page, itemsPerPage, format }) => {
      try {
        const result = await client.listBankTransfers({ page, itemsPerPage });
        return formatResponse(result, format, 'bank_transfers');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_bank_transfer',
    `Get a bank transfer by ID.

Args:
  - id: Bank transfer ID
  - format: Response format

Returns:
  The bank transfer with all details.`,
    {
      id: z.string().describe('Bank transfer ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const transfer = await client.getBankTransfer(id);
        return formatResponse(transfer, format, 'bank_transfer');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_bank_transfer',
    `Create a new bank transfer between accounts.

Args:
  - fromBankAccountId: Source bank account ID (required)
  - toBankAccountId: Destination bank account ID (required)
  - date: Transfer date in YYYY-MM-DD format (required)
  - amount: Transfer amount (required)
  - reference: Transfer reference
  - description: Transfer description

Returns:
  The created bank transfer.`,
    {
      fromBankAccountId: z.string().describe('Source bank account ID'),
      toBankAccountId: z.string().describe('Destination bank account ID'),
      date: z.string().describe('Transfer date (YYYY-MM-DD)'),
      amount: z.number().describe('Transfer amount'),
      reference: z.string().optional().describe('Transfer reference'),
      description: z.string().optional().describe('Transfer description'),
    },
    async (input) => {
      try {
        const transfer = await client.createBankTransfer(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Bank transfer created', transfer }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_bank_transfer',
    `Delete a bank transfer.

Args:
  - id: Bank transfer ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Bank transfer ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteBankTransfer(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Bank transfer ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
