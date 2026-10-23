import type {Metadata} from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';

const playfair = Playfair_Display({
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
});

const jakarta = Plus_Jakarta_Sans({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

export const metadata: Metadata = {
  title: 'MATCH@SAHRDAYA — Meet someone worth talking to',
  description: 'A temporary, Sahrdaya-college-only social matching platform designed around the Valentine\'s Day period.',
  openGraph: {
    title: 'MATCH@SAHRDAYA — Meet someone worth talking to',
    description: 'A temporary, Sahrdaya-college-only social matching platform designed around the Valentine\'s Day period.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATCH@SAHRDAYA — Meet someone worth talking to',
    description: 'A temporary, Sahrdaya-college-only social matching platform designed around the Valentine\'s Day period.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#fff8f9] text-[#1c1417] min-h-screen selection:bg-rose-200 selection:text-rose-900" suppressHydrationWarning>
        {children}
      </body>
    </html>
  );
}
