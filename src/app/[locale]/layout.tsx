import type { Metadata } from "next";
import { Plus_Jakarta_Sans } from "next/font/google";
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { notFound } from 'next/navigation';
import { routing } from '@/i18n/routing';
import "../globals.css";

const plusJakartaSans = Plus_Jakarta_Sans({
  variable: "--font-sans",
  subsets: ["latin", "vietnamese"],
});

export const metadata: Metadata = {
  title: "HappyWish - Tạo website lời chúc cá nhân hóa",
  description: "Nền tảng tạo website lời chúc tuyệt vời cho sinh nhật, kỷ niệm, Valentine và nhiều dịp đặc biệt khác. Gửi đi những món quà bất ngờ với âm nhạc và hiệu ứng sống động.",
  keywords: ["lời chúc sinh nhật", "website lời chúc", "quà tặng độc đáo", "happy birthday", "greeting website", "happywish"],
  openGraph: {
    title: "HappyWish - Tạo website lời chúc cá nhân hóa",
    description: "Nền tảng tạo website lời chúc tuyệt vời cho sinh nhật, kỷ niệm, Valentine và nhiều dịp đặc biệt khác.",
    url: "https://happywish.com",
    siteName: "HappyWish",
    images: [
      {
        url: "https://happywish.com/og-image.jpg", // Cần thay bằng URL thật khi deploy
        width: 1200,
        height: 630,
      },
    ],
    locale: "vi_VN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "HappyWish - Tạo website lời chúc cá nhân hóa",
    description: "Nền tảng tạo website lời chúc tuyệt vời cho sinh nhật, kỷ niệm, Valentine.",
  },
};

export default async function RootLayout({
  children,
  params
}: Readonly<{
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}>) {
  const { locale } = await params;
  
  if (!routing.locales.includes(locale as any)) {
    notFound();
  }
 
  const messages = await getMessages();

  return (
    <html lang={locale} className={`${plusJakartaSans.variable} antialiased`}>
      <body className="min-h-screen bg-background font-sans text-foreground">
        <NextIntlClientProvider messages={messages}>
          {children}
        </NextIntlClientProvider>
      </body>
    </html>
  );
}

