/* ---------------------------------------------------------------------------
   Shared analytics layer for the Goehle site portfolio.

   Deliberately vendor-neutral: nothing below names Umami except the one
   adapter in send(). To switch providers later, change send() and the script
   tag in the page head — every event definition here stays as it is.

   Privacy rules this file follows, so the sites' privacy policies stay true:
     - no cookies, no localStorage, no fingerprinting
     - never send anything a visitor typed (no search terms, emails, messages)
     - only coarse, non-identifying facts: which link, which platform, which
       plan, which score band
   ------------------------------------------------------------------------- */
(function () {
  'use strict';

  // --- adapter -------------------------------------------------------------
  function send(name, data) {
    try {
      if (window.umami && typeof window.umami.track === 'function') {
        data ? window.umami.track(name, data) : window.umami.track(name);
      }
    } catch (e) { /* analytics must never break the page */ }
  }

  // Expose a stable name so page-level code (the AHS assessment, the podcast
  // archive) can fire events without knowing the vendor.
  window.track = send;

  // --- helpers -------------------------------------------------------------
  var PORTFOLIO = ['jgoehle.com', 'johngoehle.com', 'goehle.net', 'ah-strategies.com',
                   'egd-consulting.com', 'ascpodcast.com', 'foxmeadowgoldens.com'];

  function hostOf(href) {
    try { return new URL(href, location.href).hostname.replace(/^www\./, ''); }
    catch (e) { return ''; }
  }

  function isPortfolio(host) {
    for (var i = 0; i < PORTFOLIO.length; i++) {
      if (host === PORTFOLIO[i] || host.indexOf('.' + PORTFOLIO[i]) > -1) return true;
    }
    return false;
  }

  function platformOf(host) {
    if (host.indexOf('podcasts.apple.com') > -1) return 'apple';
    if (host.indexOf('open.spotify.com') > -1) return 'spotify';
    if (host.indexOf('podbean.com') > -1) return 'podbean';
    return '';
  }

  // --- one delegated listener for every outbound/interesting click ---------
  document.addEventListener('click', function (ev) {
    var a = ev.target && ev.target.closest ? ev.target.closest('a') : null;
    if (!a) return;
    var href = a.getAttribute('href') || '';
    if (!href) return;

    // contact intent
    if (href.indexOf('mailto:') === 0) return send('email_click');
    if (href.indexOf('tel:') === 0) return send('phone_click');

    var host = hostOf(href);
    if (!host || host === location.hostname.replace(/^www\./, '')) return;

    // book sales
    if (host.indexOf('amazon.') > -1) {
      return send('amazon_click', { page: location.pathname });
    }
    // podcast listening
    var platform = platformOf(host);
    if (platform) {
      return send('podcast_platform_click', { platform: platform });
    }
    // membership / patron funnel on ASC Central
    if (host.indexOf('asc-central.com') > -1) {
      var plan = /patron/i.test(href) ? 'patron'
               : /279136/.test(href) ? 'premium'
               : /memberships/i.test(href) ? 'compare' : 'other';
      return send('membership_click', { plan: plan });
    }
    // Fox Meadow's third-party proof
    if (host.indexOf('gooddog.com') > -1) return send('gooddog_click');
    if (host.indexOf('facebook.com') > -1) return send('facebook_click');

    // movement between John's own sites
    if (isPortfolio(host)) {
      return send('cross_site_click', { to: host });
    }
    send('outbound_click', { to: host });
  }, true);

  // --- form intent ---------------------------------------------------------
  // Fired on submit. Actual delivery is confirmed by the thank-you page below,
  // so a drop between the two numbers means submissions are failing.
  document.addEventListener('submit', function (ev) {
    var f = ev.target;
    if (!f || f.tagName !== 'FORM') return;
    send('form_submit', { form: f.getAttribute('name') || 'unnamed',
                          page: location.pathname });
  }, true);

  // --- confirmed conversions ----------------------------------------------
  document.addEventListener('DOMContentLoaded', function () {
    var p = location.pathname.replace(/\/$/, '');
    if (/thank-you-urgent$/.test(p)) send('urgent_request_success');
    else if (/thank-you$/.test(p)) send('contact_success');
  });
})();
