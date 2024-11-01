import type { Metadata } from "next";
import "./globals.css";



export const metadata: Metadata = {
  title: "GerenciarEstoque",
  description: "Projeto para o case de estágio da Mind.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body style={{ backgroundColor: 'white', height: '100vh' }}>
        {children}
      </body>
    </html>
  );
}
