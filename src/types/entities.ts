/**
 * Sage Business Cloud Accounting Entity Types
 *
 * Standard data structures for Sage Accounting API entities.
 * Based on Sage API v3.1 documentation.
 */

// =============================================================================
// Pagination
// =============================================================================

export interface PaginationParams {
  /** Number of items to return */
  limit?: number;
  /** Page number for pagination */
  page?: number;
  /** Items per page */
  itemsPerPage?: number;
  /** Filter by updated or created since date */
  updatedOrCreatedSince?: string;
  /** Filter by deleted since date */
  deletedSince?: string;
  /** Index signature for extensibility */
  [key: string]: unknown;
}

export interface PaginatedResponse<T> {
  /** Array of items */
  items: T[];
  /** Number of items in this response */
  count: number;
  /** Total count (if available) */
  total?: number;
  /** Whether more items are available */
  hasMore: boolean;
  /** Next page number */
  nextPage?: number;
}

// =============================================================================
// Search
// =============================================================================

export interface SearchParams extends PaginationParams {
  /** Search query string */
  search?: string;
  /** Sort field */
  sortBy?: string;
  /** Sort direction */
  sortOrder?: 'asc' | 'desc';
}

// =============================================================================
// Contact (Customer/Vendor)
// =============================================================================

export interface Contact {
  id: string;
  displayedAs?: string;
  name: string;
  contactTypeIds?: string[];
  reference?: string;
  defaultSalesLedgerAccountId?: string;
  defaultSalesTaxRateId?: string;
  defaultPurchaseLedgerAccountId?: string;
  taxNumber?: string;
  notes?: string;
  locale?: string;
  mainAddress?: Address;
  deliveryAddress?: Address;
  mainContactPerson?: ContactPerson;
  bankAccountDetails?: BankAccountDetails;
  creditLimit?: number;
  creditDays?: number;
  creditTerms?: string;
  productSalesPriceTypeId?: string;
  sourceguid?: string;
  currency?: Currency;
  auxReference?: string;
  registeredNumber?: string;
  email?: string;
  telephone?: string;
  fax?: string;
  mobile?: string;
  website?: string;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface ContactCreateInput {
  name: string;
  contactTypeIds?: string[];
  reference?: string;
  defaultSalesLedgerAccountId?: string;
  defaultSalesTaxRateId?: string;
  defaultPurchaseLedgerAccountId?: string;
  taxNumber?: string;
  notes?: string;
  mainAddress?: Partial<Address>;
  deliveryAddress?: Partial<Address>;
  mainContactPerson?: Partial<ContactPerson>;
  bankAccountDetails?: Partial<BankAccountDetails>;
  creditLimit?: number;
  creditDays?: number;
  email?: string;
  telephone?: string;
  mobile?: string;
  website?: string;
}

export interface ContactUpdateInput extends Partial<ContactCreateInput> {}

export interface ContactPerson {
  id?: string;
  name?: string;
  jobTitle?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
  fax?: string;
  isMainContact?: boolean;
  addressId?: string;
  isPreferredContact?: boolean;
}

// =============================================================================
// Contact Types
// =============================================================================

export interface ContactType {
  id: string;
  displayedAs?: string;
  name?: string;
}

// =============================================================================
// Address
// =============================================================================

export interface Address {
  id?: string;
  displayedAs?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryId?: string;
  countryGroupId?: string;
  bankAccountId?: string;
  isMainAddress?: boolean;
}

// =============================================================================
// Bank Account Details (for Contacts)
// =============================================================================

export interface BankAccountDetails {
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  bic?: string;
  iban?: string;
}

// =============================================================================
// Currency
// =============================================================================

export interface Currency {
  id: string;
  displayedAs?: string;
  symbol?: string;
}

// =============================================================================
// Sales Invoice
// =============================================================================

export interface SalesInvoice {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  dueDate?: string;
  reference?: string;
  invoiceNumber?: string;
  status?: InvoiceStatus;
  mainAddress?: Address;
  deliveryAddress?: Address;
  invoiceLines?: SalesInvoiceLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  paidAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  termsAndConditions?: string;
  shippingNetAmount?: number;
  shippingTaxRateId?: string;
  shippingTaxAmount?: number;
  shippingTotalAmount?: number;
  totalQuantity?: number;
  totalDiscountAmount?: number;
  sentByEmail?: boolean;
  taxAnalysis?: TaxAnalysis[];
  payments?: PaymentOnAccount[];
  voidReason?: string;
  taxAddressRegionId?: string;
  baseCurrencyNetAmount?: number;
  baseCurrencyTaxAmount?: number;
  baseCurrencyTotalAmount?: number;
  baseCurrencyOutstandingAmount?: number;
  baseCurrencyPaidAmount?: number;
  baseCurrencyShippingNetAmount?: number;
  baseCurrencyShippingTaxAmount?: number;
  baseCurrencyShippingTotalAmount?: number;
  baseCurrencyTotalDiscountAmount?: number;
  statusId?: string;
  withholdingTaxRate?: number;
  withholdingTaxAmount?: number;
  baseCurrencyWithholdingTaxAmount?: number;
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface SalesInvoiceLine {
  id?: string;
  displayedAs?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  taxBreakdown?: TaxBreakdown[];
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
  baseCurrencyUnitPrice?: number;
  baseCurrencyNetAmount?: number;
  baseCurrencyTaxAmount?: number;
  baseCurrencyTotalAmount?: number;
  baseCurrencyDiscountAmount?: number;
  euGoodsServicesTypeId?: string;
  gstAmount?: number;
  pstAmount?: number;
  unitPriceIncludesTax?: boolean;
  isServiceType?: boolean;
}

export interface SalesInvoiceCreateInput {
  contactId: string;
  date: string;
  dueDate?: string;
  reference?: string;
  invoiceLines: SalesInvoiceLineInput[];
  mainAddress?: Partial<Address>;
  deliveryAddress?: Partial<Address>;
  notes?: string;
  termsAndConditions?: string;
  shippingNetAmount?: number;
  shippingTaxRateId?: string;
  currencyId?: string;
  exchangeRate?: number;
  taxAddressRegionId?: string;
}

export interface SalesInvoiceLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Sales Quote
// =============================================================================

export interface SalesQuote {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  expiryDate?: string;
  reference?: string;
  quoteNumber?: string;
  status?: QuoteStatus;
  mainAddress?: Address;
  deliveryAddress?: Address;
  quoteLines?: SalesQuoteLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  termsAndConditions?: string;
  sentByEmail?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesQuoteLine {
  id?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface SalesQuoteCreateInput {
  contactId: string;
  date: string;
  expiryDate?: string;
  reference?: string;
  quoteLines: SalesQuoteLineInput[];
  mainAddress?: Partial<Address>;
  deliveryAddress?: Partial<Address>;
  notes?: string;
  termsAndConditions?: string;
  currencyId?: string;
  exchangeRate?: number;
}

export interface SalesQuoteLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Sales Estimate
// =============================================================================

export interface SalesEstimate {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  expiryDate?: string;
  reference?: string;
  estimateNumber?: string;
  status?: EstimateStatus;
  mainAddress?: Address;
  deliveryAddress?: Address;
  estimateLines?: SalesEstimateLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  termsAndConditions?: string;
  sentByEmail?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesEstimateLine {
  id?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface SalesEstimateCreateInput {
  contactId: string;
  date: string;
  expiryDate?: string;
  reference?: string;
  estimateLines: SalesEstimateLineInput[];
  mainAddress?: Partial<Address>;
  deliveryAddress?: Partial<Address>;
  notes?: string;
  termsAndConditions?: string;
  currencyId?: string;
  exchangeRate?: number;
}

export interface SalesEstimateLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Sales Credit Note
// =============================================================================

export interface SalesCreditNote {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  creditNoteNumber?: string;
  status?: InvoiceStatus;
  mainAddress?: Address;
  deliveryAddress?: Address;
  creditNoteLines?: SalesCreditNoteLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  voidReason?: string;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  originalInvoiceId?: string;
  originalInvoiceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesCreditNoteLine {
  id?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface SalesCreditNoteCreateInput {
  contactId: string;
  date: string;
  reference?: string;
  creditNoteLines: SalesCreditNoteLineInput[];
  mainAddress?: Partial<Address>;
  deliveryAddress?: Partial<Address>;
  notes?: string;
  currencyId?: string;
  exchangeRate?: number;
  originalInvoiceId?: string;
}

export interface SalesCreditNoteLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Sales Quick Entry
// =============================================================================

export interface SalesQuickEntry {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  dueDate?: string;
  reference?: string;
  quickEntryType?: string;
  ledgerAccountId?: string;
  details?: string;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  paidAmount?: number;
  status?: InvoiceStatus;
  currency?: Currency;
  exchangeRate?: number;
  tradeOfAsset?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface SalesQuickEntryCreateInput {
  contactId: string;
  date: string;
  quickEntryTypeId: string;
  ledgerAccountId: string;
  netAmount: number;
  taxRateId?: string;
  reference?: string;
  details?: string;
  dueDate?: string;
  currencyId?: string;
  exchangeRate?: number;
  tradeOfAsset?: boolean;
}

// =============================================================================
// Purchase Invoice
// =============================================================================

export interface PurchaseInvoice {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  dueDate?: string;
  reference?: string;
  vendorReference?: string;
  invoiceNumber?: string;
  status?: InvoiceStatus;
  invoiceLines?: PurchaseInvoiceLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  paidAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  totalQuantity?: number;
  payments?: PaymentOnAccount[];
  createdAt?: string;
  updatedAt?: string;
  deletedAt?: string;
}

export interface PurchaseInvoiceLine {
  id?: string;
  displayedAs?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
  baseCurrencyUnitPrice?: number;
  baseCurrencyNetAmount?: number;
  baseCurrencyTaxAmount?: number;
  baseCurrencyTotalAmount?: number;
  baseCurrencyDiscountAmount?: number;
  isServiceType?: boolean;
}

export interface PurchaseInvoiceCreateInput {
  contactId: string;
  date: string;
  dueDate?: string;
  reference?: string;
  vendorReference?: string;
  invoiceLines: PurchaseInvoiceLineInput[];
  notes?: string;
  currencyId?: string;
  exchangeRate?: number;
}

export interface PurchaseInvoiceLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Purchase Credit Note
// =============================================================================

export interface PurchaseCreditNote {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  vendorReference?: string;
  creditNoteNumber?: string;
  status?: InvoiceStatus;
  creditNoteLines?: PurchaseCreditNoteLine[];
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  notes?: string;
  originalInvoiceId?: string;
  originalInvoiceNumber?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseCreditNoteLine {
  id?: string;
  description?: string;
  productId?: string;
  serviceId?: string;
  ledgerAccountId?: string;
  quantity?: number;
  unitPrice?: number;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  discountAmount?: number;
  discountPercentage?: number;
}

export interface PurchaseCreditNoteCreateInput {
  contactId: string;
  date: string;
  reference?: string;
  vendorReference?: string;
  creditNoteLines: PurchaseCreditNoteLineInput[];
  notes?: string;
  currencyId?: string;
  exchangeRate?: number;
  originalInvoiceId?: string;
}

export interface PurchaseCreditNoteLineInput {
  description: string;
  quantity: number;
  unitPrice: number;
  ledgerAccountId: string;
  taxRateId?: string;
  productId?: string;
  serviceId?: string;
  discountAmount?: number;
  discountPercentage?: number;
}

// =============================================================================
// Purchase Quick Entry
// =============================================================================

export interface PurchaseQuickEntry {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  date?: string;
  dueDate?: string;
  reference?: string;
  quickEntryType?: string;
  ledgerAccountId?: string;
  details?: string;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  outstandingAmount?: number;
  paidAmount?: number;
  status?: InvoiceStatus;
  currency?: Currency;
  exchangeRate?: number;
  tradeOfAsset?: boolean;
  createdAt?: string;
  updatedAt?: string;
}

export interface PurchaseQuickEntryCreateInput {
  contactId: string;
  date: string;
  quickEntryTypeId: string;
  ledgerAccountId: string;
  netAmount: number;
  taxRateId?: string;
  reference?: string;
  details?: string;
  dueDate?: string;
  currencyId?: string;
  exchangeRate?: number;
  tradeOfAsset?: boolean;
}

// =============================================================================
// Bank Account
// =============================================================================

export interface BankAccount {
  id: string;
  displayedAs?: string;
  accountName?: string;
  accountNumber?: string;
  sortCode?: string;
  bic?: string;
  iban?: string;
  nominalCode?: number;
  bankAccountTypeId?: string;
  bankAccountType?: { id: string; displayedAs?: string };
  balance?: number;
  mainAddress?: Address;
  mainContactPerson?: ContactPerson;
  ledgerAccountId?: string;
  defaultPaymentMethodId?: string;
  gifiCode?: number;
  isActive?: boolean;
  currencyId?: string;
  currency?: Currency;
  editable?: boolean;
  deletable?: boolean;
  journalCode?: JournalCode;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankAccountCreateInput {
  accountName: string;
  bankAccountTypeId: string;
  ledgerAccountId?: string;
  accountNumber?: string;
  sortCode?: string;
  bic?: string;
  iban?: string;
  nominalCode?: number;
  mainAddress?: Partial<Address>;
  mainContactPerson?: Partial<ContactPerson>;
  defaultPaymentMethodId?: string;
  gifiCode?: number;
  currencyId?: string;
}

export interface BankAccountUpdateInput extends Partial<BankAccountCreateInput> {}

// =============================================================================
// Bank Deposit
// =============================================================================

export interface BankDeposit {
  id: string;
  displayedAs?: string;
  bankAccountId?: string;
  date?: string;
  reference?: string;
  cashAmount?: number;
  chequeAmount?: number;
  totalAmount?: number;
  depositAccountEntries?: DepositAccountEntry[];
  createdAt?: string;
  updatedAt?: string;
}

export interface DepositAccountEntry {
  id?: string;
  chequeReference?: string;
  contactId?: string;
  paymentType?: string;
  amount?: number;
}

export interface BankDepositCreateInput {
  bankAccountId: string;
  date: string;
  reference?: string;
  cashAmount?: number;
  chequeAmount?: number;
  depositAccountEntries?: DepositAccountEntryInput[];
}

export interface DepositAccountEntryInput {
  chequeReference?: string;
  contactId?: string;
  paymentType: string;
  amount: number;
}

// =============================================================================
// Bank Transfer
// =============================================================================

export interface BankTransfer {
  id: string;
  displayedAs?: string;
  fromBankAccountId?: string;
  fromBankAccount?: { id: string; displayedAs?: string };
  toBankAccountId?: string;
  toBankAccount?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  amount?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankTransferCreateInput {
  fromBankAccountId: string;
  toBankAccountId: string;
  date: string;
  amount: number;
  reference?: string;
  description?: string;
}

// =============================================================================
// Contact Payment
// =============================================================================

export interface ContactPayment {
  id: string;
  displayedAs?: string;
  transactionTypeId?: string;
  transactionType?: { id: string; displayedAs?: string };
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  bankAccountId?: string;
  bankAccount?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  paymentMethodId?: string;
  paymentMethod?: { id: string; displayedAs?: string };
  allocatedArtefacts?: AllocatedArtefact[];
  paymentLines?: ContactPaymentLine[];
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactPaymentLine {
  id?: string;
  ledgerAccountId?: string;
  details?: string;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  taxRecoverable?: boolean;
  analysisTypeCategories?: AnalysisTypeCategory[];
}

export interface AllocatedArtefact {
  id?: string;
  artefactType?: string;
  artefactId?: string;
  amount?: number;
  discount?: number;
}

export interface AnalysisTypeCategory {
  id?: string;
  analysisTypeId?: string;
  code?: string;
}

export interface ContactPaymentCreateInput {
  transactionTypeId: string;
  contactId: string;
  bankAccountId: string;
  date: string;
  totalAmount: number;
  reference?: string;
  paymentMethodId?: string;
  currencyId?: string;
  exchangeRate?: number;
  allocatedArtefacts?: AllocatedArtefactInput[];
  paymentLines?: ContactPaymentLineInput[];
}

export interface AllocatedArtefactInput {
  artefactType: string;
  artefactId: string;
  amount: number;
  discount?: number;
}

export interface ContactPaymentLineInput {
  ledgerAccountId: string;
  netAmount: number;
  taxRateId?: string;
  details?: string;
}

// =============================================================================
// Other Payment
// =============================================================================

export interface OtherPayment {
  id: string;
  displayedAs?: string;
  transactionTypeId?: string;
  transactionType?: { id: string; displayedAs?: string };
  contactId?: string;
  contactName?: string;
  contact?: { id: string; displayedAs?: string };
  bankAccountId?: string;
  bankAccount?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
  currency?: Currency;
  exchangeRate?: number;
  paymentMethodId?: string;
  paymentMethod?: { id: string; displayedAs?: string };
  paymentLines?: OtherPaymentLine[];
  withholdingTaxRate?: number;
  withholdingTaxAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface OtherPaymentLine {
  id?: string;
  ledgerAccountId?: string;
  ledgerAccount?: { id: string; displayedAs?: string };
  details?: string;
  netAmount?: number;
  taxRateId?: string;
  taxAmount?: number;
  totalAmount?: number;
  taxRecoverable?: boolean;
  isServiceType?: boolean;
  tradeOfAsset?: boolean;
  gstAmount?: number;
  pstAmount?: number;
  analysisTypeCategories?: AnalysisTypeCategory[];
}

export interface OtherPaymentCreateInput {
  transactionTypeId: string;
  bankAccountId: string;
  date: string;
  paymentLines: OtherPaymentLineInput[];
  contactId?: string;
  reference?: string;
  paymentMethodId?: string;
  currencyId?: string;
  exchangeRate?: number;
  withholdingTaxRate?: number;
}

export interface OtherPaymentLineInput {
  ledgerAccountId: string;
  netAmount: number;
  taxRateId?: string;
  details?: string;
  tradeOfAsset?: boolean;
}

// =============================================================================
// Contact Allocation
// =============================================================================

export interface ContactAllocation {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contact?: { id: string; displayedAs?: string };
  transactionTypeId?: string;
  transactionType?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  allocatedArtefacts?: AllocatedArtefact[];
  links?: AllocationLink[];
  createdAt?: string;
  updatedAt?: string;
}

export interface AllocationLink {
  id?: string;
  transactionId?: string;
  transactionType?: string;
  amount?: number;
  discount?: number;
}

export interface ContactAllocationCreateInput {
  contactId: string;
  transactionTypeId: string;
  date: string;
  reference?: string;
  allocatedArtefacts: AllocatedArtefactInput[];
}

// =============================================================================
// Product
// =============================================================================

export interface Product {
  id: string;
  displayedAs?: string;
  description?: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  salesLedgerAccount?: { id: string; displayedAs?: string };
  purchaseLedgerAccountId?: string;
  purchaseLedgerAccount?: { id: string; displayedAs?: string };
  salesTaxRateId?: string;
  salesTaxRate?: { id: string; displayedAs?: string };
  purchaseTaxRateId?: string;
  purchaseTaxRate?: { id: string; displayedAs?: string };
  salesPrices?: ProductPrice[];
  purchasePrice?: number;
  costPrice?: number;
  active?: boolean;
  catalogItemTypeId?: string;
  sourceGuid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ProductPrice {
  id?: string;
  priceTypeId?: string;
  priceType?: { id: string; displayedAs?: string };
  priceIncludes_tax?: boolean;
  price?: number;
}

export interface ProductCreateInput {
  description: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  purchaseLedgerAccountId?: string;
  salesTaxRateId?: string;
  purchaseTaxRateId?: string;
  purchasePrice?: number;
  costPrice?: number;
  salesPrices?: ProductPriceInput[];
  active?: boolean;
}

export interface ProductPriceInput {
  priceTypeId?: string;
  priceIncludesTax?: boolean;
  price: number;
}

export interface ProductUpdateInput extends Partial<ProductCreateInput> {}

// =============================================================================
// Service
// =============================================================================

export interface Service {
  id: string;
  displayedAs?: string;
  description?: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  salesLedgerAccount?: { id: string; displayedAs?: string };
  purchaseLedgerAccountId?: string;
  purchaseLedgerAccount?: { id: string; displayedAs?: string };
  salesTaxRateId?: string;
  salesTaxRate?: { id: string; displayedAs?: string };
  purchaseTaxRateId?: string;
  purchaseTaxRate?: { id: string; displayedAs?: string };
  salesPrices?: ServicePrice[];
  purchasePrice?: number;
  costPrice?: number;
  active?: boolean;
  sourceGuid?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ServicePrice {
  id?: string;
  priceTypeId?: string;
  priceType?: { id: string; displayedAs?: string };
  priceIncludesTax?: boolean;
  price?: number;
}

export interface ServiceCreateInput {
  description: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  purchaseLedgerAccountId?: string;
  salesTaxRateId?: string;
  purchaseTaxRateId?: string;
  purchasePrice?: number;
  costPrice?: number;
  salesPrices?: ServicePriceInput[];
  active?: boolean;
}

export interface ServicePriceInput {
  priceTypeId?: string;
  priceIncludesTax?: boolean;
  price: number;
}

export interface ServiceUpdateInput extends Partial<ServiceCreateInput> {}

// =============================================================================
// Stock Item
// =============================================================================

export interface StockItem {
  id: string;
  displayedAs?: string;
  description?: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  purchaseLedgerAccountId?: string;
  salesTaxRateId?: string;
  purchaseTaxRateId?: string;
  salesPrices?: ProductPrice[];
  purchasePrice?: number;
  costPrice?: number;
  quantityInStock?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  barcode?: string;
  supplierPartNumber?: string;
  weight?: number;
  measurementUnitId?: string;
  active?: boolean;
  sourceGuid?: string;
  averageCostPrice?: number;
  lastCostPrice?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockItemCreateInput {
  description: string;
  itemCode?: string;
  notes?: string;
  salesLedgerAccountId?: string;
  purchaseLedgerAccountId?: string;
  salesTaxRateId?: string;
  purchaseTaxRateId?: string;
  salesPrices?: ProductPriceInput[];
  purchasePrice?: number;
  costPrice?: number;
  reorderLevel?: number;
  reorderQuantity?: number;
  location?: string;
  barcode?: string;
  supplierPartNumber?: string;
  weight?: number;
  measurementUnitId?: string;
  active?: boolean;
}

export interface StockItemUpdateInput extends Partial<StockItemCreateInput> {}

// =============================================================================
// Stock Movement
// =============================================================================

export interface StockMovement {
  id: string;
  displayedAs?: string;
  stockItemId?: string;
  stockItem?: { id: string; displayedAs?: string };
  movementNumber?: string;
  date?: string;
  reference?: string;
  details?: string;
  quantity?: number;
  costPrice?: number;
  movementTypeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface StockMovementCreateInput {
  stockItemId: string;
  date: string;
  quantity: number;
  costPrice?: number;
  movementTypeId: string;
  reference?: string;
  details?: string;
}

// =============================================================================
// Ledger Account
// =============================================================================

export interface LedgerAccount {
  id: string;
  displayedAs?: string;
  name?: string;
  ledgerAccountGroupId?: string;
  ledgerAccountGroup?: { id: string; displayedAs?: string };
  nominalCode?: number;
  ledgerAccountTypeId?: string;
  ledgerAccountType?: { id: string; displayedAs?: string };
  ledgerAccountClassificationId?: string;
  ledgerAccountClassification?: { id: string; displayedAs?: string };
  taxRateId?: string;
  taxRate?: { id: string; displayedAs?: string };
  fixedTaxRate?: boolean;
  visibleInExpenses?: boolean;
  visibleInBanking?: boolean;
  visibleInJournals?: boolean;
  visibleInOtherPayments?: boolean;
  visibleInOtherReceipts?: boolean;
  visibleInReporting?: boolean;
  visibleInSales?: boolean;
  visibleInPurchases?: boolean;
  isBankAccount?: boolean;
  isControlAccount?: boolean;
  includeInChart?: boolean;
  isRecoverable?: boolean;
  balance?: number;
  budgets?: Budget[];
  gifiCode?: number;
  controlName?: string;
  journalCode?: JournalCode;
  coreTypeId?: string;
  taxInstalment?: boolean;
  taxRecoverablePercentage?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface Budget {
  id?: string;
  financialYearId?: string;
  budgetType?: string;
  amounts?: BudgetAmount[];
}

export interface BudgetAmount {
  month?: number;
  amount?: number;
}

export interface JournalCode {
  id?: string;
  name?: string;
  code?: string;
  journalCodeTypeId?: string;
  reservedYn?: boolean;
}

export interface LedgerAccountCreateInput {
  name: string;
  ledgerAccountTypeId: string;
  nominalCode?: number;
  ledgerAccountGroupId?: string;
  ledgerAccountClassificationId?: string;
  taxRateId?: string;
  fixedTaxRate?: boolean;
  visibleInExpenses?: boolean;
  visibleInBanking?: boolean;
  visibleInJournals?: boolean;
  visibleInOtherPayments?: boolean;
  visibleInOtherReceipts?: boolean;
  visibleInReporting?: boolean;
  visibleInSales?: boolean;
  visibleInPurchases?: boolean;
  includeInChart?: boolean;
  isRecoverable?: boolean;
  gifiCode?: number;
  coreTypeId?: string;
  taxInstalment?: boolean;
  taxRecoverablePercentage?: number;
}

export interface LedgerAccountUpdateInput extends Partial<LedgerAccountCreateInput> {}

// =============================================================================
// Tax Rate
// =============================================================================

export interface TaxRate {
  id: string;
  displayedAs?: string;
  name?: string;
  agency?: string;
  percentage?: number;
  percentageDecimals?: number;
  isVisible?: boolean;
  isEditable?: boolean;
  isCombinedRate?: boolean;
  componentTaxRates?: ComponentTaxRate[];
  retailer?: boolean;
  recoverable?: boolean;
  forSales?: boolean;
  forPurchases?: boolean;
  taxTypeId?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface ComponentTaxRate {
  id?: string;
  displayedAs?: string;
  percentage?: number;
  agency?: string;
  name?: string;
}

export interface TaxRateCreateInput {
  name: string;
  percentage: number;
  agency?: string;
  percentageDecimals?: number;
  isVisible?: boolean;
  retailer?: boolean;
  recoverable?: boolean;
  forSales?: boolean;
  forPurchases?: boolean;
  taxTypeId?: string;
  componentTaxRates?: ComponentTaxRateInput[];
}

export interface ComponentTaxRateInput {
  percentage: number;
  agency?: string;
  name?: string;
}

export interface TaxRateUpdateInput extends Partial<TaxRateCreateInput> {}

// =============================================================================
// Journal
// =============================================================================

export interface Journal {
  id: string;
  displayedAs?: string;
  date?: string;
  reference?: string;
  description?: string;
  journalTypeId?: string;
  journalType?: { id: string; displayedAs?: string };
  journalLines?: JournalLine[];
  total?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface JournalLine {
  id?: string;
  ledgerAccountId?: string;
  ledgerAccount?: { id: string; displayedAs?: string };
  details?: string;
  debit?: number;
  credit?: number;
  taxRateId?: string;
  taxRate?: { id: string; displayedAs?: string };
  taxAmount?: number;
  deleted?: boolean;
  analysisTypeCategories?: AnalysisTypeCategory[];
  includedOnTaxReturn?: boolean;
  taxRecoverable?: boolean;
}

export interface JournalCreateInput {
  date: string;
  journalLines: JournalLineInput[];
  reference?: string;
  description?: string;
}

export interface JournalLineInput {
  ledgerAccountId: string;
  debit?: number;
  credit?: number;
  details?: string;
  taxRateId?: string;
  includedOnTaxReturn?: boolean;
  taxRecoverable?: boolean;
}

// =============================================================================
// Ledger Entry
// =============================================================================

export interface LedgerEntry {
  id: string;
  displayedAs?: string;
  transactionId?: string;
  transactionTypeId?: string;
  transactionType?: { id: string; displayedAs?: string };
  contactId?: string;
  contact?: { id: string; displayedAs?: string };
  deleted?: boolean;
  ledgerAccountId?: string;
  ledgerAccount?: { id: string; displayedAs?: string };
  date?: string;
  debit?: number;
  credit?: number;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// Attachment
// =============================================================================

export interface Attachment {
  id: string;
  displayedAs?: string;
  attachmentContextId?: string;
  attachmentContextTypeId?: string;
  attachmentContextType?: { id: string; displayedAs?: string };
  fileName?: string;
  mimeType?: string;
  description?: string;
  transactionId?: string;
  fileSize?: number;
  fileExtension?: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AttachmentCreateInput {
  attachmentContextId: string;
  attachmentContextTypeId: string;
  file: string; // base64 encoded file content
  fileName: string;
  mimeType: string;
  description?: string;
}

// =============================================================================
// Attachment Context Type
// =============================================================================

export interface AttachmentContextType {
  id: string;
  displayedAs?: string;
  name?: string;
}

// =============================================================================
// Business
// =============================================================================

export interface Business {
  id: string;
  displayedAs?: string;
  name?: string;
  addressLine1?: string;
  addressLine2?: string;
  city?: string;
  region?: string;
  postalCode?: string;
  countryId?: string;
  country?: { id: string; displayedAs?: string };
  website?: string;
  telephone?: string;
  mobile?: string;
  email?: string;
  createdAt?: string;
  updatedAt?: string;
}

// =============================================================================
// Country
// =============================================================================

export interface Country {
  id: string;
  displayedAs?: string;
  name?: string;
  code?: string;
}

// =============================================================================
// Transaction Type
// =============================================================================

export interface TransactionType {
  id: string;
  displayedAs?: string;
  name?: string;
}

// =============================================================================
// Opening Balances
// =============================================================================

export interface ContactOpeningBalance {
  id: string;
  displayedAs?: string;
  contactId?: string;
  contact?: { id: string; displayedAs?: string };
  transactionTypeId?: string;
  date?: string;
  reference?: string;
  creditAmount?: number;
  debitAmount?: number;
  currencyId?: string;
  currency?: Currency;
  exchangeRate?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface ContactOpeningBalanceCreateInput {
  contactId: string;
  transactionTypeId: string;
  date: string;
  debitAmount?: number;
  creditAmount?: number;
  reference?: string;
  currencyId?: string;
  exchangeRate?: number;
}

export interface BankOpeningBalance {
  id: string;
  displayedAs?: string;
  bankAccountId?: string;
  bankAccount?: { id: string; displayedAs?: string };
  transactionTypeId?: string;
  date?: string;
  reference?: string;
  debitAmount?: number;
  creditAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface BankOpeningBalanceCreateInput {
  bankAccountId: string;
  transactionTypeId: string;
  date: string;
  debitAmount?: number;
  creditAmount?: number;
  reference?: string;
}

export interface LedgerAccountOpeningBalance {
  id: string;
  displayedAs?: string;
  ledgerAccountId?: string;
  ledgerAccount?: { id: string; displayedAs?: string };
  date?: string;
  reference?: string;
  debitAmount?: number;
  creditAmount?: number;
  createdAt?: string;
  updatedAt?: string;
}

export interface LedgerAccountOpeningBalanceCreateInput {
  ledgerAccountId: string;
  date: string;
  debitAmount?: number;
  creditAmount?: number;
  reference?: string;
}

// =============================================================================
// Status Types
// =============================================================================

export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'PART_PAID' | 'VOID' | 'DELETED';
export type QuoteStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'VOID';
export type EstimateStatus = 'DRAFT' | 'SENT' | 'ACCEPTED' | 'DECLINED' | 'EXPIRED' | 'VOID';

// =============================================================================
// Tax Analysis
// =============================================================================

export interface TaxAnalysis {
  taxRateId?: string;
  taxRate?: { id: string; displayedAs?: string };
  netAmount?: number;
  taxAmount?: number;
  totalAmount?: number;
}

export interface TaxBreakdown {
  name?: string;
  percentage?: number;
  amount?: number;
}

// =============================================================================
// Payment On Account
// =============================================================================

export interface PaymentOnAccount {
  id?: string;
  date?: string;
  amount?: number;
  paymentId?: string;
}

// =============================================================================
// Response Format
// =============================================================================

export type ResponseFormat = 'json' | 'markdown';
