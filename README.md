# n8n-nodes-solaris

> **[Velocity BPA Licensing Notice]**
>
> This n8n node is licensed under the Business Source License 1.1 (BSL 1.1).
>
> Use of this node by for-profit organizations in production environments requires a commercial license from Velocity BPA.
>
> For licensing information, visit https://velobpa.com/licensing or contact licensing@velobpa.com.

A comprehensive n8n community node for the **Solaris Banking-as-a-Service (BaaS)** platform, providing complete access to embedded banking capabilities including accounts, payments, cards, compliance, and PSD2/SCA authentication.

![n8n Version](https://img.shields.io/badge/n8n-%3E%3D1.0.0-blue)
![License](https://img.shields.io/badge/license-BSL--1.1-blue)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue)

## Features

- **25 Resource Categories** with 200+ operations
- **Complete Person & Business Management** - Customer onboarding, KYC, identity verification
- **Account Operations** - German IBAN accounts, balances, statements, reservations
- **SEPA Payments** - Credit transfers, instant payments, standing orders, direct debits
- **Card Issuing** - Physical and virtual cards, PIN management, mobile wallet provisioning
- **Card Controls** - Transaction limits, merchant categories, geographic restrictions
- **PSD2/SCA Compliance** - Strong Customer Authentication with multiple methods
- **Webhooks & Triggers** - Real-time event notifications for all banking operations
- **German Banking Compliance** - BaFin requirements, Video-Ident, GDPR

## Installation

### Community Nodes (Recommended)

1. Open your n8n instance
2. Go to **Settings** > **Community Nodes**
3. Select **Install**
4. Enter `n8n-nodes-solaris` and click **Install**

### Manual Installation

```bash
npm install n8n-nodes-solaris
```

### Development Installation

```bash
# Clone the repository
git clone https://github.com/Velocity-BPA/n8n-nodes-solaris.git
cd n8n-nodes-solaris

# Install dependencies
npm install

# Build
npm run build

# Link to n8n
mkdir -p ~/.n8n/custom
ln -s $(pwd) ~/.n8n/custom/n8n-nodes-solaris

# Restart n8n
```

## Credentials Setup

### Solaris API Credentials

| Field | Description |
|-------|-------------|
| Environment | Production, Sandbox, or Custom |
| Client ID | OAuth 2.0 client ID from Solaris Partner Portal |
| Client Secret | OAuth 2.0 client secret |
| Partner ID | Your Solaris partner identifier |
| API Key | Optional API key for additional authentication |
| Webhook Secret | Secret for webhook signature verification |

### Solaris OAuth Credentials

| Field | Description |
|-------|-------------|
| Client ID | OAuth 2.0 client ID |
| Client Secret | OAuth 2.0 client secret |
| Token URL | OAuth token endpoint |
| Scope | Requested OAuth scopes |

## Resources & Operations

### Person Resource (13 operations)
- Create, Get, Update, List persons
- Get person status, documents, tax information
- Update address, get accounts, cards, set limits

### Business Resource (12 operations)
- Create, Get, Update, List businesses
- Manage representatives (add/remove)
- Get business status, documents, accounts

### Identification Resource (10 operations)
- Create identification requests
- Start Video-Ident, Bank-Ident, eID verification
- Get identification status, results, documents, URL

### Account Resource (13 operations)
- Create, Get, List, Close accounts
- Block/Unblock accounts
- Get balance, IBAN, BIC, statements
- Get transactions, reservations, standing orders

### Transaction Resource (10 operations)
- Get, List, Search transactions
- Get by reference, status, pending, booked
- Export transactions, get categories

### SEPA Transfer Resource (11 operations)
- Create SEPA credit/instant transfers
- Create batch transfers, standing orders
- Get transfer status, fees
- Cancel transfers/standing orders

### Internal Transfer Resource (5 operations)
- Create, Get, Cancel internal transfers
- Get transfer status, list by account

### Card Resource (17 operations)
- Create physical/virtual cards
- Activate, Block, Unblock, Replace, Close
- Get/Change PIN, get card details (PAN, CVV)
- Set limits, get mobile wallet data

### Card Transaction Resource (9 operations)
- Get card transactions, authorizations
- Get presentments, clearings, chargebacks
- Dispute transactions

### Card Control Resource (10 operations)
- Set transaction/merchant category limits
- Block/Unblock merchant categories
- Set geographic limits
- Enable/Disable online, ATM, contactless

### Direct Debit Resource (10 operations)
- Create, Get, List, Activate, Cancel mandates
- Create direct debits, handle returns

### Overdraft Resource (8 operations)
- Get, Request, Update, Cancel overdrafts
- Get limit, interest rate, usage, history

### Loan Resource (10 operations)
- Create, Get loan applications
- Get loan status, repayment schedule
- Make payments, get balance, interest, documents

### Savings Resource (8 operations)
- Create, Get savings accounts
- Transfer to/from savings
- Get balance, interest rate, earned interest

### Tax Resource (7 operations)
- Get, Update tax information
- Get documents, withholding, report
- Submit tax ID, get residency

### Document Resource (8 operations)
- Upload, Get, List, Download, Delete documents
- Get by type, status, required documents

### Compliance Resource (9 operations)
- Get compliance status, AML/PEP/sanctions checks
- Get risk assessment, reports, alerts
- Submit/Update compliance data

### Webhook Resource (9 operations)
- Create, Get, List, Update, Delete webhooks
- Test webhooks, get events, deliveries
- Verify signatures

### Partner Resource (6 operations)
- Get partner info, accounts, transactions
- Get cards, limits, statistics

### Consent Resource (7 operations)
- Create, Get, Revoke consents
- Get by type, marketing consent
- Update marketing preferences

### Device Binding Resource (6 operations)
- Create, Get, List, Delete device bindings
- Verify devices, get binding challenges

### SCA Resource (6 operations)
- Create, Get, Verify SCA challenges
- Get SCA methods, status
- Register SCA devices

### Booking Resource (6 operations)
- Get, List bookings
- Categorize, get recurring bookings

### Report Resource (8 operations)
- Generate, Get, List, Download reports
- Schedule reports, get account/transaction reports

### Utility Resource (8 operations)
- Validate IBAN, BIC
- Get bank by BIC, supported countries
- Get exchange rates, API status, rate limits
- Test connection

## Trigger Node

The **Solaris Trigger** node provides real-time event notifications:

### Person/Business Events
- Person Created/Updated
- Business Created/Updated
- Identification Started/Completed/Failed

### Account Events
- Account Created/Closed/Blocked/Unblocked
- Balance Changed
- Reservation Created/Released

### Transaction Events
- Transaction Created/Booked/Pending/Failed/Reversed
- SEPA Transfer Sent/Received
- Instant Transfer Sent/Received

### Card Events
- Card Created/Activated/Blocked/Unblocked/Closed
- Authorization Created/Declined
- Card Transaction

### Direct Debit Events
- Mandate Created/Activated/Cancelled
- Direct Debit Created/Executed/Returned

### Compliance Events
- Compliance Check Required/Completed
- Risk Alert, Document Required

### SCA Events
- SCA Required/Completed/Failed
- Device Bound

## Usage Examples

### Create a Person

```javascript
// Solaris node configuration
{
  "resource": "person",
  "operation": "create",
  "firstName": "Max",
  "lastName": "Mustermann",
  "email": "max@example.de",
  "additionalFields": {
    "salutation": "MR",
    "birthDate": "1990-01-15",
    "birthCity": "Berlin",
    "birthCountry": "DE",
    "nationality": "DE",
    "address": {
      "line1": "Musterstraße 123",
      "postalCode": "10115",
      "city": "Berlin",
      "country": "DE"
    }
  }
}
```

### Start Video Identification

```javascript
{
  "resource": "identification",
  "operation": "startVideoIdentification",
  "personId": "{{ $json.id }}",
  "additionalFields": {
    "language": "de",
    "callbackUrl": "https://your-app.com/callback"
  }
}
```

### Create SEPA Transfer

```javascript
{
  "resource": "sepaTransfer",
  "operation": "create",
  "accountId": "{{ $json.accountId }}",
  "recipientName": "Empfänger GmbH",
  "recipientIban": "DE89370400440532013000",
  "amount": 1500.00,
  "reference": "Invoice 2024-001"
}
```

### Issue Virtual Card

```javascript
{
  "resource": "card",
  "operation": "createVirtual",
  "accountId": "{{ $json.accountId }}",
  "additionalFields": {
    "type": "MASTERCARD_DEBIT",
    "cardDesign": "STANDARD",
    "activateOnCreate": true
  }
}
```

### Set Card Controls

```javascript
{
  "resource": "cardControl",
  "operation": "setTransactionLimits",
  "cardId": "{{ $json.cardId }}",
  "limits": {
    "dailyLimit": 500,
    "monthlyLimit": 5000,
    "singleTransactionLimit": 250
  }
}
```

## Solaris Banking Concepts

### Person vs Business
- **Person**: Individual customer (natural person)
- **Business**: Company customer (legal entity with representatives)

### Identification Methods
- **Video-Ident**: Video call with ID document verification
- **Bank-Ident**: Verification via existing bank account
- **eID**: German electronic ID card verification

### Account Types
- **CHECKING_PERSONAL**: Personal checking account
- **CHECKING_BUSINESS**: Business checking account
- **SAVINGS**: Savings account

### SEPA Payment Types
- **SEPA Credit Transfer (SCT)**: Standard bank transfer (1-2 days)
- **SEPA Instant (SCT Inst)**: Real-time transfer (< 10 seconds)
- **SEPA Direct Debit**: Pull payment with mandate

### PSD2/SCA
Strong Customer Authentication is required for:
- Online payments over €30
- Sensitive operations (PIN change, limit change)
- Account information access

SCA Methods:
- SMS OTP
- Push notification
- Biometric
- TOTP (Authenticator app)

## Error Handling

The node provides detailed error information:

| Error Code | Description |
|------------|-------------|
| INVALID_IBAN | Invalid IBAN format or checksum |
| INSUFFICIENT_FUNDS | Account balance too low |
| SCA_REQUIRED | Strong Customer Authentication needed |
| IDENTIFICATION_PENDING | KYC not completed |
| CARD_BLOCKED | Card is currently blocked |
| RATE_LIMIT_EXCEEDED | API rate limit reached |

## Security Best Practices

1. **Never log credentials** - API keys and secrets are automatically masked
2. **Use environment variables** - Store credentials securely
3. **Verify webhooks** - Always validate webhook signatures
4. **Handle PII carefully** - Follow GDPR requirements
5. **Use sandbox first** - Test thoroughly before production
6. **Implement SCA** - Required for PSD2 compliance

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Run tests with coverage
npm run test:coverage

# Lint
npm run lint

# Fix lint issues
npm run lint:fix
```

## Author

**Velocity BPA**
- Website: [velobpa.com](https://velobpa.com)
- GitHub: [Velocity-BPA](https://github.com/Velocity-BPA)

## Licensing

This n8n community node is licensed under the **Business Source License 1.1**.

### Free Use
Permitted for personal, educational, research, and internal business use.

### Commercial Use
Use of this node within any SaaS, PaaS, hosted platform, managed service,
or paid automation offering requires a commercial license.

For licensing inquiries:
**licensing@velobpa.com**

See [LICENSE](LICENSE), [COMMERCIAL_LICENSE.md](COMMERCIAL_LICENSE.md), and [LICENSING_FAQ.md](LICENSING_FAQ.md) for details.

## Contributing

Contributions are welcome! Please read our contributing guidelines and submit pull requests to the main branch.

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run tests and linting
5. Submit a pull request

## Support

- **Documentation**: [Solaris API Documentation](https://docs.solarisbank.com)
- **Issues**: [GitHub Issues](https://github.com/Velocity-BPA/n8n-nodes-solaris/issues)
- **Email**: support@velobpa.com

## Acknowledgments

- [Solaris SE](https://www.solarisgroup.com/) for their Banking-as-a-Service platform
- [n8n](https://n8n.io/) for the workflow automation platform
- The open-source community
