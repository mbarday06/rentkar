import localFont from "next/font/local";
import "./globals.css";

const geistSans = localFont({
  src: "./fonts/Geist-Regular.woff2",
  variable: "--font-geist-sans",
});

const geistMono = localFont({
  src: "./fonts/GeistMono-Regular.woff2",
  variable: "--font-geist-mono",
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
      </body>
    </html>
  );
}
