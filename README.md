# Finance Tracker

A comprehensive cash flow and financial management app for tracking invoices, expenses, jobs, taxes, and bank accounts.

## Features

- **Dashboard**: Overview of your financial position with cash flow projections
- **Bank Accounts**: Track multiple personal and business accounts
- **Invoices**: Manage outstanding and paid invoices with client tracking
- **Jobs**: Track upcoming projects and revenue
- **Expenses**: Record purchases and recurring expenses by category
- **Taxes**: Monitor quarterly estimates and tax payments
- **Cash Flow Timeline**: Visual timeline of upcoming income and expenses

## Getting Started

### Prerequisites
- Node.js 18+
- npm or yarn

### Installation

```bash
npm install
```

### Running the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Project Structure

```
/app
  /accounts    - Bank account management
  /invoices    - Invoice tracking
  /jobs        - Project and job tracking
  /expenses    - Expense and purchase tracking
  /taxes       - Tax obligation tracking
  page.js      - Dashboard
  layout.js    - Root layout
  globals.css  - Global styles

/lib
  financeUtils.js  - Financial calculations and utilities

/components
  Timeline.js      - Cash flow timeline component
```

## Usage

### Adding Items

1. Click the "+" button on any page to add new items
2. Fill in the form and submit
3. Items will automatically update your cash flow calculations

### Tracking Status

- Change invoice status (outstanding → paid)
- Mark expenses as pending → paid
- Update job status (upcoming → in_progress → completed)
- Track tax payment status

### Cash Flow Timeline

The dashboard shows a chronological view of all upcoming income and expenses, helping you plan for cash gaps and opportunities.

## Future Enhancements

- Supabase integration for data persistence
- Real bank account API connections (Plaid)
- Recurring expense automation
- Advanced reporting and analytics
- Multi-user/team support
- Mobile app with Capacitor

## License

MIT
