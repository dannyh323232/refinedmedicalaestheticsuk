/* ═══════════════════════════════════════════════════════════════════════════
 *  refined-consent.js
 *  Cookie consent + (later) GTM gating for refinedmedicalaesthetics.uk
 *  Built on Klaro (https://github.com/kiprotect/klaro) — open-source, BSD-3.
 *  Self-hosted (no third-party CDN).  Klaro v0.7.x compatible.
 *  Last updated: 2026-04-27
 *
 *  WHAT THIS FILE DOES
 *  ───────────────────
 *  • Loads the Klaro consent library (self-hosted /klaro.js + /klaro.css).
 *  • Configures four consent categories: essential, analytics, advertising,
 *    functional.
 *  • Until the user accepts a category, NOTHING in that category fires.
 *  • Google Consent Mode v2 is set to deny-by-default before GTM loads,
 *    then updated as the user makes choices.
 *  • If GTM_CONTAINER_ID is set to a real value (not the placeholder),
 *    GTM is bootstrapped automatically.
 *  • Chatbase widget loads only after "functional" consent.
 *
 *  HOW TO USE
 *  ──────────
 *  Add this single line to <head> on every page:
 *
 *      <script defer src="/refined-consent.js"></script>
 *
 *  No other code changes needed.  Pixel ID, Google Ads ID, GA4 ID, etc.
 *  all live INSIDE the GTM container — not in this file.
 *
 *  ⚠️ WHEN YOU HAVE THE GTM CONTAINER ID:
 *  ───────────────────────────────────────
 *  Replace GTM_CONTAINER_ID below with the real value (e.g. 'GTM-ABC1234'),
 *  push the one-line change, and GTM starts loading automatically. Until
 *  then, the banner shows + Chatbase is gated, but no GTM is loaded.
 * ═══════════════════════════════════════════════════════════════════════════ */

