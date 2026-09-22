import "./globals.css";
import { SITE_URL } from "@/lib/site";

const TITLE = "VASIONA — Satellite Orbiting / Орбитирање сателита";
const DESCRIPTION =
  "Serbian satellite orbiting monitoring platform (hypothetical fee model). / Платформа за праћење орбитирања сателита изнад Србије (хипотетички модел накнада).";

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: TITLE,
  description: DESCRIPTION,
  openGraph: {
    title: TITLE,
    description: DESCRIPTION,
    url: SITE_URL,
    siteName: "VASIONA",
    type: "website",
    images: ["/vasiona-seal.png"],
  },
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  // Individual pages set the actual content language via ?lang=; this root
  // tag defaults to English since it wraps both locales.
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
