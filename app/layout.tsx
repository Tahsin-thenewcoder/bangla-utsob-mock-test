
import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "বাংলা উৎসব | প্রস্তুতিমূলক মডেল টেস্ট",
  description:
    "সূচনা ছাত্র সংগঠন আয়োজিত বাংলা উৎসবের প্রস্তুতিমূলক মডেল টেস্ট।",
  icons: {
    icon: "/suchona-logo.png",
    shortcut: "/suchona-logo.png",
    apple: "/suchona-logo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="bn">
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
