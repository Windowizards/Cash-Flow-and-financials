import './globals.css';
import './layout.css';

export const metadata = {
  title: 'Finance Tracker',
  description: 'Track cash flow, invoices, expenses, and taxes',
  viewport: 'width=device-width, initial-scale=1.0',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0" />
      </head>
      <body>
        <div className="app-container">
          {children}
        </div>
      </body>
    </html>
  );
}
