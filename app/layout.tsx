import "./globals.css";

export const metadata = {
  title: "VASIONA — Air & Space Overflight Monitor / Монитор прелета",
  description:
    "Serbian air & space overflight monitoring platform (hypothetical fee model). / Платформа за праћење прелета изнад Србије (хипотетички модел накнада).",
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
