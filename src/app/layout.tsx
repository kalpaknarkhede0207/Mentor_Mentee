import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Senior School Mentorship & Academic Guidance Cell',
  description: 'NEP 2020 Compliant Mentoring System for Grades 9-12 with AI Voice-to-Insight Engine and School Risk Radar',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans">
        {children}
      </body>
    </html>
  );
}
