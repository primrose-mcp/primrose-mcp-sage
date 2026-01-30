/**
 * Settings & Reference Data Tools for Sage MCP Server
 *
 * MCP tools for managing:
 * - Business settings
 * - Countries
 * - Transaction types
 * - Attachments
 * - Attachment context types
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all settings-related tools
 */
export function registerSettingsTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // BUSINESS
  // ===========================================================================

  server.tool(
    'sage_get_business',
    `Get the current business information.

Returns:
  The business details including name, address, contact information.`,
    {},
    async () => {
      try {
        const business = await client.getBusiness();
        return formatResponse(business, 'json', 'business');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // COUNTRIES
  // ===========================================================================

  server.tool(
    'sage_list_countries',
    `List all available countries.

Returns:
  List of countries with id, code, and name.`,
    {},
    async () => {
      try {
        const countries = await client.listCountries();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ countries }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // TRANSACTION TYPES
  // ===========================================================================

  server.tool(
    'sage_list_transaction_types',
    `List all available transaction types.

Returns:
  List of transaction types (e.g., CUSTOMER_RECEIPT, VENDOR_PAYMENT, SALES_INVOICE, etc.).`,
    {},
    async () => {
      try {
        const types = await client.listTransactionTypes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ transactionTypes: types }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // ATTACHMENTS
  // ===========================================================================

  server.tool(
    'sage_list_attachments',
    `List attachments with filtering.

Args:
  - attachmentContextId: Filter by attachment context ID (e.g., invoice ID)
  - attachmentContextTypeId: Filter by context type (e.g., SALES_INVOICE, PURCHASE_INVOICE)
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of attachments.`,
    {
      attachmentContextId: z.string().optional().describe('Filter by context ID'),
      attachmentContextTypeId: z.string().optional().describe('Filter by context type'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ attachmentContextId, attachmentContextTypeId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listAttachments({ attachmentContextId, attachmentContextTypeId, page, itemsPerPage });
        return formatResponse(result, format, 'attachments');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_attachment',
    `Get an attachment by ID.

Args:
  - id: Attachment ID
  - format: Response format

Returns:
  The attachment metadata.`,
    {
      id: z.string().describe('Attachment ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const attachment = await client.getAttachment(id);
        return formatResponse(attachment, format, 'attachment');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_attachment',
    `Create a new attachment for a transaction.

Args:
  - attachmentContextId: Context ID (e.g., invoice ID) (required)
  - attachmentContextTypeId: Context type ID (required)
  - file: Base64 encoded file content (required)
  - fileName: File name (required)
  - mimeType: MIME type (required)
  - description: File description

Returns:
  The created attachment.`,
    {
      attachmentContextId: z.string().describe('Context ID (e.g., invoice ID)'),
      attachmentContextTypeId: z.string().describe('Context type ID'),
      file: z.string().describe('Base64 encoded file content'),
      fileName: z.string().describe('File name'),
      mimeType: z.string().describe('MIME type'),
      description: z.string().optional().describe('File description'),
    },
    async (input) => {
      try {
        const attachment = await client.createAttachment(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Attachment created', attachment }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_attachment',
    `Delete an attachment.

Args:
  - id: Attachment ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Attachment ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteAttachment(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Attachment ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // ATTACHMENT CONTEXT TYPES
  // ===========================================================================

  server.tool(
    'sage_list_attachment_context_types',
    `List all available attachment context types.

Returns:
  List of attachment context types (e.g., SALES_INVOICE, PURCHASE_INVOICE, CONTACT, etc.).`,
    {},
    async () => {
      try {
        const types = await client.listAttachmentContextTypes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ attachmentContextTypes: types }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
