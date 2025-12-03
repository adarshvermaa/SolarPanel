# Launch Checklist

## Infrastructure & Hosting
- [ ] **SSL/TLS**: Verify HTTPS is active and valid.
- [ ] **Domain**: Ensure DNS propagates correctly.
- [ ] **CDN**: Verify assets are cached (Vercel/Cloudflare).
- [ ] **Environment**: Check production environment variables.

## SEO & Metadata
- [ ] **Meta Tags**: Verify Title, Description on all pages.
- [ ] **OG Tags**: Verify social sharing previews (Facebook, Twitter/X).
- [ ] **Sitemap**: Ensure sitemap.xml is generated and accessible.
- [ ] **Robots.txt**: Verify crawl rules.
- [ ] **Canonical**: Check canonical URLs.

## Accessibility & Quality
- [ ] **A11y Audit**: Run full accessibility scan (axe-core).
- [ ] **Cross-Browser**: Test on Chrome, Firefox, Safari, Edge.
- [ ] **Mobile**: Verify responsiveness on iOS and Android.
- [ ] **404 Page**: Custom 404 page is working.

## Analytics & Compliance
- [ ] **Analytics**: GA4 receiving data.
- [ ] **Privacy**: Cookie consent banner working.
- [ ] **Legal**: Privacy Policy and Terms pages accessible.

## Security
- [ ] **Headers**: Check security headers (HSTS, CSP, X-Frame-Options).
- [ ] **Validation**: Verify form inputs are sanitized.
- [ ] **Rate Limiting**: Ensure API routes are protected.

## Operations
- [ ] **Backups**: Database backup schedule confirmed.
- [ ] **Monitoring**: Sentry/LogRocket setup for error tracking.
- [ ] **Alerts**: Uptime monitoring (Pingdom/UptimeRobot) active.

## Post-Launch
- [ ] **Smoke Test**: Manual verification of critical flows immediately after launch.
- [ ] **Monitor**: Watch error logs closely for 24 hours.
