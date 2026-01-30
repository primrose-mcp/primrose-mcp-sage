/**
 * Sage Business Cloud Accounting API Client
 *
 * Implements the Sage Accounting API v3.1
 * Reference: https://developer.sage.com/accounting/reference/
 *
 * MULTI-TENANT: This client receives credentials per-request via TenantCredentials,
 * allowing a single server to serve multiple tenants with different OAuth tokens.
 */

import type {
  Attachment,
  AttachmentContextType,
  AttachmentCreateInput,
  BankAccount,
  BankAccountCreateInput,
  BankAccountUpdateInput,
  BankDeposit,
  BankDepositCreateInput,
  BankOpeningBalance,
  BankOpeningBalanceCreateInput,
  BankTransfer,
  BankTransferCreateInput,
  Business,
  Contact,
  ContactAllocation,
  ContactAllocationCreateInput,
  ContactCreateInput,
  ContactOpeningBalance,
  ContactOpeningBalanceCreateInput,
  ContactPayment,
  ContactPaymentCreateInput,
  ContactType,
  ContactUpdateInput,
  Country,
  Journal,
  JournalCreateInput,
  LedgerAccount,
  LedgerAccountCreateInput,
  LedgerAccountOpeningBalance,
  LedgerAccountOpeningBalanceCreateInput,
  LedgerAccountUpdateInput,
  LedgerEntry,
  OtherPayment,
  OtherPaymentCreateInput,
  PaginatedResponse,
  PaginationParams,
  Product,
  ProductCreateInput,
  ProductUpdateInput,
  PurchaseCreditNote,
  PurchaseCreditNoteCreateInput,
  PurchaseInvoice,
  PurchaseInvoiceCreateInput,
  PurchaseQuickEntry,
  PurchaseQuickEntryCreateInput,
  SalesCreditNote,
  SalesCreditNoteCreateInput,
  SalesEstimate,
  SalesEstimateCreateInput,
  SalesInvoice,
  SalesInvoiceCreateInput,
  SalesQuickEntry,
  SalesQuickEntryCreateInput,
  SalesQuote,
  SalesQuoteCreateInput,
  SearchParams,
  Service,
  ServiceCreateInput,
  ServiceUpdateInput,
  StockItem,
  StockItemCreateInput,
  StockItemUpdateInput,
  StockMovement,
  StockMovementCreateInput,
  TaxRate,
  TaxRateCreateInput,
  TaxRateUpdateInput,
  TransactionType,
} from './types/entities.js';
import type { TenantCredentials } from './types/env.js';
import { AuthenticationError, RateLimitError, SageApiError } from './utils/errors.js';
import { buildPaginationQueryParams, createPaginatedResponse, hasMoreItems, getNextPage } from './utils/pagination.js';

// =============================================================================
// Configuration
// =============================================================================

/**
 * Base URL for the Sage Business Cloud Accounting API v3.1
 */
const API_BASE_URL = 'https://api.accounting.sage.com/v3.1';

// =============================================================================
// Sage API Response Types
// =============================================================================

interface SageListResponse<T> {
  $items: T[];
  $total?: number;
  $page?: number;
  $itemsPerPage?: number;
}

interface SageItemResponse<T> {
  $item?: T;
}

// =============================================================================
// Sage Client Interface
// =============================================================================

export interface SageClient {
  // Connection
  testConnection(): Promise<{ connected: boolean; message: string }>;

  // Business
  getBusiness(): Promise<Business>;

  // Contacts
  listContacts(params?: SearchParams): Promise<PaginatedResponse<Contact>>;
  getContact(id: string): Promise<Contact>;
  createContact(input: ContactCreateInput): Promise<Contact>;
  updateContact(id: string, input: ContactUpdateInput): Promise<Contact>;
  deleteContact(id: string): Promise<void>;

  // Contact Types
  listContactTypes(): Promise<ContactType[]>;

