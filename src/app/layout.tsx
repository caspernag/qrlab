import type { Metadata } from "next";
import "../../public/Fonts/WEB/css/satoshi.css";
import "./globals.css";

export const metadata: Metadata = {
  title: "QRLab - Lag QR-koder enkelt",
  description: "Den enkleste måten å lage og administrere QR-koder på",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="no">
      <body className="font-sans" style={{ fontFamily: 'Satoshi-Variable, Satoshi-Regular, ui-sans-serif, system-ui, sans-serif' }} suppressHydrationWarning={true}>
        {children}
      </body>
    </html>
  );
}
