/* ==========================================================
   Refined Medical Aesthetics — shared chrome injector
   Injects: promo strip, header, mobile menu, footer,
            VIP popup, WhatsApp float, Chatbase widget
   Include this on EVERY page with <script defer src="refined-chrome.js"></script>
   ========================================================== */
(function () {
  var BOOK_URL = 'https://portal.aestheticnursesoftware.com/book-online/30956';
  var WA_URL   = 'https://wa.me/447583321635';

  var WA_SVG = '<svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/></svg>';

  var SUN_SVG  = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="12" r="4"/><line x1="12" y1="2" x2="12" y2="5"/><line x1="12" y1="19" x2="12" y2="22"/><line x1="2" y1="12" x2="5" y2="12"/><line x1="19" y1="12" x2="22" y2="12"/><line x1="4.5" y1="4.5" x2="6.7" y2="6.7"/><line x1="17.3" y1="17.3" x2="19.5" y2="19.5"/><line x1="4.5" y1="19.5" x2="6.7" y2="17.3"/><line x1="17.3" y1="6.7" x2="19.5" y2="4.5"/></svg>';
  var MOON_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M20 14.5A8 8 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>';

  var STAR_SVG = '<svg width="14" height="14" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/></svg>';

  // Outlined 24px stroke icons for the header (menu / account / cart). Search icon
  // intentionally removed — it duplicated the menu and visually competed with the
  // dark/light theme toggle on the right.
  var MENU_SVG    = '<svg viewBox="0 0 24 24" aria-hidden="true"><line x1="3" y1="7"  x2="21" y2="7"/><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="17" x2="21" y2="17"/></svg>';
  var ACCOUNT_SVG = '<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="8" r="4"/><path d="M4 21c0-4 4-6 8-6s8 2 8 6"/></svg>';
  var CART_SVG    = '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 7h12l-1.2 11.2a2 2 0 0 1-2 1.8H9.2a2 2 0 0 1-2-1.8L6 7z"/><path d="M9 7a3 3 0 0 1 6 0"/></svg>';

  // ---------- Remove legacy chrome that pages may have baked in ----------
  function killLegacy() {
    // Legacy popup, header, footer, whatsapp float, promo, menu overlay, klarna
    var selectors = [
      '#welcomePopup',
      '.popup-overlay',
      '.klarna-banner',
      '.klarna-strip',
      'body > header.header',
      'body > .header',
      '.menu-overlay',
      '#menuOverlay',
      '.mobile-menu',
      '#mobileMenu',
      'body > footer.footer',
      'body > .footer',
      '.whatsapp-float',
      '.promo-strip',
      // Belt-and-braces: nuke any legacy search icon that might still be in
      // a hardcoded inline header somewhere.
      '#refinedSearchBtn',
      '[aria-label="Search"]',
      '[aria-label="Open search"]'
    ];
    selectors.forEach(function (sel) {
      document.querySelectorAll(sel).forEach(function (el) { el.remove(); });
    });
  }

  // ---------- Inject theme CSS + chrome styles (one-time) ----------
  function injectChromeStyles() {
    if (document.getElementById('refined-chrome-styles')) return;
    var css = '' +
      /* Dark mode variable overrides — apply to whole site */
      'html[data-theme="dark"]{' +
        '--paper:#141210;' +
        '--tone:#1d1a17;' +
        '--ink:#f3ece0;' +
        '--ink-soft:#c9bfb0;' +
        '--accent-ink:#d4b894;' +
        '--accent-soft:#3a2f21;' +
        '--rule:rgba(243,236,224,0.14);' +
        '--color-charcoal:#f3ece0;' +
        '--color-white:#141210;' +
        '--color-gold:#d4b894;' +
        '--color-gold-dark:#b3976f;' +
        '--color-text:#c9bfb0;' +
        '--color-text-light:#a79b89;' +
        '--color-text-muted:#9a8e7c;' +
        '--color-bg:#141210;' +
        '--color-bg-alt:#1d1a17;' +
        '--color-cream:#141210;' +
        '--color-surface:#1a1714;' +
        '--color-surface-strong:#211d18;' +
        '--color-card:#1d1a17;' +
        '--color-border:rgba(243,236,224,0.14);' +
        'color-scheme:dark;' +
      '}' +
      'html[data-theme="dark"] body{ background:#141210 !important; color:var(--ink); }' +
      'html[data-theme="dark"] img:not([src*=".svg"]):not(.logo img):not(.wbco-prod__img img){ filter: brightness(.94); }' +
      'html[data-theme="dark"] .header{ background: rgba(20,18,16,0.96) !important; border-bottom-color:var(--rule); }' +
      'html[data-theme="dark"] .header, html[data-theme="dark"] .header *{ color:var(--ink); }' +
      'html[data-theme="dark"] .nav-desktop a{ color:var(--ink); }' +
      'html[data-theme="dark"] .header-book-pill{ background:var(--ink); color:#141210 !important; }' +
      'html[data-theme="dark"] .promo-strip{ background:#0f0d0b !important; color:#eadfcb !important; }' +
      'html[data-theme="dark"] .klarna-strip{ background:#1b1713; color:#f3ece0; border-bottom-color:var(--rule); }' +
      'html[data-theme="dark"] .klarna-strip b{ background:#ffa8cd; color:#0c0a08; }' +
      'html[data-theme="dark"] .mobile-menu{ background:#141210; color:var(--ink); }' +
      'html[data-theme="dark"] .mobile-menu a{ color:var(--ink); }' +
      'html[data-theme="dark"] .footer{ background:#0f0d0b !important; color:#eadfcb; }' +
      'html[data-theme="dark"] .footer a{ color:#eadfcb; }' +
      'html[data-theme="dark"] .wbco-feature__frame{ background:#1a1714; }' +
      'html[data-theme="dark"] .wbco-split__media, html[data-theme="dark"] .wbco-prod__img{ background:#1d1a17; }' +
      'html[data-theme="dark"] .btn-dark{ background:#f3ece0; color:#141210; }' +
      'html[data-theme="dark"] .wbco-feature__cta{ border-color:var(--ink); color:var(--ink); }' +
      'html[data-theme="dark"] .wbco-feature__cta:hover{ background:var(--ink); color:#141210; }' +
      'html[data-theme="dark"] .wbco-feature__badge{ background:#f3ece0; color:#141210; }' +
      'html[data-theme="dark"] .stat{ background:#1d1a17; }' +
      'html[data-theme="dark"] .panel{ background:#1a1714; }' +

      /* Klarna mini banner */
      '.klarna-strip{' +
        'display:flex; align-items:center; justify-content:center; gap:10px;' +
        'padding:6px 16px;' +
        'background:#fff4f9; color:#2a1f2c;' +
        'font-family:var(--font-body,-apple-system,system-ui,sans-serif);' +
        'font-size:11.5px; letter-spacing:.06em;' +
        'border-bottom:1px solid var(--rule,#e8e0d0);' +
        'text-align:center; line-height:1.3;' +
      '}' +
      '.klarna-strip b{' +
        'display:inline-block;' +
        'background:#ffa8cd; color:#0c0a08;' +
        'padding:2px 8px; border-radius:999px;' +
        'font-weight:600; letter-spacing:.04em;' +
      '}' +
      '.klarna-strip a{ color:inherit; text-decoration:underline; text-underline-offset:2px; }' +
      '@media (max-width: 520px){ .klarna-strip{ font-size:10.5px; padding:5px 10px; } }' +

      /* Theme toggle button — visible pill with icon + label */
      '.header-theme-toggle{' +
        'display:inline-flex; align-items:center; gap:6px; justify-content:center;' +
        'background:transparent; cursor:pointer;' +
        'height:34px; padding:0 12px;' +
        'color:var(--ink,#1F1812);' +
        'border:1px solid var(--rule,rgba(31,24,18,0.28));' +
        'border-radius:999px;' +
        'font-family:var(--font-body,-apple-system,system-ui,sans-serif);' +
        'font-size:10.5px; letter-spacing:.14em; text-transform:uppercase;' +
        'line-height:1;' +
        'transition: background .18s ease, color .18s ease, border-color .18s ease;' +
      '}' +
      '.header-theme-toggle:hover{ background:var(--ink,#1F1812); color:var(--paper,#F7F2EA); border-color:var(--ink,#1F1812); }' +
      '.header-theme-toggle svg{ width:14px; height:14px; fill:none; stroke:currentColor; stroke-width:1.7; stroke-linecap:round; stroke-linejoin:round; display:block; }' +
      '.header-theme-toggle .label{ display:inline-block; }' +
      'html[data-theme="dark"] .header-theme-toggle{ border-color:rgba(243,236,224,0.3); color:var(--ink); }' +
      'html[data-theme="dark"] .header-theme-toggle:hover{ background:var(--ink); color:#141210; border-color:var(--ink); }' +
      'html[data-theme="dark"] .header-theme-toggle .sun{ display:inline-flex; }' +
      'html[data-theme="dark"] .header-theme-toggle .moon{ display:none; }' +
      'html[data-theme="dark"] .header-theme-toggle .label::after{ content:"Light"; }' +
      'html:not([data-theme="dark"]) .header-theme-toggle .sun{ display:none; }' +
      'html:not([data-theme="dark"]) .header-theme-toggle .moon{ display:inline-flex; }' +
      'html:not([data-theme="dark"]) .header-theme-toggle .label::after{ content:"Dark"; }' +
      '@media (max-width: 720px){' +
        '.header-theme-toggle .label{ display:none; }' +
        '.header-theme-toggle{ width:32px; height:32px; padding:0; }' +
        '.header-theme-toggle svg{ width:13px; height:13px; }' +
      '}' +

      /* Header layout override — left-align logo, push controls to the right */
      '.header{ grid-template-columns: auto auto 1fr !important; }' +
      '.header .logo{ justify-self:start !important; }' +
      '.header__right{ justify-self:end; }' +
      '@media (max-width: 720px){' +
        '.header{ padding:10px 14px !important; gap:10px !important; }' +
        '.header__left, .header__right{ gap:10px !important; }' +
        '.header .logo{ gap:10px !important; }' +
        '.header .logo img{ width:36px !important; height:36px !important; }' +
        '.logo-text .refined{ font-size:16px !important; letter-spacing:0.14em !important; }' +
        '.logo-text .medical{ font-size:8px !important; letter-spacing:0.26em !important; margin-top:4px !important; }' +
        '.header-icon{ width:26px !important; height:26px !important; }' +
        '.header-icon svg{ width:20px !important; height:20px !important; }' +
      '}' +
      '@media (max-width: 420px){' +
        '.header__right .header-icon[aria-label="Account"]{ display:none !important; }' +
        '.logo-text .refined{ font-size:15px !important; letter-spacing:0.12em !important; }' +
        '.logo-text .medical{ font-size:7.5px !important; letter-spacing:0.22em !important; }' +
        '.header .logo img{ width:32px !important; height:32px !important; }' +
        '.header{ gap:8px !important; padding:10px 12px !important; }' +
      '}' +

      /* VIP popup — dark mode legibility, bulletproof via !important */
      'html[data-theme="dark"] .popup{ background:#1a1613 !important; border:0.5px solid rgba(243,236,224,0.18) !important; color:#f3ece0 !important; }' +
      'html[data-theme="dark"] .popup h2{ color:#f3ece0 !important; }' +
      'html[data-theme="dark"] .popup h2 span{ color:#d4b894 !important; }' +
      'html[data-theme="dark"] .popup-subtitle{ color:#d9cfbe !important; opacity:1 !important; }' +
      'html[data-theme="dark"] .popup-text{ color:#e4dccc !important; opacity:1 !important; }' +
      'html[data-theme="dark"] .popup-consent,' +
      'html[data-theme="dark"] .instagram-required{ color:#c9bfb0 !important; opacity:0.9 !important; }' +
      'html[data-theme="dark"] .popup-input{ color:#f3ece0 !important; border-bottom-color:rgba(243,236,224,0.35) !important; }' +
      'html[data-theme="dark"] .popup-input::placeholder{ color:rgba(243,236,224,0.45) !important; }' +
      'html[data-theme="dark"] .popup-btn{ background:#f3ece0 !important; color:#141210 !important; }' +
      'html[data-theme="dark"] .popup-btn:hover{ background:#d4b894 !important; color:#141210 !important; }' +
      'html[data-theme="dark"] .popup-close{ color:#d9cfbe !important; }' +
      'html[data-theme="dark"] .popup-badge{ color:#d4b894 !important; }' +
      'html[data-theme="dark"] .popup-rating{ color:#d4b894 !important; }' +
      'html[data-theme="dark"] .popup-rating span{ color:#c9bfb0 !important; }' +
      '';
    var style = document.createElement('style');
    style.id = 'refined-chrome-styles';
    style.textContent = css;
    document.head.appendChild(style);
  }

  function buildKlarnaStrip() {
    var el = document.createElement('div');
    el.className = 'klarna-strip';
    el.setAttribute('aria-label', 'Klarna available on treatments and skincare');
    el.innerHTML =
      '<b>Klarna</b>' +
      '<span>Pay in 3 interest-free instalments &mdash; on every treatment &amp; WBco order &middot; ' +
        '<a href="' + BOOK_URL + '" target="_blank" rel="noopener noreferrer">Book a treatment</a>' +
      '</span>';
    return el;
  }

  // ---------- Build chrome nodes ----------
  function buildPromo() {
    var items = [
      'Consultation-led · Nurse Rachel, NMC-registered',
      'Seaton Delaval · A short drive from Whitley Bay',
      '10% off your first visit — join the VIP list',
      'Free 2-week review on every treatment'
    ];
    var doubled = items.concat(items).map(function (t) {
      return '<span class="promo-strip__item">' + t + '</span>';
    }).join('');
    var el = document.createElement('div');
    el.className = 'promo-strip';
    el.setAttribute('aria-label', 'Clinic promotions');
    el.innerHTML = '<div class="promo-strip__track">' + doubled + '</div>';
    return el;
  }

  function buildHeader() {
    var header = document.createElement('header');
    header.className = 'header';
    header.innerHTML =
      // Left slot: menu icon (search removed — duplicate of menu)
      '<div class="header__left">' +
        '<button class="header-icon" type="button" aria-label="Open menu" id="refinedMenuBtn">' + MENU_SVG + '</button>' +
      '</div>' +

      // Center slot: circular logo + "REFINED / Medical Aesthetics" wordmark
      '<a href="./index.html" class="logo" aria-label="Refined Medical Aesthetics">' +
        '<img src="./images/logo-main.webp" alt="Refined Medical Aesthetics" onerror="this.src=\'https://refinedmedicalaesthetics.uk/images/logo-main.webp\'">' +
        '<div class="logo-text">' +
          '<span class="refined">Refined</span>' +
          '<span class="medical">Medical Aesthetics</span>' +
        '</div>' +
      '</a>' +

      // Right slot: theme toggle + account + cart icons + desktop Book pill
      '<div class="header__right">' +
        '<button class="header-theme-toggle" type="button" aria-label="Toggle dark mode" id="refinedThemeBtn">' +
          '<span class="moon">' + MOON_SVG + '</span>' +
          '<span class="sun">' + SUN_SVG + '</span>' +
          '<span class="label" aria-hidden="true"></span>' +
        '</button>' +
        '<a href="./contact.html" class="header-icon" aria-label="Account">' + ACCOUNT_SVG + '</a>' +
        '<a href="https://shop.refinedmedicalaesthetics.uk" class="header-icon" aria-label="Shop WBco" target="_blank" rel="noopener noreferrer">' + CART_SVG + '</a>' +
        '<a href="' + BOOK_URL + '" class="header-book-pill" target="_blank" rel="noopener noreferrer">Book Now</a>' +
      '</div>' +

      // Desktop nav row — positioned absolutely under the header grid at 960px+
      '<nav class="nav-desktop" aria-label="Primary">' +
        '<a href="./index.html">Home</a>' +
        '<a href="./about.html">About</a>' +
        '<a href="./treatments.html">Treatments</a>' +
        '<a href="./gallery.html">Gallery</a>' +
        '<a href="./testimonials.html">Reviews</a>' +
        '<a href="./wbco.html">Shop</a>' +
        '<a href="./faq.html">FAQ</a>' +
        '<a href="./contact.html">Contact</a>' +
      '</nav>';
    return header;
  }

  function buildMenuDrawer() {
    var overlay = document.createElement('div');
    overlay.className = 'menu-overlay';
    overlay.id = 'refinedMenuOverlay';

    var menu = document.createElement('nav');
    menu.className = 'mobile-menu';
    menu.id = 'refinedMobileMenu';
    menu.innerHTML =
      '<button class="mobile-menu-close" id="refinedMenuClose" aria-label="Close menu">&times;</button>' +
      '<a href="./index.html">Home</a>' +
      '<a href="./about.html">About</a>' +
      '<a href="./treatments.html">Treatments</a>' +
      '<a href="./gallery.html">Gallery</a>' +
      '<a href="./testimonials.html">Reviews</a>' +
      '<a href="./wbco.html">WBco Shop</a>' +
      '<a href="./contact.html">Contact</a>' +
      '<a href="./faq.html">FAQ</a>' +
      '<a href="' + BOOK_URL + '" class="book-now-btn" target="_blank" rel="noopener noreferrer">Book Now</a>';

    return [overlay, menu];
  }

  function buildFooter() {
    var footer = document.createElement('footer');
    footer.className = 'footer';
    footer.innerHTML =
      '<div class="footer-inner">' +
        '<div class="footer-brand">' +
          '<img src="./images/logo-main.webp" alt="" onerror="this.src=\'https://refinedmedicalaesthetics.uk/images/logo-main.webp\'">' +
          '<div>' +
            '<div class="refined">Refined</div>' +
            '<span class="medical">Medical Aesthetics</span>' +
          '</div>' +
        '</div>' +
        '<p class="footer-about">Nurse-led medical aesthetics studio in Seaton Delaval, serving Whitley Bay and coastal Northumberland.</p>' +
        '<div class="footer-cols">' +
          '<div class="footer-col">' +
            '<h4>Clinic</h4>' +
            '<a href="./index.html">Home</a>' +
            '<a href="./about.html">About Rachel</a>' +
            '<a href="./treatments.html">Treatments</a>' +
            '<a href="./gallery.html">Gallery</a>' +
            '<a href="./testimonials.html">Reviews</a>' +
            '<a href="./wbco.html">WBco Shop</a>' +
          '</div>' +
          '<div class="footer-col">' +
            '<h4>Visit</h4>' +
            '<a href="./contact.html">Contact</a>' +
            '<a href="./faq.html">FAQ</a>' +
            '<a href="' + BOOK_URL + '" target="_blank" rel="noopener noreferrer">Book online</a>' +
            '<a href="' + WA_URL + '" target="_blank" rel="noopener noreferrer">WhatsApp Rachel</a>' +
          '</div>' +
          '<div class="footer-col footer-contact">' +
            '<h4>Contact</h4>' +
            '<ul>' +
              '<li><strong>Visit</strong><span>Double Row, Seaton Delaval, NE25 0PP</span></li>' +
              '<li><strong>Call</strong><a href="tel:+447583321635">+44 7583 321 635</a></li>' +
              '<li><strong>Email</strong><a href="mailto:Refinedmedicalaesthetics3@gmail.com">Refinedmedicalaesthetics3@gmail.com</a></li>' +
            '</ul>' +
          '</div>' +
        '</div>' +
        '<div class="footer-bottom">' +
          '<p>© 2026 Refined Medical Aesthetics · NMC-registered</p>' +
          '<p>Website by Daniel &amp; Rachel · Refined Medical Aesthetics</p>' +
        '</div>' +
      '</div>';
    return footer;
  }

  function buildWhatsAppFloat() {
    // Safety net: remove any pre-existing .whatsapp-float (e.g. from a page that
    // still has a hardcoded copy in its HTML) so we never end up with duplicates.
    var existing = document.querySelectorAll('.whatsapp-float');
    for (var i = 0; i < existing.length; i++) {
      if (existing[i] && existing[i].parentNode) {
        existing[i].parentNode.removeChild(existing[i]);
      }
    }
    var a = document.createElement('a');
    a.href = WA_URL;
    a.className = 'whatsapp-float';
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.setAttribute('aria-label', 'WhatsApp Rachel');
    a.innerHTML = WA_SVG;
    return a;
  }

  function buildPopup() {
    var wrap = document.createElement('div');
    wrap.className = 'popup-overlay hidden';
    wrap.id = 'welcomePopup';
    wrap.innerHTML =
      '<div class="popup">' +
        '<button class="popup-close" onclick="closePopup()" aria-label="Close">&times;</button>' +
        '<div class="popup-badge">Exclusive VIP Offer</div>' +
        '<h2>Unlock <span>10% Off</span></h2>' +
        '<p class="popup-subtitle">Your first treatment</p>' +
        '<p class="popup-text">Join our VIP list for exclusive offers, skincare tips, and be the first to know about new treatments.</p>' +
        '<input type="email" id="popupEmail" class="popup-input" placeholder="your@email.com" autocomplete="email">' +
        '<p class="instagram-required">Offer excludes anti-wrinkle treatments. Consultation required.</p>' +
        '<p class="popup-consent">By subscribing, you agree to receive clinic updates and offers. You can unsubscribe at any time.</p>' +
        '<button class="popup-btn" onclick="submitPopupLead()">Claim my 10% off</button>' +
        '<p id="popupStatus" class="instagram-required" style="display:none;"></p>' +
        '<div class="popup-rating">' +
          STAR_SVG + STAR_SVG + STAR_SVG + STAR_SVG + STAR_SVG +
          '<span>Trusted by 500+ clients</span>' +
        '</div>' +
      '</div>';
    return wrap;
  }

  // ---------- Theme (dark / light) ----------
  function applyTheme(theme) {
    var root = document.documentElement;
    if (theme === 'dark') root.setAttribute('data-theme', 'dark');
    else root.removeAttribute('data-theme');
  }
  function getSavedTheme() {
    try {
      var saved = localStorage.getItem('refinedTheme');
      if (saved === 'dark' || saved === 'light') return saved;
    } catch (e) {}
    return null;
  }
  function initTheme() {
    // Apply saved theme as early as possible to avoid flash
    var saved = getSavedTheme();
    if (saved) applyTheme(saved);
  }
  function toggleTheme() {
    var current = document.documentElement.getAttribute('data-theme') === 'dark' ? 'dark' : 'light';
    var next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    try { localStorage.setItem('refinedTheme', next); } catch (e) {}
  }

  // ---------- Mount ----------
  function mount() {
    killLegacy();
    injectChromeStyles();

    var body = document.body;
    var first = body.firstChild;

    // Build pieces
    var popup = buildPopup();
    var klarna = buildKlarnaStrip();
    var promo = buildPromo();
    var header = buildHeader();
    var menuParts = buildMenuDrawer();

    // Desired visible order at top of page:
    //   1) Pink motion promo strip
    //   2) Klarna mini-banner (right underneath)
    //   3) Header
    // Insert by repeatedly inserting at the front, in REVERSE of the desired order,
    // so the final sequence is [promo, klarna, header, ...original content].
    body.insertBefore(popup, first);   // modal — position doesn't matter visually
    body.insertBefore(header, first);
    body.insertBefore(klarna, header);
    body.insertBefore(promo, klarna);

    body.appendChild(menuParts[0]); // overlay
    body.appendChild(menuParts[1]); // drawer

    // Append WhatsApp float + footer
    body.appendChild(buildFooter());
    body.appendChild(buildWhatsAppFloat());

    // Menu toggles
    var btn = document.getElementById('refinedMenuBtn');
    var overlay = document.getElementById('refinedMenuOverlay');
    var drawer = document.getElementById('refinedMobileMenu');
    var close = document.getElementById('refinedMenuClose');
    var themeBtn = document.getElementById('refinedThemeBtn');
    function open()  { drawer.classList.add('open');    overlay.classList.add('open'); }
    function shut()  { drawer.classList.remove('open'); overlay.classList.remove('open'); }
    if (btn) btn.addEventListener('click', open);
    if (overlay) overlay.addEventListener('click', shut);
    if (close) close.addEventListener('click', shut);
    if (themeBtn) themeBtn.addEventListener('click', toggleTheme);
    // Close when a drawer link is clicked
    drawer && drawer.querySelectorAll('a').forEach(function (a) { a.addEventListener('click', shut); });
  }

  // Apply theme immediately so it's set before the rest of the DOM paints
  initTheme();

  // ---------- Widget scripts (preserved verbatim behaviour) ----------
  function loadChatbaseWidget() {
    if (window.__chatbaseLoaded) return;
    window.__chatbaseLoaded = true;
    if (!window.chatbase || window.chatbase("getState") !== "initialized") {
      window.chatbase = function () {
        if (!window.chatbase.q) { window.chatbase.q = []; }
        window.chatbase.q.push(arguments);
      };
      window.chatbase = new Proxy(window.chatbase, {
        get: function (target, prop) {
          if (prop === "q") return target.q;
          return function () { return target.apply(null, [prop].concat(Array.prototype.slice.call(arguments))); };
        }
      });
    }
    var script = document.createElement('script');
    script.src = 'https://www.chatbase.co/embed.min.js';
    script.id = 'jAMCto1UDdE-Kj9x4HPao';
    script.domain = 'www.chatbase.co';
    document.body.appendChild(script);
  }

  function openPopup() {
    var popup = document.getElementById('welcomePopup');
    if (popup) popup.classList.remove('hidden');
  }
  function closePopup() {
    var popup = document.getElementById('welcomePopup');
    if (!popup) return;
    popup.classList.add('hidden');
    try { sessionStorage.setItem('popupClosedThisSession', 'true'); } catch (e) {}
    // Chatbase load now gated by Klaro functional consent — see refined-consent.js
  }
  function submitPopupLead() {
    var emailInput = document.getElementById('popupEmail');
    var status = document.getElementById('popupStatus');
    if (!emailInput || !status) return;
    var email = (emailInput.value || '').trim();
    if (!email || !/^\S+@\S+\.\S+$/.test(email)) {
      status.style.display = 'block';
      status.textContent = 'Please enter a valid email address.';
      return;
    }
    status.style.display = 'block';
    status.textContent = 'Submitting…';
    fetch('https://formsubmit.co/ajax/refinedmedicalaesthetics3@gmail.com', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({
        email: email,
        _subject: 'VIP Offer Signup - Refined Medical Aesthetics',
        source: 'Homepage popup',
        disclaimer: 'Offer excludes anti-wrinkle treatments.'
      })
    }).then(function () {
      status.textContent = 'Thanks — your VIP request has been received.';
      emailInput.value = '';
      setTimeout(closePopup, 1200);
    }).catch(function () {
      status.textContent = 'Thanks — please also DM us on Instagram to confirm your offer.';
    });
  }

  // Expose to window so inline onclick handlers work
  window.openPopup = openPopup;
  window.closePopup = closePopup;
  window.submitPopupLead = submitPopupLead;
  window.openMenu = function () {
    var d = document.getElementById('refinedMobileMenu');
    var o = document.getElementById('refinedMenuOverlay');
    if (d) d.classList.add('open'); if (o) o.classList.add('open');
  };
  window.closeMenu = function () {
    var d = document.getElementById('refinedMobileMenu');
    var o = document.getElementById('refinedMenuOverlay');
    if (d) d.classList.remove('open'); if (o) o.classList.remove('open');
  };
  window.toggleTheme = toggleTheme; // expose for any inline handlers

  // ---------- Auto-run ----------
  function boot() {
    mount();
    // Show popup once per fresh session.
    // Chatbase load is gated by Klaro functional consent — see refined-consent.js.
    try {
      if (sessionStorage.getItem('popupClosedThisSession') !== 'true') {
        setTimeout(openPopup, 900);
      }
    } catch (e) {
      setTimeout(openPopup, 900);
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
