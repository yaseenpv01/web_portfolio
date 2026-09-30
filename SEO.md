# Search visibility for Muhammed Yaseen

## Implemented

- Name-first title and visible H1, with Flutter / Android engineering and Dubai in natural copy.
- Consistent canonical URLs and social metadata, including a locally served 1200 × 630 sharing image.
- Linked `WebSite`, `ProfilePage`, and `Person` JSON-LD using only established identity, employment, education and skills. Social profile links identify the same person; no fabricated reviews, ratings or credentials.
- Three static, internally linked project pages: INAXUS, FGIC Attendance and Local AI Document Parser. Unique copy, titles, descriptions, canonical URLs and breadcrumb structured data.
- Four canonical URLs in the XML sitemap. Update `lastmod` only when substantive page content changes; it is not automatically refreshed on every deployment.
- Vercel permanent redirects for www, `/index.html`, the older résumé URL, and obsolete template pages.
- The current CV remains downloadable. Its Vercel `X-Robots-Tag: noindex` header asks search engines to show the profile pages rather than the PDF as a competing search result. This is indexing guidance, not access restriction.
- The homepage and all project content remain readable without JavaScript. Animation and WebGL do not carry the essential information.

## One-time Google Search Console setup

1. Open https://search.google.com/search-console/ in your own Google account.
2. Add a **Domain property** for `yaseenmuhammed.com` if it is not already verified. Add the exact DNS TXT record Google provides through the domain’s DNS provider. Keep that record after verification.
3. Alternatively, use a URL-prefix property for `https://yaseenmuhammed.com/` and its HTML-tag verification method. The real `google-site-verification` value must come from your account; it must not be invented. Add that tag to the homepage head and deploy, then verify.
4. Submit `https://yaseenmuhammed.com/sitemap.xml` in Sitemaps.
5. Inspect the homepage and the three project URLs. Run the live URL test and request indexing once for each. Repeated requests do not speed up crawling.
6. Review Page indexing for errors and canonical selection. Watch Performance → Search results for impressions, clicks, CTR and average position.

Account verification and indexing submissions have not been performed by this code change. No tracking/analytics service has been added.

## Branded-search priorities

Monitor real queries such as `Muhammed Yaseen`, `Muhammed Yaseen PV`, `Muhammed Yaseen Flutter`, and `Muhammed Yaseen Dubai`. The short name is shared by other people; the full name, role, location, work and consistent profile links help distinguish this portfolio.

Use the same display name and domain on your own LinkedIn, GitHub and X profiles. Add the website to the profile URL fields. No external profiles were changed automatically. Genuine relevant links from your employer, project credits or technical work can help people discover the site; avoid purchased links and mass directory submissions.

Publish original technical project notes only when you can provide useful first-hand material: architecture decisions, trade-offs, screenshots you can share, and measured results. The three initial overviews are grounded in the supplied CV and existing portfolio; expand them with actual technical evidence rather than adding generic SEO filler.

## Expectations and measurement

There is no guaranteed first position, even for a name. Rankings depend on the query, competition, location and search-engine decisions. Lighthouse SEO checks measure technical basics, not ranking strength. Recrawling can take days to weeks and does not guarantee indexing.

Review Search Console weekly after launch. Compare equivalent 28-day windows once sufficient data exists. Focus first on the correct canonical being indexed and branded-query impressions, then clicks. Do not repeatedly rewrite titles or submit URLs while waiting for initial recrawling.

## Maintenance / verification

```sh
npm run test:seo
npm test
npm run preview -- --port 5173
node scripts/browser-check.js
```

`node scripts/create-social-image.js` regenerates the sharing card from the existing portrait; it requires Google Chrome. Rebuild afterward. `python3 scripts/package-delivery.py` refreshes source and deployment archives.

Google references:
- https://developers.google.com/search/docs/fundamentals/seo-starter-guide
- https://developers.google.com/search/docs/appearance/structured-data/profile-page
- https://developers.google.com/search/docs/appearance/site-names
- https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl
- https://support.google.com/webmasters/answer/9008080
