/**
 * Pagination Utilities for Sage MCP Server
 *
 * Helpers for handling pagination with the Sage API.
 * Sage uses page-based pagination with items_per_page and page parameters.
 */

import type { PaginatedResponse, PaginationParams } from '../types/entities.js';

/**
 * Default pagination settings
 */
export const PAGINATION_DEFAULTS = {
  itemsPerPage: 20,
  maxItemsPerPage: 100,
  page: 1,
} as const;

/**
 * Normalize pagination parameters for Sage API
 */
export function normalizePaginationParams(
  params?: PaginationParams,
  maxLimit = PAGINATION_DEFAULTS.maxItemsPerPage
): { itemsPerPage: number; page: number } {
  return {
    itemsPerPage: Math.min(
      params?.itemsPerPage || params?.limit || PAGINATION_DEFAULTS.itemsPerPage,
      maxLimit
    ),
    page: params?.page || PAGINATION_DEFAULTS.page,
  };
}

/**
 * Create an empty paginated response
 */
export function emptyPaginatedResponse<T>(): PaginatedResponse<T> {
  return {
    items: [],
    count: 0,
    hasMore: false,
  };
}

/**
 * Create a paginated response from an array
 */
export function createPaginatedResponse<T>(
  items: T[],
  options: {
    total?: number;
    hasMore?: boolean;
    nextPage?: number;
  } = {}
): PaginatedResponse<T> {
  return {
    items,
    count: items.length,
    total: options.total,
    hasMore: options.hasMore ?? false,
    nextPage: options.nextPage,
  };
}

/**
 * Calculate if there are more items based on page pagination
 */
export function hasMoreItems(page: number, itemsPerPage: number, total: number): boolean {
  return page * itemsPerPage < total;
}

/**
 * Calculate next page number for page-based pagination
 */
export function getNextPage(
  currentPage: number,
  itemsPerPage: number,
  total: number
): number | undefined {
  if (currentPage * itemsPerPage < total) {
    return currentPage + 1;
  }
  return undefined;
}

/**
 * Build query string for Sage API pagination
 */
export function buildPaginationQueryParams(params?: PaginationParams): URLSearchParams {
  const queryParams = new URLSearchParams();
  const normalized = normalizePaginationParams(params);

  queryParams.set('items_per_page', String(normalized.itemsPerPage));
  queryParams.set('page', String(normalized.page));

  if (params?.updatedOrCreatedSince) {
    queryParams.set('updated_or_created_since', params.updatedOrCreatedSince);
  }

  if (params?.deletedSince) {
    queryParams.set('deleted_since', params.deletedSince);
  }

  return queryParams;
}
