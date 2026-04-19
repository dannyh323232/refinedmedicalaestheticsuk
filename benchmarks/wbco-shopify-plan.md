# WBCo + Shopify Integration Plan for Refined Medical Aesthetics

_Last updated: 20 Mar 2026_

## 1. Objectives & Guardrails
- **Primary goal:** Add a conversion-focused retail layer that lets visitors buy WBCo brow + skin-prep essentials without leaving the Refined Medical Aesthetics site.
- **Secondary goals:** Reinforce professional trust, capture email/SMS for future promos, and cross-promote in-clinic brow/lash services.
- **Compliance:** Stick to cosmetic claims only (frame as styling, hydration, hold, definition). Always mention suitability checks/patch testing for sensitive skin and defer to professional advice for medical concerns.

## 2. Section Plan for `index.html`
| Section | Purpose | Shopify/WBCo Requirements | CRO Notes |
| --- | --- | --- | --- |
| **Hero Split: "Clinic Brows, At-Home Finish"** | Introduce partnership + show Soap Brows hero shot next to Rachel delivering treatment. | Shopify buy button for featured SKU + mini badge "Fulfilled by WBCo • Ships in 2-4 days". | Reuse existing hero above the fold but add Buy Now + "Book Brow Lift" dual CTAs to capture both product and service demand. |
| **"Finish Your Fresh-Face Routine" Carousel** | Showcase 3-4 curated Brow/Prep combos. | Use Shopify collection component filtered to `tag:wbco-featured`. Each card shows image, £ price, star badge, "Add to Bag". | Add toggle chips (Hydrate, Define, Hold) that filter to corresponding product handles for quick discovery. |
| **Routine Builder (Quiz-Lite)** | Light decision tool that moves shoppers into email flow. | Form posts to Klaviyo/Shopify Flow with quiz answers; returns recommended SKU IDs for dynamic embed. | Copy emphasises pro tips ("Combo skin? Mist first, soap second"). Offer 10% off first cart completion. |
| **Education Strip "Why Rachel stocks WBCo"** | Trust section with 3 bullet pillars (Performance, Vegan, Clinic-approved). | Pull static content; no Shopify dependency except optional `Learn more` link to /treatments. | Keep claims factual: hold time, vegan waxes, UK-made. |
| **UGC/Testimonial Reel** | Social proof using existing patient brow shots + UGC from WBCo (with permission). | Use Shopify `product-reviews` app embed filtered to WBCo tags or manual slider with quote + product link. | CTA: "Tap to shop the exact kit" linking to product anchor IDs. |
| **Service Cross-Sell Banner** | Tie retail to booking ("Need help mastering the lamination look? Book a Brow Design."). | Shopify button anchors to booking widget; include product handle as referral code for analytics. | Adds reassurance that pro support exists if home use feels daunting. |

## 3. Featured Product Placeholders (3–6)
Use these handles/ids once WBCo SKUs are synced through Shopify. Update imagery alt text to stay ASA compliant.

1. **`wbco-soap-brows-pro`** — Soap Brows® Pro Palette (extra hold for laminated effect).
2. **`wbco-brow-pen-feather`** — Brow Pen FeatherTouch (micro-fine hair strokes).
3. **`wbco-prep-mist-reset`** — Prep & Reset Mist (pH-balancing hydration pre-makeup).
4. **`wbco-brow-mate-set`** — Brow Setter + Dual-Ended Brush kit (travel-ready finishing).
5. **`wbco-precision-pencil`** — Precision Pencil (ash brown universal tone) — optional swap if only four SKUs initially.
6. **`wbco-skin-shield`** — Skin Shield Balm (protective layer pre-treatment) — include only if Shopify feed surfaces it; otherwise keep as placeholder.

_Fallback plan:_ If any SKU is out-of-stock, auto-hide via Shopify conditions and show a waitlist badge that feeds email capture.

