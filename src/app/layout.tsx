import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'Guardian Faculty Member (GFM) Mentorship Portal',
  description: 'Enterprise Academic Mentoring & Guidance Console for Secondary Schools and Higher Education',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-50 text-slate-900 antialiased font-sans selection:bg-orange-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}