  // Sales Invoices
  listSalesInvoices(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesInvoice>>;
  getSalesInvoice(id: string): Promise<SalesInvoice>;
  createSalesInvoice(input: SalesInvoiceCreateInput): Promise<SalesInvoice>;
  deleteSalesInvoice(id: string): Promise<void>;

  // Sales Quotes
  listSalesQuotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesQuote>>;
  getSalesQuote(id: string): Promise<SalesQuote>;
  createSalesQuote(input: SalesQuoteCreateInput): Promise<SalesQuote>;
  deleteSalesQuote(id: string): Promise<void>;

  // Sales Estimates
  listSalesEstimates(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesEstimate>>;
  getSalesEstimate(id: string): Promise<SalesEstimate>;
  createSalesEstimate(input: SalesEstimateCreateInput): Promise<SalesEstimate>;
  deleteSalesEstimate(id: string): Promise<void>;

  // Sales Credit Notes
  listSalesCreditNotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesCreditNote>>;
  getSalesCreditNote(id: string): Promise<SalesCreditNote>;
  createSalesCreditNote(input: SalesCreditNoteCreateInput): Promise<SalesCreditNote>;
  deleteSalesCreditNote(id: string): Promise<void>;

  // Sales Quick Entries
  listSalesQuickEntries(params?: SearchParams & { contactId?: string }): Promise<PaginatedResponse<SalesQuickEntry>>;
  getSalesQuickEntry(id: string): Promise<SalesQuickEntry>;
  createSalesQuickEntry(input: SalesQuickEntryCreateInput): Promise<SalesQuickEntry>;
  deleteSalesQuickEntry(id: string): Promise<void>;

  // Purchase Invoices
  listPurchaseInvoices(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<PurchaseInvoice>>;
  getPurchaseInvoice(id: string): Promise<PurchaseInvoice>;
  createPurchaseInvoice(input: PurchaseInvoiceCreateInput): Promise<PurchaseInvoice>;
  deletePurchaseInvoice(id: string): Promise<void>;

  // Purchase Credit Notes
  listPurchaseCreditNotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<PurchaseCreditNote>>;
  getPurchaseCreditNote(id: string): Promise<PurchaseCreditNote>;
  createPurchaseCreditNote(input: PurchaseCreditNoteCreateInput): Promise<PurchaseCreditNote>;
  deletePurchaseCreditNote(id: string): Promise<void>;

  // Purchase Quick Entries
  listPurchaseQuickEntries(params?: SearchParams & { contactId?: string }): Promise<PaginatedResponse<PurchaseQuickEntry>>;
  getPurchaseQuickEntry(id: string): Promise<PurchaseQuickEntry>;
  createPurchaseQuickEntry(input: PurchaseQuickEntryCreateInput): Promise<PurchaseQuickEntry>;
  deletePurchaseQuickEntry(id: string): Promise<void>;

  // Bank Accounts
  listBankAccounts(params?: PaginationParams): Promise<PaginatedResponse<BankAccount>>;
  getBankAccount(id: string): Promise<BankAccount>;
  createBankAccount(input: BankAccountCreateInput): Promise<BankAccount>;
  updateBankAccount(id: string, input: BankAccountUpdateInput): Promise<BankAccount>;
  deleteBankAccount(id: string): Promise<void>;

  // Bank Deposits
  listBankDeposits(params?: PaginationParams & { bankAccountId?: string }): Promise<PaginatedResponse<BankDeposit>>;
  getBankDeposit(id: string): Promise<BankDeposit>;
  createBankDeposit(input: BankDepositCreateInput): Promise<BankDeposit>;
  deleteBankDeposit(id: string): Promise<void>;

  // Bank Transfers
  listBankTransfers(params?: PaginationParams): Promise<PaginatedResponse<BankTransfer>>;
  getBankTransfer(id: string): Promise<BankTransfer>;
  createBankTransfer(input: BankTransferCreateInput): Promise<BankTransfer>;
  deleteBankTransfer(id: string): Promise<void>;

  // Contact Payments
  listContactPayments(params?: SearchParams & { contactId?: string; bankAccountId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<ContactPayment>>;
  getContactPayment(id: string): Promise<ContactPayment>;
  createContactPayment(input: ContactPaymentCreateInput): Promise<ContactPayment>;
  deleteContactPayment(id: string): Promise<void>;

  // Other Payments
  listOtherPayments(params?: SearchParams & { bankAccountId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<OtherPayment>>;
  getOtherPayment(id: string): Promise<OtherPayment>;
  createOtherPayment(input: OtherPaymentCreateInput): Promise<OtherPayment>;
  deleteOtherPayment(id: string): Promise<void>;

  // Contact Allocations
  listContactAllocations(params?: PaginationParams & { contactId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<ContactAllocation>>;
  getContactAllocation(id: string): Promise<ContactAllocation>;
  createContactAllocation(input: ContactAllocationCreateInput): Promise<ContactAllocation>;
  deleteContactAllocation(id: string): Promise<void>;

  // Products
  listProducts(params?: SearchParams): Promise<PaginatedResponse<Product>>;
  getProduct(id: string): Promise<Product>;
  createProduct(input: ProductCreateInput): Promise<Product>;
  updateProduct(id: string, input: ProductUpdateInput): Promise<Product>;
  deleteProduct(id: string): Promise<void>;

  // Services
  listServices(params?: SearchParams): Promise<PaginatedResponse<Service>>;
  getService(id: string): Promise<Service>;
  createService(input: ServiceCreateInput): Promise<Service>;
  updateService(id: string, input: ServiceUpdateInput): Promise<Service>;
  deleteService(id: string): Promise<void>;

  // Stock Items
  listStockItems(params?: SearchParams): Promise<PaginatedResponse<StockItem>>;
  getStockItem(id: string): Promise<StockItem>;
  createStockItem(input: StockItemCreateInput): Promise<StockItem>;
  updateStockItem(id: string, input: StockItemUpdateInput): Promise<StockItem>;
  deleteStockItem(id: string): Promise<void>;

  // Stock Movements
  listStockMovements(params?: PaginationParams & { stockItemId?: string }): Promise<PaginatedResponse<StockMovement>>;
  getStockMovement(id: string): Promise<StockMovement>;
  createStockMovement(input: StockMovementCreateInput): Promise<StockMovement>;

  // Ledger Accounts
  listLedgerAccounts(params?: SearchParams & { visibleIn?: string }): Promise<PaginatedResponse<LedgerAccount>>;
  getLedgerAccount(id: string): Promise<LedgerAccount>;
  createLedgerAccount(input: LedgerAccountCreateInput): Promise<LedgerAccount>;
  updateLedgerAccount(id: string, input: LedgerAccountUpdateInput): Promise<LedgerAccount>;
  deleteLedgerAccount(id: string): Promise<void>;

  // Tax Rates
  listTaxRates(params?: PaginationParams): Promise<PaginatedResponse<TaxRate>>;
  getTaxRate(id: string): Promise<TaxRate>;
  createTaxRate(input: TaxRateCreateInput): Promise<TaxRate>;
  updateTaxRate(id: string, input: TaxRateUpdateInput): Promise<TaxRate>;
  deleteTaxRate(id: string): Promise<void>;

  // Journals
  listJournals(params?: PaginationParams): Promise<PaginatedResponse<Journal>>;
  getJournal(id: string): Promise<Journal>;
  createJournal(input: JournalCreateInput): Promise<Journal>;
  deleteJournal(id: string): Promise<void>;

  // Ledger Entries
  listLedgerEntries(params?: PaginationParams & { ledgerAccountId?: string; fromDate?: string; toDate?: string }): Promise<PaginatedResponse<LedgerEntry>>;

  // Countries
  listCountries(): Promise<Country[]>;

  // Transaction Types
  listTransactionTypes(): Promise<TransactionType[]>;

  // Attachments
  listAttachments(params?: PaginationParams & { attachmentContextId?: string; attachmentContextTypeId?: string }): Promise<PaginatedResponse<Attachment>>;
  getAttachment(id: string): Promise<Attachment>;
  createAttachment(input: AttachmentCreateInput): Promise<Attachment>;
  deleteAttachment(id: string): Promise<void>;

  // Attachment Context Types
  listAttachmentContextTypes(): Promise<AttachmentContextType[]>;

  // Opening Balances
  listContactOpeningBalances(params?: PaginationParams & { contactId?: string }): Promise<PaginatedResponse<ContactOpeningBalance>>;
  createContactOpeningBalance(input: ContactOpeningBalanceCreateInput): Promise<ContactOpeningBalance>;
  deleteContactOpeningBalance(id: string): Promise<void>;

  listBankOpeningBalances(params?: PaginationParams & { bankAccountId?: string }): Promise<PaginatedResponse<BankOpeningBalance>>;
  createBankOpeningBalance(input: BankOpeningBalanceCreateInput): Promise<BankOpeningBalance>;
  deleteBankOpeningBalance(id: string): Promise<void>;

  listLedgerAccountOpeningBalances(params?: PaginationParams & { ledgerAccountId?: string }): Promise<PaginatedResponse<LedgerAccountOpeningBalance>>;
  createLedgerAccountOpeningBalance(input: LedgerAccountOpeningBalanceCreateInput): Promise<LedgerAccountOpeningBalance>;
  deleteLedgerAccountOpeningBalance(id: string): Promise<void>;
}

// =============================================================================
// Sage Client Implementation
// =============================================================================

class SageClientImpl implements SageClient {
  private credentials: TenantCredentials;
  private baseUrl: string;

  constructor(credentials: TenantCredentials) {
    this.credentials = credentials;
    this.baseUrl = credentials.baseUrl || API_BASE_URL;
  }

  // ===========================================================================
  // HTTP Request Helper
  // ===========================================================================

  private getAuthHeaders(): Record<string, string> {
    if (!this.credentials.accessToken) {
      throw new AuthenticationError(
        'No access token provided. Include X-Sage-Access-Token header.'
      );
    }

    return {
      Authorization: `Bearer ${this.credentials.accessToken}`,
      'Content-Type': 'application/json',
    };
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseUrl}${endpoint}`;

    const response = await fetch(url, {
      ...options,
      headers: {
        ...this.getAuthHeaders(),
        ...(options.headers || {}),
      },
    });

    // Handle rate limiting
    if (response.status === 429) {
      const retryAfter = response.headers.get('Retry-After');
      throw new RateLimitError('Rate limit exceeded', retryAfter ? parseInt(retryAfter, 10) : 60);
    }

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      throw new AuthenticationError('Authentication failed. Check your Sage access token.');
    }

    // Handle not found
    if (response.status === 404) {
      throw new SageApiError('Resource not found', 404, 'NOT_FOUND');
    }

    // Handle other errors
    if (!response.ok) {
      const errorBody = await response.text();
      let message = `Sage API error: ${response.status}`;
      try {
        const errorJson = JSON.parse(errorBody);
        message = errorJson.$message || errorJson.message || errorJson.error || message;
      } catch {
        // Use default message
      }
      throw new SageApiError(message, response.status);
    }

    // Handle 204 No Content
    if (response.status === 204) {
      return undefined as T;
    }

    return response.json() as Promise<T>;
  }

  private buildQueryString(params?: PaginationParams & Record<string, unknown>): string {
    const queryParams = buildPaginationQueryParams(params);

    if (params) {
      // Add search parameter
      if ('search' in params && params.search) {
        queryParams.set('search', String(params.search));
      }

      // Add contact_id filter
      if ('contactId' in params && params.contactId) {
        queryParams.set('contact_id', String(params.contactId));
      }

      // Add bank_account_id filter
      if ('bankAccountId' in params && params.bankAccountId) {
        queryParams.set('bank_account_id', String(params.bankAccountId));
      }

      // Add transaction_type_id filter
      if ('transactionTypeId' in params && params.transactionTypeId) {
        queryParams.set('transaction_type_id', String(params.transactionTypeId));
      }

      // Add status filter
      if ('status' in params && params.status) {
        queryParams.set('status_id', String(params.status));
      }

      // Add ledger_account_id filter
      if ('ledgerAccountId' in params && params.ledgerAccountId) {
        queryParams.set('ledger_account_id', String(params.ledgerAccountId));
      }

      // Add stock_item_id filter
      if ('stockItemId' in params && params.stockItemId) {
        queryParams.set('stock_item_id', String(params.stockItemId));
      }

      // Add attachment_context_id filter
      if ('attachmentContextId' in params && params.attachmentContextId) {
        queryParams.set('attachment_context_id', String(params.attachmentContextId));
      }

      // Add attachment_context_type_id filter
      if ('attachmentContextTypeId' in params && params.attachmentContextTypeId) {
        queryParams.set('attachment_context_type_id', String(params.attachmentContextTypeId));
      }

      // Add visible_in filter for ledger accounts
      if ('visibleIn' in params && params.visibleIn) {
        queryParams.set('visible_in', String(params.visibleIn));
      }

      // Add from_date and to_date filters
      if ('fromDate' in params && params.fromDate) {
        queryParams.set('from_date', String(params.fromDate));
      }
      if ('toDate' in params && params.toDate) {
        queryParams.set('to_date', String(params.toDate));
      }
    }

    const queryString = queryParams.toString();
    return queryString ? `?${queryString}` : '';
  }

  private mapListResponse<T>(response: SageListResponse<T>, params?: PaginationParams): PaginatedResponse<T> {
    const items = response.$items || [];
    const total = response.$total;
    const page = response.$page || params?.page || 1;
    const itemsPerPage = response.$itemsPerPage || params?.itemsPerPage || params?.limit || 20;

    return createPaginatedResponse(items, {
      total,
      hasMore: total ? hasMoreItems(page, itemsPerPage, total) : items.length === itemsPerPage,
      nextPage: total ? getNextPage(page, itemsPerPage, total) : (items.length === itemsPerPage ? page + 1 : undefined),
    });
  }

  // ===========================================================================
  // Connection
  // ===========================================================================

  async testConnection(): Promise<{ connected: boolean; message: string }> {
    try {
      const business = await this.getBusiness();
      return { connected: true, message: `Connected to ${business.name || 'Sage Business Cloud Accounting'}` };
    } catch (error) {
      return {
        connected: false,
        message: error instanceof Error ? error.message : 'Connection failed',
      };
    }
  }

  // ===========================================================================
  // Business
  // ===========================================================================

  async getBusiness(): Promise<Business> {
    const response = await this.request<SageItemResponse<Business>>('/business');
    if (!response.$item) {
      throw new SageApiError('No business data returned');
    }
    return response.$item;
  }

  // ===========================================================================
  // Contacts
  // ===========================================================================

  async listContacts(params?: SearchParams): Promise<PaginatedResponse<Contact>> {
    const response = await this.request<SageListResponse<Contact>>(`/contacts${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getContact(id: string): Promise<Contact> {
    const response = await this.request<SageItemResponse<Contact>>(`/contacts/${id}`);
    if (!response.$item) {
      throw new SageApiError('Contact not found', 404);
    }
    return response.$item;
  }

  async createContact(input: ContactCreateInput): Promise<Contact> {
    const response = await this.request<SageItemResponse<Contact>>('/contacts', {
      method: 'POST',
      body: JSON.stringify({ contact: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create contact');
    }
    return response.$item;
  }

  async updateContact(id: string, input: ContactUpdateInput): Promise<Contact> {
    const response = await this.request<SageItemResponse<Contact>>(`/contacts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ contact: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update contact');
    }
    return response.$item;
  }

  async deleteContact(id: string): Promise<void> {
    await this.request<void>(`/contacts/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Contact Types
  // ===========================================================================

  async listContactTypes(): Promise<ContactType[]> {
    const response = await this.request<SageListResponse<ContactType>>('/contact_types');
    return response.$items || [];
  }

  // ===========================================================================
  // Sales Invoices
  // ===========================================================================

  async listSalesInvoices(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesInvoice>> {
    const response = await this.request<SageListResponse<SalesInvoice>>(`/sales_invoices${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getSalesInvoice(id: string): Promise<SalesInvoice> {
    const response = await this.request<SageItemResponse<SalesInvoice>>(`/sales_invoices/${id}`);
    if (!response.$item) {
      throw new SageApiError('Sales invoice not found', 404);
    }
    return response.$item;
  }

  async createSalesInvoice(input: SalesInvoiceCreateInput): Promise<SalesInvoice> {
    const response = await this.request<SageItemResponse<SalesInvoice>>('/sales_invoices', {
      method: 'POST',
      body: JSON.stringify({ sales_invoice: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create sales invoice');
    }
    return response.$item;
  }

  async deleteSalesInvoice(id: string): Promise<void> {
    await this.request<void>(`/sales_invoices/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Sales Quotes
  // ===========================================================================

  async listSalesQuotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesQuote>> {
    const response = await this.request<SageListResponse<SalesQuote>>(`/sales_quotes${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getSalesQuote(id: string): Promise<SalesQuote> {
    const response = await this.request<SageItemResponse<SalesQuote>>(`/sales_quotes/${id}`);
    if (!response.$item) {
      throw new SageApiError('Sales quote not found', 404);
    }
    return response.$item;
  }

  async createSalesQuote(input: SalesQuoteCreateInput): Promise<SalesQuote> {
    const response = await this.request<SageItemResponse<SalesQuote>>('/sales_quotes', {
      method: 'POST',
      body: JSON.stringify({ sales_quote: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create sales quote');
    }
    return response.$item;
  }

  async deleteSalesQuote(id: string): Promise<void> {
    await this.request<void>(`/sales_quotes/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Sales Estimates
  // ===========================================================================

  async listSalesEstimates(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesEstimate>> {
    const response = await this.request<SageListResponse<SalesEstimate>>(`/sales_estimates${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getSalesEstimate(id: string): Promise<SalesEstimate> {
    const response = await this.request<SageItemResponse<SalesEstimate>>(`/sales_estimates/${id}`);
    if (!response.$item) {
      throw new SageApiError('Sales estimate not found', 404);
    }
    return response.$item;
  }

  async createSalesEstimate(input: SalesEstimateCreateInput): Promise<SalesEstimate> {
    const response = await this.request<SageItemResponse<SalesEstimate>>('/sales_estimates', {
      method: 'POST',
      body: JSON.stringify({ sales_estimate: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create sales estimate');
    }
    return response.$item;
  }

  async deleteSalesEstimate(id: string): Promise<void> {
    await this.request<void>(`/sales_estimates/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Sales Credit Notes
  // ===========================================================================

  async listSalesCreditNotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<SalesCreditNote>> {
    const response = await this.request<SageListResponse<SalesCreditNote>>(`/sales_credit_notes${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getSalesCreditNote(id: string): Promise<SalesCreditNote> {
    const response = await this.request<SageItemResponse<SalesCreditNote>>(`/sales_credit_notes/${id}`);
    if (!response.$item) {
      throw new SageApiError('Sales credit note not found', 404);
    }
    return response.$item;
  }

  async createSalesCreditNote(input: SalesCreditNoteCreateInput): Promise<SalesCreditNote> {
    const response = await this.request<SageItemResponse<SalesCreditNote>>('/sales_credit_notes', {
      method: 'POST',
      body: JSON.stringify({ sales_credit_note: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create sales credit note');
    }
    return response.$item;
  }

  async deleteSalesCreditNote(id: string): Promise<void> {
    await this.request<void>(`/sales_credit_notes/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Sales Quick Entries
  // ===========================================================================

  async listSalesQuickEntries(params?: SearchParams & { contactId?: string }): Promise<PaginatedResponse<SalesQuickEntry>> {
    const response = await this.request<SageListResponse<SalesQuickEntry>>(`/sales_quick_entries${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getSalesQuickEntry(id: string): Promise<SalesQuickEntry> {
    const response = await this.request<SageItemResponse<SalesQuickEntry>>(`/sales_quick_entries/${id}`);
    if (!response.$item) {
      throw new SageApiError('Sales quick entry not found', 404);
    }
    return response.$item;
  }

  async createSalesQuickEntry(input: SalesQuickEntryCreateInput): Promise<SalesQuickEntry> {
    const response = await this.request<SageItemResponse<SalesQuickEntry>>('/sales_quick_entries', {
      method: 'POST',
      body: JSON.stringify({ sales_quick_entry: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create sales quick entry');
    }
    return response.$item;
  }

  async deleteSalesQuickEntry(id: string): Promise<void> {
    await this.request<void>(`/sales_quick_entries/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Purchase Invoices
  // ===========================================================================

  async listPurchaseInvoices(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<PurchaseInvoice>> {
    const response = await this.request<SageListResponse<PurchaseInvoice>>(`/purchase_invoices${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getPurchaseInvoice(id: string): Promise<PurchaseInvoice> {
    const response = await this.request<SageItemResponse<PurchaseInvoice>>(`/purchase_invoices/${id}`);
    if (!response.$item) {
      throw new SageApiError('Purchase invoice not found', 404);
    }
    return response.$item;
  }

  async createPurchaseInvoice(input: PurchaseInvoiceCreateInput): Promise<PurchaseInvoice> {
    const response = await this.request<SageItemResponse<PurchaseInvoice>>('/purchase_invoices', {
      method: 'POST',
      body: JSON.stringify({ purchase_invoice: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create purchase invoice');
    }
    return response.$item;
  }

  async deletePurchaseInvoice(id: string): Promise<void> {
    await this.request<void>(`/purchase_invoices/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Purchase Credit Notes
  // ===========================================================================

  async listPurchaseCreditNotes(params?: SearchParams & { contactId?: string; status?: string }): Promise<PaginatedResponse<PurchaseCreditNote>> {
    const response = await this.request<SageListResponse<PurchaseCreditNote>>(`/purchase_credit_notes${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getPurchaseCreditNote(id: string): Promise<PurchaseCreditNote> {
    const response = await this.request<SageItemResponse<PurchaseCreditNote>>(`/purchase_credit_notes/${id}`);
    if (!response.$item) {
      throw new SageApiError('Purchase credit note not found', 404);
    }
    return response.$item;
  }

  async createPurchaseCreditNote(input: PurchaseCreditNoteCreateInput): Promise<PurchaseCreditNote> {
    const response = await this.request<SageItemResponse<PurchaseCreditNote>>('/purchase_credit_notes', {
      method: 'POST',
      body: JSON.stringify({ purchase_credit_note: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create purchase credit note');
    }
    return response.$item;
  }

  async deletePurchaseCreditNote(id: string): Promise<void> {
    await this.request<void>(`/purchase_credit_notes/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Purchase Quick Entries
  // ===========================================================================

  async listPurchaseQuickEntries(params?: SearchParams & { contactId?: string }): Promise<PaginatedResponse<PurchaseQuickEntry>> {
    const response = await this.request<SageListResponse<PurchaseQuickEntry>>(`/purchase_quick_entries${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getPurchaseQuickEntry(id: string): Promise<PurchaseQuickEntry> {
    const response = await this.request<SageItemResponse<PurchaseQuickEntry>>(`/purchase_quick_entries/${id}`);
    if (!response.$item) {
      throw new SageApiError('Purchase quick entry not found', 404);
    }
    return response.$item;
  }

  async createPurchaseQuickEntry(input: PurchaseQuickEntryCreateInput): Promise<PurchaseQuickEntry> {
    const response = await this.request<SageItemResponse<PurchaseQuickEntry>>('/purchase_quick_entries', {
      method: 'POST',
      body: JSON.stringify({ purchase_quick_entry: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create purchase quick entry');
    }
    return response.$item;
  }

  async deletePurchaseQuickEntry(id: string): Promise<void> {
    await this.request<void>(`/purchase_quick_entries/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Bank Accounts
  // ===========================================================================

  async listBankAccounts(params?: PaginationParams): Promise<PaginatedResponse<BankAccount>> {
    const response = await this.request<SageListResponse<BankAccount>>(`/bank_accounts${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getBankAccount(id: string): Promise<BankAccount> {
    const response = await this.request<SageItemResponse<BankAccount>>(`/bank_accounts/${id}`);
    if (!response.$item) {
      throw new SageApiError('Bank account not found', 404);
    }
    return response.$item;
  }

  async createBankAccount(input: BankAccountCreateInput): Promise<BankAccount> {
    const response = await this.request<SageItemResponse<BankAccount>>('/bank_accounts', {
      method: 'POST',
      body: JSON.stringify({ bank_account: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create bank account');
    }
    return response.$item;
  }

  async updateBankAccount(id: string, input: BankAccountUpdateInput): Promise<BankAccount> {
    const response = await this.request<SageItemResponse<BankAccount>>(`/bank_accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ bank_account: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update bank account');
    }
    return response.$item;
  }

  async deleteBankAccount(id: string): Promise<void> {
    await this.request<void>(`/bank_accounts/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Bank Deposits
  // ===========================================================================

  async listBankDeposits(params?: PaginationParams & { bankAccountId?: string }): Promise<PaginatedResponse<BankDeposit>> {
    const response = await this.request<SageListResponse<BankDeposit>>(`/bank_deposits${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getBankDeposit(id: string): Promise<BankDeposit> {
    const response = await this.request<SageItemResponse<BankDeposit>>(`/bank_deposits/${id}`);
    if (!response.$item) {
      throw new SageApiError('Bank deposit not found', 404);
    }
    return response.$item;
  }

  async createBankDeposit(input: BankDepositCreateInput): Promise<BankDeposit> {
    const response = await this.request<SageItemResponse<BankDeposit>>('/bank_deposits', {
      method: 'POST',
      body: JSON.stringify({ bank_deposit: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create bank deposit');
    }
    return response.$item;
  }

  async deleteBankDeposit(id: string): Promise<void> {
    await this.request<void>(`/bank_deposits/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Bank Transfers
  // ===========================================================================

  async listBankTransfers(params?: PaginationParams): Promise<PaginatedResponse<BankTransfer>> {
    const response = await this.request<SageListResponse<BankTransfer>>(`/bank_transfers${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getBankTransfer(id: string): Promise<BankTransfer> {
    const response = await this.request<SageItemResponse<BankTransfer>>(`/bank_transfers/${id}`);
    if (!response.$item) {
      throw new SageApiError('Bank transfer not found', 404);
    }
    return response.$item;
  }

  async createBankTransfer(input: BankTransferCreateInput): Promise<BankTransfer> {
    const response = await this.request<SageItemResponse<BankTransfer>>('/bank_transfers', {
      method: 'POST',
      body: JSON.stringify({ bank_transfer: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create bank transfer');
    }
    return response.$item;
  }

  async deleteBankTransfer(id: string): Promise<void> {
    await this.request<void>(`/bank_transfers/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Contact Payments
  // ===========================================================================

  async listContactPayments(params?: SearchParams & { contactId?: string; bankAccountId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<ContactPayment>> {
    const response = await this.request<SageListResponse<ContactPayment>>(`/contact_payments${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getContactPayment(id: string): Promise<ContactPayment> {
    const response = await this.request<SageItemResponse<ContactPayment>>(`/contact_payments/${id}`);
    if (!response.$item) {
      throw new SageApiError('Contact payment not found', 404);
    }
    return response.$item;
  }

  async createContactPayment(input: ContactPaymentCreateInput): Promise<ContactPayment> {
    const response = await this.request<SageItemResponse<ContactPayment>>('/contact_payments', {
      method: 'POST',
      body: JSON.stringify({ contact_payment: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create contact payment');
    }
    return response.$item;
  }

  async deleteContactPayment(id: string): Promise<void> {
    await this.request<void>(`/contact_payments/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Other Payments
  // ===========================================================================

  async listOtherPayments(params?: SearchParams & { bankAccountId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<OtherPayment>> {
    const response = await this.request<SageListResponse<OtherPayment>>(`/other_payments${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getOtherPayment(id: string): Promise<OtherPayment> {
    const response = await this.request<SageItemResponse<OtherPayment>>(`/other_payments/${id}`);
    if (!response.$item) {
      throw new SageApiError('Other payment not found', 404);
    }
    return response.$item;
  }

  async createOtherPayment(input: OtherPaymentCreateInput): Promise<OtherPayment> {
    const response = await this.request<SageItemResponse<OtherPayment>>('/other_payments', {
      method: 'POST',
      body: JSON.stringify({ other_payment: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create other payment');
    }
    return response.$item;
  }

  async deleteOtherPayment(id: string): Promise<void> {
    await this.request<void>(`/other_payments/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Contact Allocations
  // ===========================================================================

  async listContactAllocations(params?: PaginationParams & { contactId?: string; transactionTypeId?: string }): Promise<PaginatedResponse<ContactAllocation>> {
    const response = await this.request<SageListResponse<ContactAllocation>>(`/contact_allocations${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getContactAllocation(id: string): Promise<ContactAllocation> {
    const response = await this.request<SageItemResponse<ContactAllocation>>(`/contact_allocations/${id}`);
    if (!response.$item) {
      throw new SageApiError('Contact allocation not found', 404);
    }
    return response.$item;
  }

  async createContactAllocation(input: ContactAllocationCreateInput): Promise<ContactAllocation> {
    const response = await this.request<SageItemResponse<ContactAllocation>>('/contact_allocations', {
      method: 'POST',
      body: JSON.stringify({ contact_allocation: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create contact allocation');
    }
    return response.$item;
  }

  async deleteContactAllocation(id: string): Promise<void> {
    await this.request<void>(`/contact_allocations/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Products
  // ===========================================================================

  async listProducts(params?: SearchParams): Promise<PaginatedResponse<Product>> {
    const response = await this.request<SageListResponse<Product>>(`/products${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getProduct(id: string): Promise<Product> {
    const response = await this.request<SageItemResponse<Product>>(`/products/${id}`);
    if (!response.$item) {
      throw new SageApiError('Product not found', 404);
    }
    return response.$item;
  }

  async createProduct(input: ProductCreateInput): Promise<Product> {
    const response = await this.request<SageItemResponse<Product>>('/products', {
      method: 'POST',
      body: JSON.stringify({ product: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create product');
    }
    return response.$item;
  }

  async updateProduct(id: string, input: ProductUpdateInput): Promise<Product> {
    const response = await this.request<SageItemResponse<Product>>(`/products/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ product: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update product');
    }
    return response.$item;
  }

  async deleteProduct(id: string): Promise<void> {
    await this.request<void>(`/products/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Services
  // ===========================================================================

  async listServices(params?: SearchParams): Promise<PaginatedResponse<Service>> {
    const response = await this.request<SageListResponse<Service>>(`/services${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getService(id: string): Promise<Service> {
    const response = await this.request<SageItemResponse<Service>>(`/services/${id}`);
    if (!response.$item) {
      throw new SageApiError('Service not found', 404);
    }
    return response.$item;
  }

  async createService(input: ServiceCreateInput): Promise<Service> {
    const response = await this.request<SageItemResponse<Service>>('/services', {
      method: 'POST',
      body: JSON.stringify({ service: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create service');
    }
    return response.$item;
  }

  async updateService(id: string, input: ServiceUpdateInput): Promise<Service> {
    const response = await this.request<SageItemResponse<Service>>(`/services/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ service: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update service');
    }
    return response.$item;
  }

  async deleteService(id: string): Promise<void> {
    await this.request<void>(`/services/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Stock Items
  // ===========================================================================

  async listStockItems(params?: SearchParams): Promise<PaginatedResponse<StockItem>> {
    const response = await this.request<SageListResponse<StockItem>>(`/stock_items${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getStockItem(id: string): Promise<StockItem> {
    const response = await this.request<SageItemResponse<StockItem>>(`/stock_items/${id}`);
    if (!response.$item) {
      throw new SageApiError('Stock item not found', 404);
    }
    return response.$item;
  }

  async createStockItem(input: StockItemCreateInput): Promise<StockItem> {
    const response = await this.request<SageItemResponse<StockItem>>('/stock_items', {
      method: 'POST',
      body: JSON.stringify({ stock_item: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create stock item');
    }
    return response.$item;
  }

  async updateStockItem(id: string, input: StockItemUpdateInput): Promise<StockItem> {
    const response = await this.request<SageItemResponse<StockItem>>(`/stock_items/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ stock_item: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update stock item');
    }
    return response.$item;
  }

  async deleteStockItem(id: string): Promise<void> {
    await this.request<void>(`/stock_items/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Stock Movements
  // ===========================================================================

  async listStockMovements(params?: PaginationParams & { stockItemId?: string }): Promise<PaginatedResponse<StockMovement>> {
    const response = await this.request<SageListResponse<StockMovement>>(`/stock_movements${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getStockMovement(id: string): Promise<StockMovement> {
    const response = await this.request<SageItemResponse<StockMovement>>(`/stock_movements/${id}`);
    if (!response.$item) {
      throw new SageApiError('Stock movement not found', 404);
    }
    return response.$item;
  }

  async createStockMovement(input: StockMovementCreateInput): Promise<StockMovement> {
    const response = await this.request<SageItemResponse<StockMovement>>('/stock_movements', {
      method: 'POST',
      body: JSON.stringify({ stock_movement: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create stock movement');
    }
    return response.$item;
  }

  // ===========================================================================
  // Ledger Accounts
  // ===========================================================================

  async listLedgerAccounts(params?: SearchParams & { visibleIn?: string }): Promise<PaginatedResponse<LedgerAccount>> {
    const response = await this.request<SageListResponse<LedgerAccount>>(`/ledger_accounts${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getLedgerAccount(id: string): Promise<LedgerAccount> {
    const response = await this.request<SageItemResponse<LedgerAccount>>(`/ledger_accounts/${id}`);
    if (!response.$item) {
      throw new SageApiError('Ledger account not found', 404);
    }
    return response.$item;
  }

  async createLedgerAccount(input: LedgerAccountCreateInput): Promise<LedgerAccount> {
    const response = await this.request<SageItemResponse<LedgerAccount>>('/ledger_accounts', {
      method: 'POST',
      body: JSON.stringify({ ledger_account: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create ledger account');
    }
    return response.$item;
  }

  async updateLedgerAccount(id: string, input: LedgerAccountUpdateInput): Promise<LedgerAccount> {
    const response = await this.request<SageItemResponse<LedgerAccount>>(`/ledger_accounts/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ ledger_account: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update ledger account');
    }
    return response.$item;
  }

  async deleteLedgerAccount(id: string): Promise<void> {
    await this.request<void>(`/ledger_accounts/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Tax Rates
  // ===========================================================================

  async listTaxRates(params?: PaginationParams): Promise<PaginatedResponse<TaxRate>> {
    const response = await this.request<SageListResponse<TaxRate>>(`/tax_rates${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getTaxRate(id: string): Promise<TaxRate> {
    const response = await this.request<SageItemResponse<TaxRate>>(`/tax_rates/${id}`);
    if (!response.$item) {
      throw new SageApiError('Tax rate not found', 404);
    }
    return response.$item;
  }

  async createTaxRate(input: TaxRateCreateInput): Promise<TaxRate> {
    const response = await this.request<SageItemResponse<TaxRate>>('/tax_rates', {
      method: 'POST',
      body: JSON.stringify({ tax_rate: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create tax rate');
    }
    return response.$item;
  }

  async updateTaxRate(id: string, input: TaxRateUpdateInput): Promise<TaxRate> {
    const response = await this.request<SageItemResponse<TaxRate>>(`/tax_rates/${id}`, {
      method: 'PUT',
      body: JSON.stringify({ tax_rate: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to update tax rate');
    }
    return response.$item;
  }

  async deleteTaxRate(id: string): Promise<void> {
    await this.request<void>(`/tax_rates/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Journals
  // ===========================================================================

  async listJournals(params?: PaginationParams): Promise<PaginatedResponse<Journal>> {
    const response = await this.request<SageListResponse<Journal>>(`/journals${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getJournal(id: string): Promise<Journal> {
    const response = await this.request<SageItemResponse<Journal>>(`/journals/${id}`);
    if (!response.$item) {
      throw new SageApiError('Journal not found', 404);
    }
    return response.$item;
  }

  async createJournal(input: JournalCreateInput): Promise<Journal> {
    const response = await this.request<SageItemResponse<Journal>>('/journals', {
      method: 'POST',
      body: JSON.stringify({ journal: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create journal');
    }
    return response.$item;
  }

  async deleteJournal(id: string): Promise<void> {
    await this.request<void>(`/journals/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Ledger Entries
  // ===========================================================================

  async listLedgerEntries(params?: PaginationParams & { ledgerAccountId?: string; fromDate?: string; toDate?: string }): Promise<PaginatedResponse<LedgerEntry>> {
    const response = await this.request<SageListResponse<LedgerEntry>>(`/ledger_entries${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  // ===========================================================================
  // Countries
  // ===========================================================================

  async listCountries(): Promise<Country[]> {
    const response = await this.request<SageListResponse<Country>>('/countries');
    return response.$items || [];
  }

  // ===========================================================================
  // Transaction Types
  // ===========================================================================

  async listTransactionTypes(): Promise<TransactionType[]> {
    const response = await this.request<SageListResponse<TransactionType>>('/transaction_types');
    return response.$items || [];
  }

  // ===========================================================================
  // Attachments
  // ===========================================================================

  async listAttachments(params?: PaginationParams & { attachmentContextId?: string; attachmentContextTypeId?: string }): Promise<PaginatedResponse<Attachment>> {
    const response = await this.request<SageListResponse<Attachment>>(`/attachments${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async getAttachment(id: string): Promise<Attachment> {
    const response = await this.request<SageItemResponse<Attachment>>(`/attachments/${id}`);
    if (!response.$item) {
      throw new SageApiError('Attachment not found', 404);
    }
    return response.$item;
  }

  async createAttachment(input: AttachmentCreateInput): Promise<Attachment> {
    const response = await this.request<SageItemResponse<Attachment>>('/attachments', {
      method: 'POST',
      body: JSON.stringify({ attachment: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create attachment');
    }
    return response.$item;
  }

  async deleteAttachment(id: string): Promise<void> {
    await this.request<void>(`/attachments/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Attachment Context Types
  // ===========================================================================

  async listAttachmentContextTypes(): Promise<AttachmentContextType[]> {
    const response = await this.request<SageListResponse<AttachmentContextType>>('/attachment_context_types');
    return response.$items || [];
  }

  // ===========================================================================
  // Opening Balances
  // ===========================================================================

  async listContactOpeningBalances(params?: PaginationParams & { contactId?: string }): Promise<PaginatedResponse<ContactOpeningBalance>> {
    const response = await this.request<SageListResponse<ContactOpeningBalance>>(`/contact_opening_balances${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async createContactOpeningBalance(input: ContactOpeningBalanceCreateInput): Promise<ContactOpeningBalance> {
    const response = await this.request<SageItemResponse<ContactOpeningBalance>>('/contact_opening_balances', {
      method: 'POST',
      body: JSON.stringify({ contact_opening_balance: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create contact opening balance');
    }
    return response.$item;
  }

  async deleteContactOpeningBalance(id: string): Promise<void> {
    await this.request<void>(`/contact_opening_balances/${id}`, { method: 'DELETE' });
  }

  async listBankOpeningBalances(params?: PaginationParams & { bankAccountId?: string }): Promise<PaginatedResponse<BankOpeningBalance>> {
    const response = await this.request<SageListResponse<BankOpeningBalance>>(`/bank_opening_balances${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async createBankOpeningBalance(input: BankOpeningBalanceCreateInput): Promise<BankOpeningBalance> {
    const response = await this.request<SageItemResponse<BankOpeningBalance>>('/bank_opening_balances', {
      method: 'POST',
      body: JSON.stringify({ bank_opening_balance: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create bank opening balance');
    }
    return response.$item;
  }

  async deleteBankOpeningBalance(id: string): Promise<void> {
    await this.request<void>(`/bank_opening_balances/${id}`, { method: 'DELETE' });
  }

  async listLedgerAccountOpeningBalances(params?: PaginationParams & { ledgerAccountId?: string }): Promise<PaginatedResponse<LedgerAccountOpeningBalance>> {
    const response = await this.request<SageListResponse<LedgerAccountOpeningBalance>>(`/ledger_account_opening_balances${this.buildQueryString(params)}`);
    return this.mapListResponse(response, params);
  }

  async createLedgerAccountOpeningBalance(input: LedgerAccountOpeningBalanceCreateInput): Promise<LedgerAccountOpeningBalance> {
    const response = await this.request<SageItemResponse<LedgerAccountOpeningBalance>>('/ledger_account_opening_balances', {
      method: 'POST',
      body: JSON.stringify({ ledger_account_opening_balance: this.toSnakeCase(input) }),
    });
    if (!response.$item) {
      throw new SageApiError('Failed to create ledger account opening balance');
    }
    return response.$item;
  }

  async deleteLedgerAccountOpeningBalance(id: string): Promise<void> {
    await this.request<void>(`/ledger_account_opening_balances/${id}`, { method: 'DELETE' });
  }

  // ===========================================================================
  // Helper: Convert camelCase to snake_case for API requests
  // ===========================================================================

  private toSnakeCase(obj: unknown): unknown {
    if (obj === null || obj === undefined) {
      return obj;
    }

    if (Array.isArray(obj)) {
      return obj.map((item) => this.toSnakeCase(item));
    }

    if (typeof obj === 'object') {
      const result: Record<string, unknown> = {};
      for (const [key, value] of Object.entries(obj as Record<string, unknown>)) {
        const snakeKey = key.replace(/([A-Z])/g, '_$1').toLowerCase();
        result[snakeKey] = this.toSnakeCase(value);
      }
      return result;
    }

    return obj;
  }
}

// =============================================================================
// Factory Function
// =============================================================================

/**
 * Create a Sage client instance with tenant-specific credentials.
 *
 * MULTI-TENANT: Each request provides its own credentials via headers,
 * allowing a single server deployment to serve multiple tenants.
 *
 * @param credentials - Tenant credentials parsed from request headers
 */
export function createSageClient(credentials: TenantCredentials): SageClient {
  return new SageClientImpl(credentials);
}
