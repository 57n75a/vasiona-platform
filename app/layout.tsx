import "./globals.css";

export const metadata = {
  title: "VASIONA — Satellite Orbiting / Орбитирање сателита",
  description:
    "Serbian satellite orbiting monitoring platform (hypothetical fee model). / Платформа за праћење орбитирања сателита изнад Србије (хипотетички модел накнада).",
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
