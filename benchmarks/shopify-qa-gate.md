# Shopify QA Gate — Refined Medical Aesthetics (2026-03-21)

## Fail List (action required before publish)

| Area | Severity | Issue | Evidence | Exact Fix |
| --- | --- | --- | --- | --- |
| Hero (Rachel prominence & CTA) | Critical | Hero shows a generic stock image with no visual of Rachel and no CTA button, so visitors never see the clinic lead or know what action to take on load. | `section template--20931397386453__hero_p9CmMG` renders only `<h1>` + paragraph; there is no `<a>` button and the image source is `/files/healthcare-minimal-4.jpg`. | Replace hero media with a professional portrait of Rachel (desktop & mobile crops) and add a primary CTA button ("Book a Consultation" → `/pages/contact` or booking link) beneath the paragraph using the section's button block. Ensure button uses the primary color token for contrast. |
| Hero (WBco co-branding) | Major | WBco is never referenced visually in the hero (only deep in nav), so the partnership is invisible. | No WBco logo asset or copy appears in hero markup. | Add a secondary badge row in the hero (e.g., `group-block` with WBco logo SVG + "Exclusive WBco stockist") positioned under the main headline. Use a max-height of 48px for the logo to keep hierarchy consistent. |
| Navigation clarity | Major | Primary navigation lacks an in-clinic services/booking link; users only see ecommerce destinations (Home, Shop, WBco, About, Contact). | Header menu list (`menu-list__link-title`) has no "Treatments"/"Book" entry. | Add a "Treatments" item (→ `/treatments` or `/pages/about-refined#treatments`) and a contrasting "Book" CTA in the right action cluster. On mobile drawer, pin "Book" as a styled button at the top. |
| CTA hierarchy in mid-page sections | Major | Three consecutive sections use indistinguishable "Shop now" CTAs pointing to `/collections/all`, causing banner blindness and no contextual action (e.g., tailored solutions should book, not shop). | Sections `product_list_themegen`, `media_with_content_xMM9EF`, `media_with_content_nrnzPh` all link to `/collections/all` with identical button text. | Reassign CTAs: Featured products → "Shop WBco" (`/pages/wbco-shop`), Tailored solutions → "Book a skin plan" (`/pages/contact`), Artistry section → "See in-clinic treatments" (`/treatments`). Use alternating button styles (solid vs outline) to reintroduce hierarchy. |
| Mobile readability (hero copy) | Major | Hero heading + paragraph render center-aligned over busy photography with dark text (`var(--color-foreground-heading)` ≈ #0a0f0e), causing low contrast on mobile where overlay opacity is only 0.75. | `overlay--solid` uses `--overlay-color: #0303033b` (23% black). Text color inherits dark foreground. | Switch hero text color to light token (`var(--color-foreground-on-dark)`) and increase overlay opacity to ≥0.65 black for mobile (`@media (max-width: 749px)`). Alternatively, add a solid background pill behind copy. |
| Product cards (redundant titles) | Minor | Each card repeats the product name twice (h3 + h5) before price, pushing price below the fold on mobile and cluttering scanning. | Example: `product-card__content` renders `h3` and downstream text-block `<h5>` with identical copy. | Remove the custom `text-block--Ab1d...` element so only the semantic card title remains, allowing the price block to sit directly beneath. |
| Footer social links | Major | Social icons point to Shopify corporate accounts (Instagram, TikTok, etc.) instead of Refined Medical Aesthetics, breaking brand trust. | Footer markup shows `href="https://www.instagram.com/shopify"`, etc. | Swap URLs for actual clinic accounts. If accounts are not ready, hide the icons until brand handles exist. |
| Email signup compliance | Minor | Footer email form lacks any consent or privacy microcopy; UK clinic collecting medical-related info requires explicit consent mention. | `email-signup__form` has no `small` text referencing privacy policy. | Add a subtext line "By subscribing you agree to receive clinic updates and can unsubscribe anytime. Read our [privacy policy](/policies/privacy-policy)." right under the input group. |

## Pass List (observed strengths)

- **Announcement bar clarity** — "Nurse-led clinic favourites now in shop" instantly communicates USP; leave as-is.
- **Sticky header implementation** — Header stays fixed with clear account/cart icons and accessible "Skip to content" link; no action needed.
- **Product imagery quality** — Featured products use consistent 4:5 imagery and quick-add works with animation; acceptable for launch.

---
Prepared by: Shopify QA Gate Subagent (shopify-qa-gate)
Date: 21 Mar 2026
