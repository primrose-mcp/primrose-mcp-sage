/**
 * Products & Services Tools for Sage MCP Server
 *
 * MCP tools for managing:
 * - Products
 * - Services
 * - Stock Items
 * - Stock Movements
 */

import type { McpServer } from '@modelcontextprotocol/sdk/server/mcp.js';
import { z } from 'zod';
import type { SageClient } from '../client.js';
import { formatError, formatResponse } from '../utils/formatters.js';

/**
 * Register all product-related tools
 */
export function registerProductTools(server: McpServer, client: SageClient): void {
  // ===========================================================================
  // PRODUCTS
  // ===========================================================================

  server.tool(
    'sage_list_products',
    `List products with pagination and search.

Args:
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of products.`,
    {
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listProducts({ search, page, itemsPerPage });
        return formatResponse(result, format, 'products');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_product',
    `Get a product by ID.

Args:
  - id: Product ID
  - format: Response format

Returns:
  The product with all details.`,
    {
      id: z.string().describe('Product ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const product = await client.getProduct(id);
        return formatResponse(product, format, 'product');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_product',
    `Create a new product.

Args:
  - description: Product description (required)
  - itemCode: Product/SKU code
  - notes: Additional notes
  - salesLedgerAccountId: Sales ledger account ID
  - purchaseLedgerAccountId: Purchase ledger account ID
  - salesTaxRateId: Sales tax rate ID
  - purchaseTaxRateId: Purchase tax rate ID
  - purchasePrice: Purchase/cost price
  - costPrice: Cost price
  - active: Whether product is active

Returns:
  The created product.`,
    {
      description: z.string().describe('Product description'),
      itemCode: z.string().optional().describe('Product/SKU code'),
      notes: z.string().optional().describe('Additional notes'),
      salesLedgerAccountId: z.string().optional().describe('Sales ledger account ID'),
      purchaseLedgerAccountId: z.string().optional().describe('Purchase ledger account ID'),
      salesTaxRateId: z.string().optional().describe('Sales tax rate ID'),
      purchaseTaxRateId: z.string().optional().describe('Purchase tax rate ID'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      active: z.boolean().optional().describe('Whether product is active'),
    },
    async (input) => {
      try {
        const product = await client.createProduct(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Product created', product }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_product',
    `Update an existing product.

Args:
  - id: Product ID to update (required)
  - description: New product description
  - itemCode: New product/SKU code
  - notes: New notes
  - purchasePrice: New purchase price
  - costPrice: New cost price
  - active: New active status

Returns:
  The updated product.`,
    {
      id: z.string().describe('Product ID'),
      description: z.string().optional().describe('Product description'),
      itemCode: z.string().optional().describe('Product/SKU code'),
      notes: z.string().optional().describe('Additional notes'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      active: z.boolean().optional().describe('Whether product is active'),
    },
    async ({ id, ...input }) => {
      try {
        const product = await client.updateProduct(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Product updated', product }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_product',
    `Delete a product.

Args:
  - id: Product ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Product ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteProduct(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Product ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // SERVICES
  // ===========================================================================

  server.tool(
    'sage_list_services',
    `List services with pagination and search.

Args:
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of services.`,
    {
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listServices({ search, page, itemsPerPage });
        return formatResponse(result, format, 'services');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_service',
    `Get a service by ID.

Args:
  - id: Service ID
  - format: Response format

Returns:
  The service with all details.`,
    {
      id: z.string().describe('Service ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const service = await client.getService(id);
        return formatResponse(service, format, 'service');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_service',
    `Create a new service.

Args:
  - description: Service description (required)
  - itemCode: Service code
  - notes: Additional notes
  - salesLedgerAccountId: Sales ledger account ID
  - purchaseLedgerAccountId: Purchase ledger account ID
  - salesTaxRateId: Sales tax rate ID
  - purchaseTaxRateId: Purchase tax rate ID
  - purchasePrice: Purchase/cost price
  - costPrice: Cost price
  - active: Whether service is active

Returns:
  The created service.`,
    {
      description: z.string().describe('Service description'),
      itemCode: z.string().optional().describe('Service code'),
      notes: z.string().optional().describe('Additional notes'),
      salesLedgerAccountId: z.string().optional().describe('Sales ledger account ID'),
      purchaseLedgerAccountId: z.string().optional().describe('Purchase ledger account ID'),
      salesTaxRateId: z.string().optional().describe('Sales tax rate ID'),
      purchaseTaxRateId: z.string().optional().describe('Purchase tax rate ID'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      active: z.boolean().optional().describe('Whether service is active'),
    },
    async (input) => {
      try {
        const service = await client.createService(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Service created', service }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_service',
    `Update an existing service.

Args:
  - id: Service ID to update (required)
  - description: New service description
  - itemCode: New service code
  - notes: New notes
  - purchasePrice: New purchase price
  - costPrice: New cost price
  - active: New active status

Returns:
  The updated service.`,
    {
      id: z.string().describe('Service ID'),
      description: z.string().optional().describe('Service description'),
      itemCode: z.string().optional().describe('Service code'),
      notes: z.string().optional().describe('Additional notes'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      active: z.boolean().optional().describe('Whether service is active'),
    },
    async ({ id, ...input }) => {
      try {
        const service = await client.updateService(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Service updated', service }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_service',
    `Delete a service.

Args:
  - id: Service ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Service ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteService(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Service ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // STOCK ITEMS
  // ===========================================================================

  server.tool(
    'sage_list_stock_items',
    `List stock items with pagination and search.

Args:
  - search: Search query
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of stock items with quantity information.`,
    {
      search: z.string().optional().describe('Search query'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ search, page, itemsPerPage, format }) => {
      try {
        const result = await client.listStockItems({ search, page, itemsPerPage });
        return formatResponse(result, format, 'stock_items');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_stock_item',
    `Get a stock item by ID.

Args:
  - id: Stock item ID
  - format: Response format

Returns:
  The stock item with all details including quantity in stock.`,
    {
      id: z.string().describe('Stock item ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const item = await client.getStockItem(id);
        return formatResponse(item, format, 'stock_item');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_stock_item',
    `Create a new stock item.

Args:
  - description: Stock item description (required)
  - itemCode: Item/SKU code
  - notes: Additional notes
  - salesLedgerAccountId: Sales ledger account ID
  - purchaseLedgerAccountId: Purchase ledger account ID
  - salesTaxRateId: Sales tax rate ID
  - purchaseTaxRateId: Purchase tax rate ID
  - purchasePrice: Purchase price
  - costPrice: Cost price
  - reorderLevel: Reorder level
  - reorderQuantity: Reorder quantity
  - location: Stock location
  - barcode: Barcode
  - weight: Item weight
  - active: Whether item is active

Returns:
  The created stock item.`,
    {
      description: z.string().describe('Stock item description'),
      itemCode: z.string().optional().describe('Item/SKU code'),
      notes: z.string().optional().describe('Additional notes'),
      salesLedgerAccountId: z.string().optional().describe('Sales ledger account ID'),
      purchaseLedgerAccountId: z.string().optional().describe('Purchase ledger account ID'),
      salesTaxRateId: z.string().optional().describe('Sales tax rate ID'),
      purchaseTaxRateId: z.string().optional().describe('Purchase tax rate ID'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      reorderLevel: z.number().optional().describe('Reorder level'),
      reorderQuantity: z.number().optional().describe('Reorder quantity'),
      location: z.string().optional().describe('Stock location'),
      barcode: z.string().optional().describe('Barcode'),
      weight: z.number().optional().describe('Item weight'),
      active: z.boolean().optional().describe('Whether item is active'),
    },
    async (input) => {
      try {
        const item = await client.createStockItem(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Stock item created', item }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_update_stock_item',
    `Update an existing stock item.

Args:
  - id: Stock item ID to update (required)
  - description: New description
  - itemCode: New item code
  - purchasePrice: New purchase price
  - costPrice: New cost price
  - reorderLevel: New reorder level
  - reorderQuantity: New reorder quantity
  - location: New location
  - barcode: New barcode
  - active: New active status

Returns:
  The updated stock item.`,
    {
      id: z.string().describe('Stock item ID'),
      description: z.string().optional().describe('Stock item description'),
      itemCode: z.string().optional().describe('Item/SKU code'),
      purchasePrice: z.number().optional().describe('Purchase price'),
      costPrice: z.number().optional().describe('Cost price'),
      reorderLevel: z.number().optional().describe('Reorder level'),
      reorderQuantity: z.number().optional().describe('Reorder quantity'),
      location: z.string().optional().describe('Stock location'),
      barcode: z.string().optional().describe('Barcode'),
      active: z.boolean().optional().describe('Whether item is active'),
    },
    async ({ id, ...input }) => {
      try {
        const item = await client.updateStockItem(id, input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Stock item updated', item }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_delete_stock_item',
    `Delete a stock item.

Args:
  - id: Stock item ID to delete

Returns:
  Confirmation of deletion.`,
    {
      id: z.string().describe('Stock item ID'),
    },
    async ({ id }) => {
      try {
        await client.deleteStockItem(id);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: `Stock item ${id} deleted` }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );

  // ===========================================================================
  // STOCK MOVEMENTS
  // ===========================================================================

  server.tool(
    'sage_list_stock_movements',
    `List stock movements with pagination and filtering.

Args:
  - stockItemId: Filter by stock item ID
  - page: Page number (default: 1)
  - itemsPerPage: Items per page (1-100, default: 20)
  - format: Response format

Returns:
  Paginated list of stock movements.`,
    {
      stockItemId: z.string().optional().describe('Filter by stock item ID'),
      page: z.number().int().min(1).default(1).describe('Page number'),
      itemsPerPage: z.number().int().min(1).max(100).default(20).describe('Items per page'),
      format: z.enum(['json', 'markdown']).default('json').describe('Response format'),
    },
    async ({ stockItemId, page, itemsPerPage, format }) => {
      try {
        const result = await client.listStockMovements({ stockItemId, page, itemsPerPage });
        return formatResponse(result, format, 'stock_movements');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_get_stock_movement',
    `Get a stock movement by ID.

Args:
  - id: Stock movement ID
  - format: Response format

Returns:
  The stock movement with all details.`,
    {
      id: z.string().describe('Stock movement ID'),
      format: z.enum(['json', 'markdown']).default('json'),
    },
    async ({ id, format }) => {
      try {
        const movement = await client.getStockMovement(id);
        return formatResponse(movement, format, 'stock_movement');
      } catch (error) {
        return formatError(error);
      }
    }
  );

  server.tool(
    'sage_create_stock_movement',
    `Create a new stock movement (adjustment).

Args:
  - stockItemId: Stock item ID (required)
  - date: Movement date in YYYY-MM-DD format (required)
  - quantity: Quantity to adjust (positive for increase, negative for decrease) (required)
  - movementTypeId: Movement type ID (required)
  - costPrice: Cost price per unit
  - reference: Movement reference
  - details: Additional details

Returns:
  The created stock movement.`,
    {
      stockItemId: z.string().describe('Stock item ID'),
      date: z.string().describe('Movement date (YYYY-MM-DD)'),
      quantity: z.number().describe('Quantity adjustment'),
      movementTypeId: z.string().describe('Movement type ID'),
      costPrice: z.number().optional().describe('Cost price per unit'),
      reference: z.string().optional().describe('Movement reference'),
      details: z.string().optional().describe('Additional details'),
    },
    async (input) => {
      try {
        const movement = await client.createStockMovement(input);
        return {
          content: [
            {
              type: 'text',
              text: JSON.stringify({ success: true, message: 'Stock movement created', movement }, null, 2),
            },
          ],
        };
      } catch (error) {
        return formatError(error);
      }
    }
  );
}
