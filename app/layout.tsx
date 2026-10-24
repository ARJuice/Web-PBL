import type {Metadata} from 'next';
import { Playfair_Display, Plus_Jakarta_Sans } from 'next/font/google';
import './globals.css';
import { ApolloWrapper } from '@/components/ApolloWrapper';

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
  title: 'MATCH@ALL — Meet someone worth talking to',
  description: 'A Valentine-season social matching platform — meet someone worth talking to, anywhere.',
  openGraph: {
    title: 'MATCH@ALL — Meet someone worth talking to',
    description: 'A Valentine-season social matching platform — meet someone worth talking to, anywhere.',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'MATCH@ALL — Meet someone worth talking to',
    description: 'A Valentine-season social matching platform — meet someone worth talking to, anywhere.',
  },
};

export default function RootLayout({children}: {children: React.ReactNode}) {
  return (
    <html lang="en" className={`${playfair.variable} ${jakarta.variable}`}>
      <body className="font-sans antialiased bg-[#fff8f9] text-[#1c1417] min-h-screen selection:bg-rose-200 selection:text-rose-900" suppressHydrationWarning>
        <ApolloWrapper>{children}</ApolloWrapper>
      </body>
    </html>
  );
}
