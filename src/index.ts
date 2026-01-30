/**
 * Sage Business Cloud Accounting MCP Server - Main Entry Point
 *
 * This file sets up the MCP server using Cloudflare's Agents SDK.
 * It supports both stateless (McpServer) and stateful (McpAgent) modes.
 *
 * MULTI-TENANT ARCHITECTURE:
 * Tenant credentials (OAuth tokens) are parsed from request headers,
 * allowing a single server deployment to serve multiple customers.
 *
 * Required Headers:
 * - X-Sage-Access-Token: OAuth access token for Sage API
 *
 * Optional Headers:
 * - X-Sage-Base-URL: Override the default Sage API base URL
 * - X-Sage-Refresh-Token: OAuth refresh token (for token refresh)
 *
 * Sage API Reference: https://developer.sage.com/accounting/reference/
 */

import { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { McpAgent } from 'agents/mcp';
import { createSageClient } from './client.js';
import {
  registerAccountingTools,
  registerBankingTools,
  registerContactTools,
  registerPaymentTools,
  registerProductTools,
  registerPurchaseTools,
  registerSalesTools,
  registerSettingsTools,
} from './tools/index.js';
import {
  type Env,
  type TenantCredentials,
  parseTenantCredentials,
  validateCredentials,
} from './types/env.js';

// =============================================================================
// MCP Server Configuration
// =============================================================================

const SERVER_NAME = 'primrose-mcp-sage';
const SERVER_VERSION = '1.0.0';

// =============================================================================
// MCP Agent (Stateful - uses Durable Objects)
// =============================================================================

/**
 * McpAgent provides stateful MCP sessions backed by Durable Objects.
 *
 * NOTE: For multi-tenant deployments, use the stateless mode (Option 2) instead.
 * The stateful McpAgent is better suited for single-tenant deployments where
 * credentials can be stored as wrangler secrets.
 *
 * @deprecated For multi-tenant support, use stateless mode with per-request credentials
 */
export class SageMcpAgent extends McpAgent<Env> {
  server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  async init() {
    // NOTE: Stateful mode requires credentials to be configured differently.
    // For multi-tenant, use the stateless /mcp endpoint with X-Sage-Access-Token header instead.
    throw new Error(
      'Stateful mode (McpAgent) is not supported for multi-tenant deployments. ' +
        'Use the stateless /mcp endpoint with X-Sage-Access-Token header instead.'
    );
  }
}

// =============================================================================
// Stateless MCP Server (Recommended - no Durable Objects needed)
// =============================================================================

/**
 * Creates a stateless MCP server instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides credentials via headers, allowing
 * a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
function createStatelessServer(credentials: TenantCredentials): McpServer {
  const server = new McpServer({
    name: SERVER_NAME,
    version: SERVER_VERSION,
  });

  // Create client with tenant-specific credentials
  const client = createSageClient(credentials);

  // Register all tool modules
  registerContactTools(server, client);
  registerSalesTools(server, client);
  registerPurchaseTools(server, client);
  registerBankingTools(server, client);
  registerPaymentTools(server, client);
  registerProductTools(server, client);
  registerAccountingTools(server, client);
  registerSettingsTools(server, client);

  // Test connection tool
  server.tool('sage_test_connection', 'Test the connection to the Sage Accounting API', {}, async () => {
    try {
      const result = await client.testConnection();
      return {
        content: [{ type: 'text', text: JSON.stringify(result, null, 2) }],
      };
    } catch (error) {
      return {
        content: [
          {
            type: 'text',
            text: `Connection failed: ${error instanceof Error ? error.message : 'Unknown error'}`,
          },
        ],
        isError: true,
      };
    }
  });

  return server;
}

// =============================================================================
// Worker Export
// =============================================================================

export default {
  /**
   * Main fetch handler for the Worker
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);

    // Health check endpoint
    if (url.pathname === '/health') {
      return new Response(JSON.stringify({ status: 'ok', server: SERVER_NAME }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }

    // ==========================================================================
    // Option 1: Stateful MCP with McpAgent (requires Durable Objects)
    // ==========================================================================
    // Uncomment to use McpAgent for stateful sessions:
    //
    // if (url.pathname === '/sse' || url.pathname === '/mcp') {
    //   return SageMcpAgent.serveSSE('/sse').fetch(request, env, ctx);
    // }

    // ==========================================================================
    // Option 2: Stateless MCP with Streamable HTTP (Recommended for multi-tenant)
    // ==========================================================================
    if (url.pathname === '/mcp' && request.method === 'POST') {
      // Parse tenant credentials from request headers
      const credentials = parseTenantCredentials(request);

      // Validate credentials are present
      try {
        validateCredentials(credentials);
      } catch (error) {
        return new Response(
          JSON.stringify({
            error: 'Unauthorized',
            message: error instanceof Error ? error.message : 'Invalid credentials',
            required_headers: ['X-Sage-Access-Token'],
          }),
          {
            status: 401,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }

      // Create server with tenant-specific credentials
      const server = createStatelessServer(credentials);

      // Import and use createMcpHandler for streamable HTTP
      // This is the recommended approach for stateless MCP servers
      const { createMcpHandler } = await import('agents/mcp');
      const handler = createMcpHandler(server);
      return handler(request, env, ctx);
    }

    // SSE endpoint for legacy clients
    if (url.pathname === '/sse') {
      // For SSE, we need to use McpAgent with serveSSE
      // Enable Durable Objects in wrangler.jsonc to use this
      return new Response('SSE endpoint requires Durable Objects. Enable in wrangler.jsonc.', {
        status: 501,
      });
    }

    // Default response
    return new Response(
      JSON.stringify({
        name: SERVER_NAME,
        version: SERVER_VERSION,
        description: 'Sage Business Cloud Accounting MCP Server',
        endpoints: {
          mcp: '/mcp (POST) - Streamable HTTP MCP endpoint',
          health: '/health - Health check',
        },
        authentication: {
          description: 'Pass tenant credentials via request headers',
          required_headers: {
            'X-Sage-Access-Token': 'OAuth access token for Sage API authentication',
          },
          optional_headers: {
            'X-Sage-Base-URL': 'Override the default Sage API base URL',
            'X-Sage-Refresh-Token': 'OAuth refresh token',
            'X-Sage-Client-ID': 'OAuth client ID',
            'X-Sage-Client-Secret': 'OAuth client secret',
          },
        },
        sage_api_docs: 'https://developer.sage.com/accounting/reference/',
        tools: [
          // Contacts
          'sage_test_connection',
          'sage_list_contacts',
          'sage_get_contact',
          'sage_create_contact',
          'sage_update_contact',
          'sage_delete_contact',
          'sage_list_contact_types',
          // Sales
          'sage_list_sales_invoices',
          'sage_get_sales_invoice',
          'sage_create_sales_invoice',
          'sage_delete_sales_invoice',
          'sage_list_sales_quotes',
          'sage_get_sales_quote',
          'sage_create_sales_quote',
          'sage_delete_sales_quote',
          'sage_list_sales_estimates',
          'sage_get_sales_estimate',
          'sage_create_sales_estimate',
          'sage_delete_sales_estimate',
          'sage_list_sales_credit_notes',
          'sage_get_sales_credit_note',
          'sage_create_sales_credit_note',
          'sage_delete_sales_credit_note',
          'sage_list_sales_quick_entries',
          'sage_get_sales_quick_entry',
          'sage_create_sales_quick_entry',
          'sage_delete_sales_quick_entry',
          // Purchases
          'sage_list_purchase_invoices',
          'sage_get_purchase_invoice',
          'sage_create_purchase_invoice',
          'sage_delete_purchase_invoice',
          'sage_list_purchase_credit_notes',
          'sage_get_purchase_credit_note',
          'sage_create_purchase_credit_note',
          'sage_delete_purchase_credit_note',
          'sage_list_purchase_quick_entries',
          'sage_get_purchase_quick_entry',
          'sage_create_purchase_quick_entry',
          'sage_delete_purchase_quick_entry',
          // Banking
          'sage_list_bank_accounts',
          'sage_get_bank_account',
          'sage_create_bank_account',
          'sage_update_bank_account',
          'sage_delete_bank_account',
          'sage_list_bank_deposits',
          'sage_get_bank_deposit',
          'sage_create_bank_deposit',
          'sage_delete_bank_deposit',
          'sage_list_bank_transfers',
          'sage_get_bank_transfer',
          'sage_create_bank_transfer',
          'sage_delete_bank_transfer',
          // Payments
          'sage_list_contact_payments',
          'sage_get_contact_payment',
          'sage_create_contact_payment',
          'sage_delete_contact_payment',
          'sage_list_other_payments',
          'sage_get_other_payment',
          'sage_create_other_payment',
          'sage_delete_other_payment',
          'sage_list_contact_allocations',
          'sage_get_contact_allocation',
          'sage_create_contact_allocation',
          'sage_delete_contact_allocation',
          // Products & Services
          'sage_list_products',
          'sage_get_product',
          'sage_create_product',
          'sage_update_product',
          'sage_delete_product',
          'sage_list_services',
          'sage_get_service',
          'sage_create_service',
          'sage_update_service',
          'sage_delete_service',
          'sage_list_stock_items',
          'sage_get_stock_item',
          'sage_create_stock_item',
          'sage_update_stock_item',
          'sage_delete_stock_item',
          'sage_list_stock_movements',
          'sage_get_stock_movement',
          'sage_create_stock_movement',
          // Accounting
          'sage_list_ledger_accounts',
          'sage_get_ledger_account',
          'sage_create_ledger_account',
          'sage_update_ledger_account',
          'sage_delete_ledger_account',
          'sage_list_tax_rates',
          'sage_get_tax_rate',
          'sage_create_tax_rate',
          'sage_update_tax_rate',
          'sage_delete_tax_rate',
          'sage_list_journals',
          'sage_get_journal',
          'sage_create_journal',
          'sage_delete_journal',
          'sage_list_ledger_entries',
          // Opening Balances
          'sage_list_contact_opening_balances',
          'sage_create_contact_opening_balance',
          'sage_list_bank_opening_balances',
          'sage_create_bank_opening_balance',
          'sage_list_ledger_account_opening_balances',
          'sage_create_ledger_account_opening_balance',
          // Settings
          'sage_get_business',
          'sage_list_countries',
          'sage_list_transaction_types',
          'sage_list_attachments',
          'sage_get_attachment',
          'sage_create_attachment',
          'sage_delete_attachment',
          'sage_list_attachment_context_types',
        ],
      }),
      {
        headers: { 'Content-Type': 'application/json' },
      }
    );
  },
};