(function () {
  'use strict';

  // ────────────────────────────────────────────────────────────────────────
  //  Replace this with your real GTM container ID. The placeholder
  //  literally must equal 'GTM-XXXXXXX' for the GTM bootstrap to be skipped.
  // ────────────────────────────────────────────────────────────────────────
  var GTM_CONTAINER_ID = 'GTM-TV6HBT2V';
  var GTM_CONFIGURED   = GTM_CONTAINER_ID && GTM_CONTAINER_ID !== 'GTM-XXXXXXX';

  // ────────────────────────────────────────────────────────────────────────
  //  Klaro configuration
  // ────────────────────────────────────────────────────────────────────────
  window.klaroConfig = {
    version: 1,
    elementID: 'klaro',
    storageMethod: 'cookie',
    cookieName: 'klaro',
    cookieExpiresAfterDays: 120,
    privacyPolicy: '/privacy-policy',
    default: false,
    mustConsent: false,
    acceptAll: true,
    hideDeclineAll: false,
    hideLearnMore: false,
    noticeAsModal: false,
    htmlTexts: false,
    embedded: false,
    groupByPurpose: true,
    lang: 'en-GB',

    translations: {
      'en-GB': {
        consentNotice: {
          title: '',
          description: 'We use cookies for analytics and ads. {privacyPolicy}.',
          changeDescription: 'Choices changed — please review.',
          learnMore: 'Manage',
          imprint: { name: 'Imprint' },
        },
        consentModal: {
          title: 'Cookie preferences',
          description: 'Strictly-necessary cookies are always on because the site can\'t work without them. Choose what else to allow. You can change your mind any time on our /cookie-policy page.',
        },
        privacyPolicyUrl: '/privacy-policy',
        privacyPolicy: { name: 'privacy policy', text: 'Read more in our {privacyPolicy}.' },
        purposes: {
          essential:   { title: 'Strictly necessary', description: 'Required for the site to work — remembers your cookie preferences and theme choice. Always on.' },
          analytics:   { title: 'Analytics',          description: 'Helps us understand how the site is used so we can improve it. Aggregated and anonymised.' },
          advertising: { title: 'Advertising',        description: 'Lets us show you relevant adverts on Facebook, Instagram and Google after you\'ve visited our site, and measure whether our adverts work.' },
          functional:  { title: 'Functional',         description: 'Powers extras like the on-site chat assistant. Not essential, but enhances the experience.' },
        },
        acceptAll: 'Accept all',
        acceptSelected: 'Save choices',
        decline: 'Decline all',
        ok: 'Accept all',
        save: 'Accept all',
        close: 'Close',
        poweredBy: '',
        service: {
          disableAll: { title: 'Enable / disable all', description: 'Toggle every category at once.' },
          required:   { title: 'Always required',      description: 'This service is always on — the site can\'t work without it.' },
          purpose:    'Purpose',
          purposes:   'Purposes',
        },
        contextualConsent: { description: 'Do you want to load external content from {title}?', acceptAlways: 'Always', acceptOnce: 'Yes' },
      },
    },

    services: [
      // ─────────────────────────────── ESSENTIAL ─────────────────────────────
      {
        name: 'klaro',
        title: 'Cookie preferences',
        purposes: ['essential'],
        required: true,
        translations: {
          'en-GB': { description: 'Stores your cookie preferences for 120 days so we don\'t ask on every page.' },
        },
      },

      // ─────────────────────────────── ANALYTICS ─────────────────────────────
      {
        name: 'google-analytics',
        title: 'Google Analytics 4',
        purposes: ['analytics'],
        cookies: [/^_ga.*$/, /^_gid$/, /^_gat.*$/],
        translations: {
          'en-GB': { description: 'Aggregated, privacy-respecting analytics — measurement ID G-5JSFZX11H2.' },
        },
        callback: function (consent) { gtmConsentUpdate('analytics_storage', consent); },
      },

      // ─────────────────────────────── ADVERTISING ───────────────────────────
      {
        name: 'meta-pixel',
        title: 'Meta Pixel (Facebook + Instagram)',
        purposes: ['advertising'],
        cookies: [/^_fbp$/, /^_fbc$/],
        translations: {
          'en-GB': { description: 'Lets us show you relevant adverts on Facebook and Instagram, and measure ad performance.' },
        },
        callback: function (consent) {
          gtmConsentUpdate('ad_storage', consent);
          gtmConsentUpdate('ad_user_data', consent);
          gtmConsentUpdate('ad_personalization', consent);
        },
      },
      {
        name: 'google-ads',
        title: 'Google Ads',
        purposes: ['advertising'],
        cookies: [/^_gcl_.*$/, /^_gac_.*$/],
        translations: {
          'en-GB': { description: 'Lets us measure Google ad performance and re-target previous visitors.' },
        },
        callback: function (consent) {
          gtmConsentUpdate('ad_storage', consent);
          gtmConsentUpdate('ad_user_data', consent);
          gtmConsentUpdate('ad_personalization', consent);
        },
      },

      // ─────────────────────────────── FUNCTIONAL ────────────────────────────
      {
        name: 'chatbase',
        title: 'Chatbase chat assistant',
        purposes: ['functional'],
        translations: {
          'en-GB': { description: 'Powers the on-site chat. Conversations are processed by Chatbase to provide responses.' },
        },
        onAccept: function () {
          if (typeof window.loadChatbaseWidget === 'function') {
            window.loadChatbaseWidget();
          }
        },
      },
    ],
  };

  // ────────────────────────────────────────────────────────────────────────
  //  Google Consent Mode v2 — deny by default until consent is given.
  // ────────────────────────────────────────────────────────────────────────
  window.dataLayer = window.dataLayer || [];
  function gtag() { dataLayer.push(arguments); }
  window.gtag = gtag;

  gtag('consent', 'default', {
    ad_storage: 'denied',
    ad_user_data: 'denied',
    ad_personalization: 'denied',
    analytics_storage: 'denied',
    functionality_storage: 'denied',
    personalization_storage: 'denied',
    security_storage: 'granted',
    wait_for_update: 500,
  });

  function gtmConsentUpdate(type, granted) {
    var update = {};
    update[type] = granted ? 'granted' : 'denied';
    gtag('consent', 'update', update);
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Conditionally bootstrap GTM (only if a real container ID is set).
  // ────────────────────────────────────────────────────────────────────────
  if (GTM_CONFIGURED) {
    (function (w, d, s, l, i) {
      w[l] = w[l] || [];
      w[l].push({ 'gtm.start': new Date().getTime(), event: 'gtm.js' });
      var f = d.getElementsByTagName(s)[0],
          j = d.createElement(s),
          dl = l !== 'dataLayer' ? '&l=' + l : '';
      j.async = true;
      j.src = 'https://www.googletagmanager.com/gtm.js?id=' + i + dl;
      j.setAttribute('data-cfasync', 'false');
      f.parentNode.insertBefore(j, f);
    })(window, document, 'script', 'dataLayer', GTM_CONTAINER_ID);
  }

  // ────────────────────────────────────────────────────────────────────────
  //  Load Klaro itself (CSS + JS), self-hosted at site root.
  // ────────────────────────────────────────────────────────────────────────
  function loadAsset(tag, attrs) {
    var el = document.createElement(tag);
    Object.keys(attrs).forEach(function (k) { el.setAttribute(k, attrs[k]); });
    document.head.appendChild(el);
    return el;
  }

  loadAsset('link',   { rel: 'stylesheet', href: '/klaro.css' });
  loadAsset('link',   { rel: 'stylesheet', href: '/refined-consent.css' });
  loadAsset('script', { src: '/klaro.js', defer: 'defer', 'data-cfasync': 'false' });
})();