## 4. CTA & Funnel Strategy
- **Primary CTAs:** "Add to Bag" (Shopify buy button) + "Book Brow Styling" (clinic booking). Always paired when above the fold to serve both DIY and service intent.
- **Secondary CTAs:** "View Routine Guide", "Take the 60-second brow quiz", "Join waitlist".
- **Microcopy examples:**
  - "Patch test on a small area 24h before full brow application."
  - "Need a pro finish? Rachel can apply your kit in-clinic so you can mirror it at home."
  - "Orders ship from WBCo’s Durham facility — tracked within 24h." (verify when fulfilment confirmed).
- **Promotion hooks:** Bundle incentive ("Save 10% when you pair Soap Brows + Brow Pen"), loyalty reminder ("Every retail purchase earns treatment credit").

## 5. Exact HTML Snippet (drop-in for `index.html`)
```html
<section id="wbco-integration" class="section section--tight bg-cream">
  <div class="container grid grid--2">
    <div class="content">
      <p class="eyebrow">Clinic Approved Retail</p>
      <h2>Finish your Refined glow with WBCo essentials</h2>
      <p>Rachel curates vegan, dermatologically tested brow heroes so you can refresh your shape between appointments. Patch test 24 hours before first use.</p>
      <div class="cta-pair">
        <a class="btn btn--primary" href="/products/wbco-soap-brows-pro" data-shopify="buy-button">Add Soap Brows® Pro</a>
        <a class="btn btn--ghost" href="#book-brow" data-scroll>Book Brow Styling</a>
      </div>
    </div>
    <div class="product-cards">
      <article class="card" data-product-handle="wbco-soap-brows-pro">
        <img src="/images/wbco-soap-brows-pro.jpg" alt="WBCo Soap Brows Pro kit" loading="lazy" />
        <h3>Soap Brows® Pro Palette</h3>
        <p>Flexible hold that keeps laminated brows lifted for up to 12 hours.</p>
        <span class="price">£22</span>
        <a class="btn btn--sm" href="/products/wbco-soap-brows-pro">Add to Bag</a>
      </article>
      <article class="card" data-product-handle="wbco-brow-pen-feather">
        <img src="/images/wbco-brow-pen.jpg" alt="WBCo Brow Pen FeatherTouch" loading="lazy" />
        <h3>Brow Pen FeatherTouch</h3>
        <p>Micro-fine tip for hair-like definition that lasts through busy shifts.</p>
        <span class="price">£18</span>
        <a class="btn btn--sm" href="/products/wbco-brow-pen-feather">Add to Bag</a>
      </article>
      <article class="card" data-product-handle="wbco-prep-mist-reset">
        <img src="/images/wbco-prep-mist.jpg" alt="WBCo Prep &amp; Reset Mist" loading="lazy" />
        <h3>Prep &amp; Reset Mist</h3>
        <p>Hydrating mist to prep skin before Soap Brows or calm after treatments.</p>
        <span class="price">£16</span>
        <a class="btn btn--sm" href="/products/wbco-prep-mist-reset">Add to Bag</a>
      </article>
    </div>
  </div>
  <div class="note">
    <small>Orders are fulfilled by WBCo. For sensitivities or skin conditions, please consult Rachel before use.</small>
  </div>
</section>
```

### Implementation Tips
- Add Shopify Buy Button script globally once; reuse data attributes (`data-product-handle`) for dynamic price/inventory pulls.
- Lazy-load images to preserve page speed; ensure alt text remains descriptive but non-medical.
- Track clicks separately for "Add to Bag" vs "Book" using GA4 custom events to measure incremental retail revenue.

## 6. Next Steps Checklist
1. Confirm WBCo x Refined reseller agreement + fulfilment SLA for shipping copy.
2. Sync selected SKUs into Shopify with `wbco-` prefix handles.
3. Capture product photography in Refined’s clinic aesthetic (neutral background) for consistency.
4. QA buy buttons in staging, ensuring VAT + shipping rules mirror existing store.
5. Train Rachel/team on replenishment triggers and how to answer DMs about at-home application safety.

---
This plan gives a practical, conversion-ready structure while staying within cosmetic claim guidelines and keeping the code snippet ready for immediate insertion into `index.html` once products sync from Shopify.
