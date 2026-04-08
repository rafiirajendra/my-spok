import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Spok Belajar",
  description:
    "Aplikasi edukasi interaktif untuk membantu siswa tunarungu belajar menyusun kalimat sederhana.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className="h-full scroll-smooth">
      <body className="min-h-full bg-background text-foreground antialiased">
        {children}
      </body>
    </html>
  );
}
