# jgoehle.com

Static marketing site for John Goehle's professional ASC books —
*The Survey Guide for ASCs* and *Ambulatory Surgery Center Governance*.

## Hosting

- Hosted on **Netlify**, deployed automatically from this repository's `main` branch.
- **Build command:** none (plain static HTML/CSS)
- **Publish directory:** `.` (repository root)
- Configuration lives in `netlify.toml`.

## Structure

```
index.html            Home page
survey-guide.html     The Survey Guide for ASCs
asc-governance.html   ASC Governance
about.html            About John Goehle
contact.html          Contact + notify-list form (Netlify Forms)
thank-you.html        Post-submit confirmation
404.html              Not-found page
css/styles.css        All styling
assets/               Book covers, author photo, favicon
netlify.toml          Netlify settings & headers
_redirects            Short-URL redirects
robots.txt, sitemap.xml
```

## Editing

Change the files and push to `main` — Netlify rebuilds and publishes automatically.
