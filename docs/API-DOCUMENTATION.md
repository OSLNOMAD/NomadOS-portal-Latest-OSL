# Nomad Internet Customer Portal - API Documentation

This document provides detailed information about all external API integrations used in the Nomad Internet Customer Portal.

---

## Table of Contents

1. [Chargebee API](#chargebee-api)
2. [Shopify Admin API](#shopify-admin-api)
3. [Shipstation API](#shipstation-api)
4. [ThingSpace API](#thingspace-api)
5. [Data Type Notes](#data-type-notes)

---

## Chargebee API

**Base URL:** `https://{CHARGEBEE_SITE}.chargebee.com/api/v2`

**Authentication:** HTTP Basic Auth with API Key (password is empty)
```
Authorization: Basic base64(API_KEY:)
```

**Environment Variables Required:**
- `CHARGEBEE_API_KEY` - API key from Chargebee
- `CHARGEBEE_SITE` - Your Chargebee site name (e.g., "nomadinternet")

### Endpoints Used

---

### 1. List Customers by Email

**Endpoint:** `GET /customers?email[is]={email}&limit=100`

**Description:** Retrieves all customer accounts associated with an email address. One email can have multiple Chargebee customer accounts.

**Example Request:**
```
GET /customers?email[is]=customer@example.com&limit=100
```

**Example Response:**
```json
{
  "list": [
    {
      "customer": {
        "id": "cbdemo_ABCD1234",
        "email": "customer@example.com",
        "first_name": "John",
        "last_name": "Doe",
        "phone": "+15551234567",
        "created_at": 1704067200,
        "auto_collection": "on",
        "promotional_credits": 0,
        "refundable_credits": 0,
        "excess_payments": 0,
        "unbilled_charges": 0,
        "billing_address": {
          "first_name": "John",
          "last_name": "Doe",
          "line1": "123 Main St",
          "line2": "Apt 4",
          "city": "Austin",
          "state": "TX",
          "zip": "78701",
          "country": "US",
          "phone": "+15551234567"
        },
        "payment_method": {
          "type": "card",
          "status": "valid",
          "gateway": "stripe"
        },
        "cf_custom_field_name": "custom_value"
      }
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Unique customer identifier |
| `email` | string | Customer email address |
| `first_name` | string | Customer first name |
| `last_name` | string | Customer last name |
| `phone` | string | Phone number with country code |
| `created_at` | integer | Unix timestamp (seconds) |
| `auto_collection` | string | "on" or "off" - automatic payment collection |
| `promotional_credits` | integer | Credits in **cents** |
| `refundable_credits` | integer | Refundable credits in **cents** |
| `excess_payments` | integer | Excess payments in **cents** |
| `unbilled_charges` | integer | Pending charges in **cents** |
| `cf_*` | string | Custom fields prefixed with `cf_` |

---

### 2. List Subscriptions by Customer

**Endpoint:** `GET /subscriptions?customer_id[is]={customer_id}&limit=50`

**Description:** Retrieves all subscriptions for a specific customer.

**Example Response:**
```json
{
  "list": [
    {
      "subscription": {
        "id": "sub_ABCD1234",
        "customer_id": "cbdemo_ABCD1234",
        "status": "active",
        "plan_id": "nomad-air-monthly",
        "plan_amount": 14995,
        "billing_period": 1,
        "billing_period_unit": "month",
        "created_at": 1704067200,
        "started_at": 1704067200,
        "activated_at": 1704067200,
        "current_term_start": 1706745600,
        "current_term_end": 1709424000,
        "next_billing_at": 1709424000,
        "cancelled_at": null,
        "cancel_reason": null,
        "due_invoices_count": 0,
        "due_since": null,
        "total_dues": 0,
        "mrr": 14995,
        "cf_SIM_ID_ICCID": "89148000001234567890",
        "cf_Device_IMEI": "123456789012345",
        "cf_mdn": "5551234567",
        "subscription_items": [
          {
            "item_price_id": "nomad-air-monthly-USD",
            "item_type": "plan",
            "quantity": 1,
            "amount": 14995,
            "unit_price": 14995
          }
        ],
        "shipping_address": {
          "line1": "123 Main St",
          "city": "Austin",
          "state": "TX",
          "zip": "78701",
          "country": "US"
        }
      }
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Subscription ID |
| `status` | string | "active", "cancelled", "non_renewing", "paused" |
| `plan_amount` | integer | Plan price in **cents** |
| `billing_period` | integer | Billing frequency number |
| `billing_period_unit` | string | "month", "year", etc. |
| `current_term_start` | integer | Unix timestamp (seconds) |
| `current_term_end` | integer | Unix timestamp (seconds) |
| `next_billing_at` | integer | Unix timestamp (seconds) |
| `mrr` | integer | Monthly Recurring Revenue in **cents** |
| `cf_SIM_ID_ICCID` | string | Custom field: SIM ICCID |
| `cf_Device_IMEI` | string | Custom field: Device IMEI |
| `cf_mdn` | string | Custom field: Mobile Directory Number |

---

### 3. List Invoices by Customer

**Endpoint:** `GET /invoices?customer_id[is]={customer_id}&limit=50&sort_by[desc]=date`

**Description:** Retrieves all invoices for a customer, sorted by date (newest first).

**Example Response:**
```json
{
  "list": [
    {
      "invoice": {
        "id": "inv_ABCD1234",
        "customer_id": "cbdemo_ABCD1234",
        "status": "paid",
        "date": 1706745600,
        "due_date": 1707350400,
        "paid_at": 1706745700,
        "sub_total": 14995,
        "tax": 0,
        "total": 14995,
        "amount_paid": 14995,
        "amount_adjusted": 0,
        "credits_applied": 0,
        "amount_due": 0,
        "write_off_amount": 0,
        "dunning_status": null,
        "first_invoice": false,
        "recurring": true,
        "currency_code": "USD",
        "line_items": [
          {
            "description": "Nomad Air Monthly Plan",
            "amount": 14995,
            "quantity": 1,
            "entity_type": "plan_item_price",
            "entity_id": "nomad-air-monthly-USD"
          }
        ],
        "linked_payments": [
          {
            "txn_id": "txn_ABCD1234",
            "txn_amount": 14995,
            "txn_date": 1706745700,
            "txn_status": "success"
          }
        ],
        "dunning_attempts": []
      }
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Invoice ID |
| `status` | string | "paid", "payment_due", "not_paid", "voided", "pending" |
| `date` | integer | Invoice date - Unix timestamp (seconds) |
| `due_date` | integer | Due date - Unix timestamp (seconds) |
| `paid_at` | integer | Payment date - Unix timestamp (seconds) |
| `sub_total` | integer | Subtotal in **cents** |
| `tax` | integer | Tax amount in **cents** |
| `total` | integer | Total amount in **cents** |
| `amount_paid` | integer | Amount paid in **cents** |
| `amount_due` | integer | Outstanding amount in **cents** |
| `dunning_status` | string | null, "in_progress", "exhausted", "stopped", "success" |

---

### 4. List Transactions by Customer

**Endpoint:** `GET /transactions?customer_id[is]={customer_id}&limit=50&sort_by[desc]=date`

**Description:** Retrieves all payment transactions for a customer.

**Example Response:**
```json
{
  "list": [
    {
      "transaction": {
        "id": "txn_ABCD1234",
        "customer_id": "cbdemo_ABCD1234",
        "type": "payment",
        "status": "success",
        "date": 1706745700,
        "amount": 14995,
        "currency_code": "USD",
        "gateway": "stripe",
        "payment_method": "card",
        "reference_number": "ch_ABC123",
        "id_at_gateway": "ch_ABC123",
        "error_code": null,
        "error_text": null,
        "amount_unused": 0,
        "masked_card_number": "************4242",
        "linked_invoices": [
          {
            "invoice_id": "inv_ABCD1234",
            "applied_amount": 14995,
            "applied_at": 1706745700
          }
        ]
      }
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | string | Transaction ID |
| `type` | string | "payment", "refund", "payment_reversal" |
| `status` | string | "success", "voided", "failure", "timeout", "needs_attention" |
| `amount` | integer | Amount in **cents** |
| `gateway` | string | Payment gateway name |
| `payment_method` | string | "card", "bank_account", etc. |
| `error_code` | string | Error code if failed |
| `error_text` | string | Error message if failed |

---

### 5. List Payment Sources

**Endpoint:** `GET /payment_sources?customer_id[is]={customer_id}`

**Description:** Retrieves saved payment methods for a customer.

**Example Response:**
```json
{
  "list": [
    {
      "payment_source": {
        "id": "pm_ABCD1234",
        "customer_id": "cbdemo_ABCD1234",
        "type": "card",
        "status": "valid",
        "gateway": "stripe",
        "gateway_account_id": "gw_ABC123",
        "reference_id": "pm_stripe_123",
        "created_at": 1704067200,
        "card": {
          "brand": "visa",
          "last4": "4242",
          "expiry_month": 12,
          "expiry_year": 2025,
          "funding_type": "credit"
        }
      }
    }
  ]
}
```

---

## Shopify Admin API

**Base URL:** `https://nomadinternet.myshopify.com/admin/api/2024-01`

**Authentication:** Access Token Header
```
X-Shopify-Access-Token: {SHOPIFY_ADMIN_KEY}
```

**Environment Variables Required:**
- `SHOPIFY_ADMIN_KEY` - Shopify Admin API access token

### Endpoints Used

---

### 1. List Orders by Email

**Endpoint:** `GET /orders.json?status=any&email={email}&limit=250`

**Description:** Retrieves all orders (any status) for a customer email.

**Example Request:**
```
GET /orders.json?status=any&email=customer@example.com&limit=250
```

**Example Response:**
```json
{
  "orders": [
    {
      "id": 5551234567890,
      "name": "#NI-12345",
      "email": "customer@example.com",
      "phone": "+15551234567",
      "created_at": "2024-01-15T10:30:00-06:00",
      "updated_at": "2024-01-16T14:20:00-06:00",
      "financial_status": "paid",
      "fulfillment_status": "fulfilled",
      "total_price": "299.95",
      "subtotal_price": "279.95",
      "total_tax": "0.00",
      "total_discounts": "0.00",
      "total_shipping_price_set": {
        "shop_money": {
          "amount": "20.00",
          "currency_code": "USD"
        }
      },
      "currency": "USD",
      "order_status_url": "https://nomadinternet.com/orders/abc123/authenticate",
      "tags": "subscription, nomad-air",
      "note": "Customer requested expedited shipping",
      "source_name": "web",
      "gateway": "shopify_payments",
      "processing_method": "direct",
      "note_attributes": [
        { "name": "subscription_id", "value": "sub_ABC123" }
      ],
      "line_items": [
        {
          "id": 11234567890,
          "name": "Nomad Air Router",
          "sku": "NOMAD-AIR-001",
          "quantity": 1,
          "price": "279.95",
          "variant_id": 44123456789,
          "product_id": 8812345678,
          "fulfillment_status": "fulfilled",
          "properties": [
            { "name": "ICCID", "value": "89148000001234567890" },
            { "name": "IMEI", "value": "123456789012345" }
          ]
        }
      ],
      "fulfillments": [
        {
          "id": 4412345678901,
          "status": "success",
          "created_at": "2024-01-16T08:00:00-06:00",
          "tracking_company": "USPS",
          "tracking_number": "9400111899223456789012",
          "tracking_url": "https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223456789012",
          "tracking_numbers": ["9400111899223456789012"],
          "tracking_urls": ["https://tools.usps.com/go/TrackConfirmAction?tLabels=9400111899223456789012"]
        }
      ],
      "shipping_address": {
        "first_name": "John",
        "last_name": "Doe",
        "company": null,
        "address1": "123 Main St",
        "address2": "Apt 4",
        "city": "Austin",
        "province": "Texas",
        "province_code": "TX",
        "zip": "78701",
        "country": "United States",
        "country_code": "US",
        "phone": "+15551234567"
      },
      "billing_address": {
        "first_name": "John",
        "last_name": "Doe",
        "address1": "123 Main St",
        "city": "Austin",
        "province": "Texas",
        "zip": "78701",
        "country": "United States"
      },
      "shipping_lines": [
        {
          "title": "Standard Shipping",
          "price": "20.00"
        }
      ],
      "discount_codes": [],
      "refunds": []
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `id` | integer | Shopify order ID |
| `name` | string | Order number (e.g., "#NI-12345") |
| `financial_status` | string | "pending", "paid", "refunded", "voided", etc. |
| `fulfillment_status` | string | null (unfulfilled), "partial", "fulfilled" |
| `total_price` | string | Total in **dollars** (string format) |
| `subtotal_price` | string | Subtotal in **dollars** |
| `total_tax` | string | Tax in **dollars** |
| `total_discounts` | string | Discounts in **dollars** |
| `currency` | string | Currency code (e.g., "USD") |
| `line_items[].properties` | array | Custom properties including ICCID/IMEI |
| `fulfillments[].tracking_number` | string | Shipping tracking number |
| `fulfillments[].tracking_company` | string | Carrier name |

**Important Notes:**
- All monetary values are returned as **strings in dollars** (e.g., "299.95")
- Do NOT divide by 100 - values are already in dollars
- Timestamps are in ISO 8601 format

---

## Shipstation API

**Base URL:** `https://ssapi.shipstation.com`

**Authentication:** HTTP Basic Auth
```
Authorization: Basic base64(API_KEY:API_SECRET)
```

**Environment Variables Required:**
- `SHIPSTATION_API_KEY` - ShipStation API key
- `SHIPSTATION_API_SECRET` - ShipStation API secret

### Endpoints Used

---

### 1. List Orders by Order Number

**Endpoint:** `GET /orders?orderNumber={orderNumber}`

**Description:** Retrieves orders matching a specific order number. Used to correlate Shopify orders with Shipstation shipping data.

**Example Request:**
```
GET /orders?orderNumber=NI-12345
```

**Example Response:**
```json
{
  "orders": [
    {
      "orderId": 123456789,
      "orderNumber": "NI-12345",
      "orderKey": "abc123-def456",
      "orderDate": "2024-01-15T10:30:00.0000000",
      "createDate": "2024-01-15T10:35:00.0000000",
      "modifyDate": "2024-01-16T14:20:00.0000000",
      "paymentDate": "2024-01-15T10:30:00.0000000",
      "shipByDate": "2024-01-18T00:00:00.0000000",
      "orderStatus": "shipped",
      "orderTotal": 299.95,
      "amountPaid": 299.95,
      "taxAmount": 0.00,
      "shippingAmount": 20.00,
      "customerId": 98765432,
      "customerUsername": null,
      "customerEmail": "customer@example.com",
      "customerNotes": "Please leave at door",
      "internalNotes": "Priority customer",
      "gift": false,
      "giftMessage": null,
      "paymentMethod": "Credit Card",
      "requestedShippingService": "USPS Priority Mail",
      "carrierCode": "usps",
      "serviceCode": "usps_priority_mail",
      "packageCode": "package",
      "confirmation": "delivery",
      "shipDate": "2024-01-16T08:00:00.0000000",
      "weight": {
        "value": 2.5,
        "units": "pounds"
      },
      "dimensions": {
        "length": 12.0,
        "width": 8.0,
        "height": 6.0,
        "units": "inches"
      },
      "advancedOptions": {
        "warehouseId": 123456,
        "nonMachinable": false,
        "saturdayDelivery": false,
        "containsAlcohol": false,
        "storeId": 789012,
        "customField1": "123456789012345",
        "customField2": "89148000001234567890",
        "customField3": null,
        "source": "shopify",
        "mergedOrSplit": false,
        "parentId": null
      },
      "items": [
        {
          "orderItemId": 987654321,
          "lineItemKey": "11234567890",
          "sku": "NOMAD-AIR-001",
          "name": "Nomad Air Router",
          "imageUrl": "https://cdn.shopify.com/s/files/nomad-air.jpg",
          "quantity": 1,
          "unitPrice": 279.95,
          "taxAmount": 0.00,
          "shippingAmount": 20.00,
          "warehouseLocation": "BIN-A12",
          "productId": 12345,
          "fulfillmentSku": null,
          "upc": "123456789012",
          "options": [
            { "name": "Color", "value": "Black" }
          ]
        }
      ],
      "shipTo": {
        "name": "John Doe",
        "company": null,
        "street1": "123 Main St",
        "street2": "Apt 4",
        "street3": null,
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "US",
        "phone": "5551234567",
        "residential": true,
        "addressVerified": "Address validated successfully"
      },
      "billTo": {
        "name": "John Doe",
        "company": null,
        "street1": "123 Main St",
        "city": "Austin",
        "state": "TX",
        "postalCode": "78701",
        "country": "US",
        "phone": "5551234567"
      },
      "shipments": [
        {
          "shipmentId": 555123456,
          "orderId": 123456789,
          "orderKey": "abc123-def456",
          "orderNumber": "NI-12345",
          "createDate": "2024-01-16T08:00:00.0000000",
          "shipDate": "2024-01-16T08:00:00.0000000",
          "shipmentCost": 8.75,
          "insuranceCost": 0.00,
          "trackingNumber": "9400111899223456789012",
          "carrierCode": "usps",
          "serviceCode": "usps_priority_mail",
          "packageCode": "package",
          "confirmation": "delivery",
          "warehouseId": 123456,
          "voided": false,
          "voidDate": null,
          "marketplaceNotified": true,
          "weight": {
            "value": 2.5,
            "units": "pounds"
          },
          "dimensions": {
            "length": 12.0,
            "width": 8.0,
            "height": 6.0,
            "units": "inches"
          },
          "shipTo": {
            "name": "John Doe",
            "street1": "123 Main St",
            "city": "Austin",
            "state": "TX",
            "postalCode": "78701"
          }
        }
      ]
    }
  ],
  "total": 1,
  "page": 1,
  "pages": 1
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `orderId` | integer | ShipStation order ID |
| `orderNumber` | string | Order number (matches Shopify) |
| `orderStatus` | string | "awaiting_shipment", "shipped", "cancelled", etc. |
| `orderTotal` | number | Total in **dollars** (float) |
| `amountPaid` | number | Amount paid in **dollars** |
| `carrierCode` | string | Shipping carrier code |
| `advancedOptions.customField1` | string | **IMEI** (device identifier) |
| `advancedOptions.customField2` | string | **ICCID** (SIM card identifier) |
| `shipments[].trackingNumber` | string | Tracking number |
| `shipments[].carrierCode` | string | Carrier for this shipment |
| `shipments[].shipDate` | string | Ship date timestamp |

**Important Notes:**
- Monetary values are **floats in dollars** (e.g., 299.95)
- `advancedOptions.customField1` contains the **IMEI**
- `advancedOptions.customField2` contains the **ICCID**
- Multiple shipments possible per order (split shipments)

---

## ThingSpace API

**Base URL:** `https://thingspace.verizon.com/api`

**Authentication:** Two-step OAuth2 + Session Token flow

**Environment Variables Required:**
- `THINGSPACE_CLIENT_ID` - OAuth client ID
- `THINGSPACE_CLIENT_SECRET` - OAuth client secret
- `THINGSPACE_USERNAME` - ThingSpace username
- `THINGSPACE_PASSWORD` - ThingSpace password
- `THINGSPACE_ACCOUNT_NAME` - Verizon account name

### Authentication Flow

---

### Step 1: Get OAuth2 Access Token

**Endpoint:** `POST /ts/v1/oauth2/token`

**Authentication:** Basic Auth with Client ID/Secret
```
Authorization: Basic base64(CLIENT_ID:CLIENT_SECRET)
Content-Type: application/x-www-form-urlencoded
```

**Request Body:**
```
grant_type=client_credentials
```

**Example Response:**
```json
{
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "token_type": "Bearer",
  "expires_in": 3600,
  "scope": "M2M"
}
```

---

### Step 2: Get M2M Session Token

**Endpoint:** `POST /m2m/v1/session/login`

**Headers:**
```
Authorization: Bearer {oauth_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "username": "{THINGSPACE_USERNAME}",
  "password": "{THINGSPACE_PASSWORD}"
}
```

**Example Response:**
```json
{
  "sessionToken": "a1b2c3d4e5f6g7h8i9j0..."
}
```

---

### Endpoints Used

---

### 1. List Devices by ICCID

**Endpoint:** `POST /m2m/v1/devices/actions/list`

**Headers:**
```
Authorization: Bearer {oauth_token}
VZ-M2M-Token: {session_token}
Content-Type: application/json
```

**Request Body:**
```json
{
  "accountName": "{THINGSPACE_ACCOUNT_NAME}",
  "filter": {
    "deviceIdentifierFilters": [
      {
        "kind": "iccid",
        "contains": "89148000001234567890"
      }
    ]
  },
  "maxNumberOfDevices": 500
}
```

**Example Response:**
```json
{
  "hasMoreData": false,
  "devices": [
    {
      "accountName": "0123456789-00001",
      "state": "active",
      "connected": true,
      "ipAddress": "10.176.45.123",
      "lastConnectionDate": "2024-01-28T08:30:00Z",
      "lastActivationDate": "2024-01-15T10:00:00Z",
      "billingCycleEndDate": "2024-02-14",
      "deviceIds": [
        { "kind": "mdn", "id": "5551234567" },
        { "kind": "imsi", "id": "311480123456789" },
        { "kind": "imei", "id": "123456789012345" },
        { "kind": "iccid", "id": "89148000001234567890" },
        { "kind": "msisdn", "id": "15551234567" },
        { "kind": "min", "id": "5551234567" }
      ],
      "carrierInformations": [
        {
          "carrierName": "Verizon Wireless",
          "servicePlan": "M2M_4G_LTE_DATA",
          "state": "active"
        }
      ],
      "extendedAttributes": [
        { "key": "dataUsage", "value": "2.5GB" },
        { "key": "deviceType", "value": "Router" },
        { "key": "manufacturer", "value": "Inseego" },
        { "key": "model", "value": "MiFi M2100" }
      ]
    }
  ]
}
```

**Key Fields:**
| Field | Type | Description |
|-------|------|-------------|
| `accountName` | string | Verizon account identifier |
| `state` | string | "active", "deactive", "suspended" |
| `connected` | boolean | Current connection status |
| `ipAddress` | string | Current IP address (if connected) |
| `lastConnectionDate` | string | ISO timestamp of last connection |
| `lastActivationDate` | string | ISO timestamp of activation |
| `billingCycleEndDate` | string | End of current billing period |
| `deviceIds` | array | All device identifiers (MDN, IMEI, ICCID, etc.) |
| `carrierInformations` | array | Carrier and service plan details |
| `extendedAttributes` | array | Additional device metadata |

**Device Identifier Types (deviceIds.kind):**
| Kind | Description |
|------|-------------|
| `mdn` | Mobile Directory Number (10-digit phone number) |
| `imsi` | International Mobile Subscriber Identity |
| `imei` | International Mobile Equipment Identity |
| `iccid` | Integrated Circuit Card Identifier (SIM ID) |
| `msisdn` | Mobile Station ISDN Number |
| `min` | Mobile Identification Number |

---

### 2. Get Device Information (Alternate)

**Endpoint:** `GET /m2m/v1/devices/information?accountName={account}&iccid={iccid}`

**Headers:**
```
Authorization: Bearer {oauth_token}
VZ-M2M-Token: {session_token}
Content-Type: application/json
```

**Description:** Alternative endpoint for querying a single device by ICCID.

---

## Data Type Notes

### Currency Values

| API | Format | Example | Conversion |
|-----|--------|---------|------------|
| **Chargebee** | Integer (cents) | `14995` | Divide by 100 → $149.95 |
| **Shopify** | String (dollars) | `"299.95"` | Parse as float, no division |
| **Shipstation** | Float (dollars) | `299.95` | No conversion needed |

### Timestamps

| API | Format | Example |
|-----|--------|---------|
| **Chargebee** | Unix timestamp (seconds) | `1706745600` |
| **Shopify** | ISO 8601 string | `"2024-01-15T10:30:00-06:00"` |
| **Shipstation** | ISO 8601 string | `"2024-01-15T10:30:00.0000000"` |
| **ThingSpace** | ISO 8601 string | `"2024-01-28T08:30:00Z"` |

### Device Identifiers

| Identifier | Description | Format | Where Found |
|------------|-------------|--------|-------------|
| **ICCID** | SIM Card ID | 19-20 digits | Chargebee `cf_SIM_ID_ICCID`, Shipstation `customField2`, ThingSpace |
| **IMEI** | Device ID | 15 digits | Chargebee `cf_Device_IMEI`, Shipstation `customField1`, ThingSpace |
| **MDN** | Phone Number | 10 digits | Chargebee `cf_mdn`, ThingSpace |

---

## Error Handling

### Common HTTP Status Codes

| Code | Meaning | Action |
|------|---------|--------|
| `200` | Success | Process response |
| `401` | Unauthorized | Check API key/token |
| `403` | Forbidden | Check permissions |
| `404` | Not Found | Resource doesn't exist |
| `429` | Rate Limited | Wait and retry |
| `500` | Server Error | Retry with backoff |

### API-Specific Rate Limits

| API | Rate Limit |
|-----|------------|
| **Chargebee** | 150 requests/minute |
| **Shopify** | 2 requests/second (REST) |
| **Shipstation** | 40 requests/minute |
| **ThingSpace** | Varies by endpoint |

---

## File Locations

The API integration code is located in:

- **Main service file:** `server/services.ts` - All API calls and data parsing
- **Chat context formatting:** `server/chat.ts` - Formats data for AI assistant
- **Chargebee lookup script:** `server/chargebee-full-lookup.ts` - Debug/test script
- **ThingSpace lookup script:** `server/thingspace-lookup.ts` - Debug/test script

---

*Last Updated: January 28, 2026*
