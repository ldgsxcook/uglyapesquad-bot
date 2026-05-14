import "./globals.css";

export const metadata = {
  title: "UAS v2 Command Center",
  description: "Ultimate Ape Society v2 holder dashboard"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
