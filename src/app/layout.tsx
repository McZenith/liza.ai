import "./globals.css";

// This minimal root layout delegates to [locale]/layout.tsx
// Required for Next.js App Router structure
export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
  }) {
  return children;
}
