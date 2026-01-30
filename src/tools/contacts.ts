/**
 * Contact Tools for Sage MCP Server
 *
 * MCP tools for managing contacts (customers and vendors).
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all contact-related tools
 */
export function registerContactTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // List Contacts
  // ===========================================================================
  server.tool(
    'sage_list_contacts',
    `List contacts (customers and vendors) from Sage with pagination and search.

Returns a paginated list of contacts. Use the page number from the response to fetch the next page.

Args:
  - search: Search query to filter contacts by name
  - page: Page number (default: 1)
  - itemsPerPage: Number of items per page (1-100, default: 20)
  - format: Response format ('json' or 'markdown')

Returns:
  Paginated list of contacts with id, name, email, phone, reference.`,
    {
      search: z.string().optional().describe('Search query to filter contacts'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listContacts({ search, page, itemsPerPage });
        return formatResponse(result, format, 'contacts');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Get Contact
  // ===========================================================================
  server.tool(
    'sage_get_contact',
    `Get a single contact by ID.

Args:
  - id: The contact ID
  - format: Response format ('json' or 'markdown')

Returns:
  The contact record with all available fields.`,
    {
      id: z.string().describe('Contact ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const contact = await client.getContact(id);
        return formatResponse(contact, format, 'contact');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Create Contact
  // ===========================================================================
  server.tool(
    'sage_create_contact',
    `Create a new contact (customer or vendor) in Sage.

Args:
  - name: Contact name (required)
  - email: Email address
  - telephone: Phone number
  - mobile: Mobile phone number
  - website: Website URL
  - reference: Reference code
  - taxNumber: Tax/VAT number
  - notes: Additional notes
  - contactTypeIds: Array of contact type IDs (e.g., ['CUSTOMER', 'VENDOR'])
  - creditLimit: Credit limit amount
  - creditDays: Credit days

Returns:
  The created contact record.`,
    {
      name: z.string().describe('Contact name (required)'),
      email: z.string().email().optional().describe('Email address'),
      telephone: z.string().optional().describe('Phone number'),
      mobile: z.string().optional().describe('Mobile phone number'),
      website: z.string().optional().describe('Website URL'),
      reference: z.string().optional().describe('Reference code'),
      taxNumber: z.string().optional().describe('Tax/VAT number'),
      notes: z.string().optional().describe('Additional notes'),
      contactTypeIds: z.array(z.string()).optional().describe('Contact type IDs'),
      creditLimit: z.number().optional().describe('Credit limit'),
      creditDays: z.number().int().optional().describe('Credit days'),
    },
    async (input) => {
      try {
        const contact = await client.createContact(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Contact created', contact }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Update Contact
  // ===========================================================================
  server.tool(
    'sage_update_contact',
    `Update an existing contact.

Args:
  - id: Contact ID to update (required)
  - name: New contact name
  - email: New email address
  - telephone: New phone number
  - mobile: New mobile phone number
  - website: New website URL
  - reference: New reference code
  - taxNumber: New tax/VAT number
  - notes: New notes
  - creditLimit: New credit limit
  - creditDays: New credit days

Returns:
  The updated contact record.`,
    {
      id: z.string().describe('Contact ID to update'),
      name: z.string().optional().describe('Contact name'),
      email: z.string().email().optional().describe('Email address'),
      telephone: z.string().optional().describe('Phone number'),
      mobile: z.string().optional().describe('Mobile phone number'),
      website: z.string().optional().describe('Website URL'),
      reference: z.string().optional().describe('Reference code'),
      taxNumber: z.string().optional().describe('Tax/VAT number'),
      notes: z.string().optional().describe('Additional notes'),
      creditLimit: z.number().optional().describe('Credit limit'),
      creditDays: z.number().int().optional().describe('Credit days'),
    },
    async ({ id, ...input }) => {
      try {
        const contact = await client.updateContact(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Contact updated', contact }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // Delete Contact
  // ===========================================================================
  server.tool(
    'sage_delete_contact',
    `Delete a contact from Sage.

Args:
  - id: Contact ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Contact ID to delete'),
    },
    async ({ id }) => {
      try {
        await client.deleteContact(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Contact ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // List Contact Types
  // ===========================================================================
  server.tool(
    'sage_list_contact_types',
    `List all available contact types (e.g., CUSTOMER, VENDOR).

Returns:
  List of contact types with id and name.`,
    {},
    async () => {
      try {
        const types = await client.listContactTypes();
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ contactTypes: types }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
