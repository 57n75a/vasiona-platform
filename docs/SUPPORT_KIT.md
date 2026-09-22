# Supporter kit (`public/vasiona-support-kit.zip`)

A free, printable kit linked from the very bottom of `/crowdfund`, after the
interest-registration form. Built outside the Next.js build (it's a static
asset checked into `public/`), so updating it is a manual step, not part of
`npm run build`.

## What's inside

```
VASIONA-paket-za-podrsku/
  00-PROCITAJ-ME.txt        Bilingual README: contents, print tips, logo rules
  01-logo/                  Logo PNGs — transparent / white / dark bg, 600px web version
  02-brosura/                A4 brochure, 4 pages, sr + en
  03-plakat-i-flajer/       A3 + A4 poster, A5 flyer, sr + en — each with QR codes
  04-nalepnice/             A4 sticker sheet (12 × 55mm circles)
  05-qr-kodovi/             Standalone QR PNGs: home, /petition, /crowdfund, sr + en
  06-drustvene-mreze/       4 social posts × {Instagram, TikTok/Story, X, LinkedIn} JPGs
  07-tekstovi-za-objave/    Ready-made caption text, sr + en
```

Every QR code is generated from the *current* `vasiona.org` URLs and
verified by decoding it back before the kit is zipped — a code that doesn't
scan back to its own URL fails the build rather than shipping silently
broken.

## Regenerating it

The kit was built with a one-off script (not currently part of this repo's
source tree — it lived in the authoring environment). To rebuild it by hand:

1. Regenerate the logo PNGs from `public/vasiona-seal.png` (transparent,
   white-bg, dark-bg, 600px versions).
2. Regenerate QR codes for `https://vasiona.org`, `/petition`, `/crowdfund`
   (sr + `?lang=en`) — **verify each one decodes back to its URL** before
   using it in a print layout.
3. Rebuild the brochure/poster/flyer/sticker PDFs (print CSS, A4/A3/A5 at
   100% scale, no bleed — see the README's print tips for what installers
   need to know).
4. Re-export the four crowdfunding social posts from
   `docs/CROWDFUNDING_PLAN.md` § images as JPGs.
5. Zip the `VASIONA-paket-za-podrsku/` folder and overwrite
   `public/vasiona-support-kit.zip`.
6. Update `SUPPORT_KIT_SIZE_MB` in `lib/site.ts` to the new ZIP's size in MB
   (rounded) — this is only cosmetic (shown next to the download button) and
   safe to leave stale by a few MB, but keep it roughly honest.

## Content rules the kit follows (don't relax these on a refresh)

- Every page carries the "concept platform, not a government agency" note
  and, on the crowdfunding-related pages, "no payment is collected."
- Funding tiers are labeled illustrative — no promised rewards.
- The logo is never recolored or altered; rim text stays intact.
- Bilingual throughout (sr default, en alongside) — same as the rest of the site.

## Print specs (told to whoever prints it, via the README inside the kit)

- RGB, no bleed — fine for home/office printers and most copy shops.
- For professional offset printing (CMYK, 3mm bleed), that's a manual
  re-export, not something this kit currently includes — direct people to
  `info@vasiona.org`.
