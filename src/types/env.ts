/**
 * Environment Bindings for Sage MCP Server
 *
 * Type definitions for Cloudflare Worker environment variables and bindings.
 *
 * MULTI-TENANT ARCHITECTURE:
 * This server supports multiple tenants. Tenant-specific credentials (OAuth tokens)
 * are passed via request headers, NOT stored in wrangler secrets.
 * This allows a single server instance to serve multiple customers.
 *
 * Request Headers:
 * - X-Sage-Access-Token: OAuth access token for Sage API
 * - X-Sage-Base-URL: (Optional) Override the default Sage API base URL
 * - X-Sage-Client-ID: (Optional) OAuth client ID
 * - X-Sage-Client-Secret: (Optional) OAuth client secret
 */

// =============================================================================
// Tenant Credentials (parsed from request headers)
// =============================================================================

export interface TenantCredentials {
  /** OAuth Access Token (from X-Sage-Access-Token header) - REQUIRED */
  accessToken?: string;

  /** Override Sage API base URL (from X-Sage-Base-URL header) */
  baseUrl?: string;

  /** OAuth Client ID (from X-Sage-Client-ID header) */
  clientId?: string;

  /** OAuth Client Secret (from X-Sage-Client-Secret header) */
  clientSecret?: string;

  /** OAuth Refresh Token (from X-Sage-Refresh-Token header) */
  refreshToken?: string;
}

/**
 * Parse tenant credentials from request headers
 */
export function parseTenantCredentials(request: Request): TenantCredentials {
  const headers = request.headers;

  return {
    accessToken: headers.get('X-Sage-Access-Token') || undefined,
    baseUrl: headers.get('X-Sage-Base-URL') || undefined,
    clientId: headers.get('X-Sage-Client-ID') || undefined,
    clientSecret: headers.get('X-Sage-Client-Secret') || undefined,
    refreshToken: headers.get('X-Sage-Refresh-Token') || undefined,
  };
}

/**
 * Validate that required credentials are present
 */
export function validateCredentials(credentials: TenantCredentials): void {
  if (!credentials.accessToken) {
    throw new Error('Missing credentials. Provide X-Sage-Access-Token header.');
  }
}

// =============================================================================
// Environment Configuration (from wrangler.jsonc vars and bindings)
// =============================================================================

export interface Env {
  // ===========================================================================
  // Environment Variables (from wrangler.jsonc vars)
  // ===========================================================================

  /** Maximum character limit for responses */
  CHARACTER_LIMIT: string;

  /** Default page size for list operations */
  DEFAULT_PAGE_SIZE: string;

  /** Maximum page size allowed */
  MAX_PAGE_SIZE: string;

  // ===========================================================================
  // Bindings
  // ===========================================================================

  /** KV namespace for OAuth token storage */
  OAUTH_KV?: KVNamespace;

  /** Durable Object namespace for MCP sessions */
  MCP_SESSIONS?: DurableObjectNamespace;

  /** Cloudflare AI binding (optional) */
  AI?: Ai;
}

// ===========================================================================
// Helper Functions
// ===========================================================================

/**
 * Get a numeric environment value with a default
 */
export function getEnvNumber(env: Env, key: keyof Env, defaultValue: number): number {
  const value = env[key];
  if (typeof value === 'string') {
    const parsed = parseInt(value, 10);
    return Number.isNaN(parsed) ? defaultValue : parsed;
  }
  return defaultValue;
}

/**
 * Get the character limit from environment
 */
export function getCharacterLimit(env: Env): number {
  return getEnvNumber(env, 'CHARACTER_LIMIT', 50000);
}

/**
 * Get the default page size from environment
 */
export function getDefaultPageSize(env: Env): number {
  return getEnvNumber(env, 'DEFAULT_PAGE_SIZE', 20);
}

/**
 * Get the maximum page size from environment
 */
export function getMaxPageSize(env: Env): number {
  return getEnvNumber(env, 'MAX_PAGE_SIZE', 100);
}
