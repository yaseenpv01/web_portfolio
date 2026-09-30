# Muhammed Yaseen — mobile engineer portfolio

A complete static Vite site with vanilla JavaScript, Three.js, GSAP/ScrollTrigger, Lenis and self-hosted Space Grotesk. Graphite surfaces, electric-blue accents, a scroll-driven phone, interactive skill orbit, nine project cards, experience timeline, and a working Formspree integration.

## Run and build

Use Node.js 22.12+ (or a newer supported LTS release).

```sh
npm ci
npm run dev
```

Vite prints the local URL. For the exact production output:

```sh
npm run build
npm run preview -- --port 5173
```

Deploy the **contents of `dist/`**, not the source directory. The build has relative asset paths and works at a domain root or a GitHub Pages project subpath. No server, database or runtime environment variables are required.

## Project structure

```text
index.html                      All semantic content, links, SEO and contact form
src/
  style.css                     Responsive design, fonts, fallback phone and skill orbit
  main.js                       GSAP, Lenis, navigation, interactions and form submission
  phone.js                      Lazy Three.js scene and optional glTF loader
  projects.json                 Original project content and store-link reference
public/
  assets/img/yaseen_imgnew.png   Original portrait, preserved
  assets/img/yaseen-avatar.png   Earlier portrait derivative, preserved
  assets/img/yaseen-professional.webp   AI-edited professional portrait
  assets/img/yaseen-professional-avatar.webp   Optimized current avatar
  Muhammed_Yaseen_PV_CV.pdf      Latest supplied CV, copied unchanged
  screens/project-0.svg … project-8.svg   Complete illustrative interface artwork
  favicon.svg
  robots.txt
  sitemap.xml
scripts/
  portfolio.test.js             Content, navigation and asset checks
  browser-check.js              Desktop/mobile, axe, motion and intercepted form checks
package.json / package-lock.json
vite.config.js
netlify.toml
.env.example
.gitignore
README.md
SOURCE.md                       Full authored text-source listing
```

The older root `assets/`, PDFs, `inner-page.html`, `portfolio-details.html` and `forms/` are preserved for reference; Vite does not deploy these unused legacy pages or vendor libraries. `public/` contains the production static assets. `projects.json` is a source reference for verification, not a runtime renderer: edit project copy directly in `index.html` to keep all content crawlable without JavaScript, and update the reference when changing store destinations.

## Deploy

### Netlify

1. Push the project to your repository and import it into Netlify.
2. Select build command `npm run build` and publish directory `dist` (already in `netlify.toml`).
3. Use Node 22.12+ in the build environment.
4. Deploy, connect `yaseenmuhammed.com`, and enable HTTPS.

You can also upload the built `dist` directory with Netlify's manual deploy UI.

### Vercel

1. Import the repository and choose the Vite preset.
2. Build command: `npm run build`. Output directory: `dist`.
3. Deploy and attach the domain. No rewrite rules or serverless functions are needed.

### GitHub Pages / any static host

1. Run `npm ci && npm run build`.
2. Publish `dist` as the Pages artifact in your repository's Pages workflow, or copy its contents to the chosen static host's document root.
3. In GitHub, use **Settings → Pages → Source: GitHub Actions** with the standard static-site deployment workflow and upload `dist` as its artifact.
4. If using the custom domain, configure it in Pages settings and point DNS to GitHub Pages. For a different permanent domain, update canonical/OG URLs in `index.html`, `public/robots.txt`, and `public/sitemap.xml`.

The contact form posts directly to the existing Formspree endpoint on all three hosts; it does not depend on Netlify Forms or PHP.

## Swap in app screenshots

The included SVGs are **interface studies, not screenshots of the released apps**. They are labeled on-screen and in image alt text. No product UI or usage metrics are claimed by these illustrations.

The order is: 0 Inaxus 2.0, 1 SP Productivity Tracker, 2 Cart and Cook, 3 Bitconia, 4 FGIC Attendance, 5 Gulf Experts, 6 Kudumbashree, 7 Oryx, 8 Local AI Document Parser.

1. Export portrait screenshots at a 1:2 aspect ratio, preferably 480 × 960 or 720 × 1440. Use compressed WebP or PNG; keep each under roughly 150 KB.
2. Place them in `public/screens/`, for example `project-0.webp`.
3. Update corresponding image `src` attributes in `index.html`. The hero fallback uses project 0. Update alt text to accurately describe each real screenshot and replace “INTERFACE STUDY” captions with “APP PREVIEW”.
4. In `src/phone.js`, change the screenshot URL extension in `textureLoader.loadAsync` and its caption text. The hero currently loops through `[0,1,2]`; adjust this array and the matching `titles` list to show more apps.
5. In `src/main.js`, update the fallback image URL extension inside the story ScrollTrigger callback.
6. Rebuild. No screenshot API or external image service is required.

The original portrait remains at `/assets/img/yaseen_imgnew.png`; the page now uses the optimized AI-edited professional portrait at 96px. See PORTRAIT.md for the exact prompt and provenance. The CV remains at `/Muhammed_Yaseen_PV_CV.pdf`.

## Swap the 3D phone model

The built-in phone is procedural geometry, so no model download is required. A custom GLB is optional and already supported:

1. Export a self-contained `.glb` to `public/models/phone.glb`.
2. Orient the model upright along +Y with the screen facing +Z. Give the screen its own mesh named **Screen** with standard upright UVs covering the whole screenshot. Keep the mesh/material count low and aim for less than 50k triangles and a 1 MB model.
3. Copy `.env.example` to `.env.local` and set:

```dotenv
VITE_PHONE_MODEL_URL=./models/phone.glb
```

4. Restart Vite or rebuild. The loader centers the model, scales its height to 4.8 scene units, and maps the existing looping preview onto `Screen`. The same parallax, scroll and visibility behavior apply. If loading fails or `Screen` is missing, the built-in phone remains visible.

The optional loader assumes an uncompressed GLB. Draco/KTX files require their corresponding decoders, which are not shipped. Model orientation/UV conventions vary; correct them in your modeling tool if needed. With a custom model, rerun the performance audit.

## Contact form

The original endpoint is retained: `https://formspree.io/f/xbllqbpq`. Native validation, an optional phone field, honeypot, duplicate-submit prevention, 15-second timeout, animated success and recoverable failure states are implemented. Without JavaScript, the HTML form submits natively to Formspree.

Success is shown only after an HTTP success response. Local tests intercept the request; they do not send an email. Inbox delivery, account activation, domain allowlists and plan limits must be verified in the owning Formspree account after deployment. The direct email/telephone links remain available if delivery fails.

## Motion, performance and accessibility

- Three.js is a separate lazy chunk. It is not imported below 768px, with reduced motion, Data Saver, or reported low-memory/low-core devices.
- Desktop uses a capped pixel ratio of 2, modest geometry, 65 particles and no postprocessing or shadow maps.
- IntersectionObserver and page visibility stop the WebGL render loop offscreen/in background tabs; context loss reveals the CSS fallback.
- Mobile uses the lightweight CSS phone. Reduced-motion users get a static phone, no loader, no smooth scrolling, no tilt or animated counters.
- Skill orbit pauses on hover/focus and offscreen; all skills work by keyboard and touch.
- Semantic HTML remains visible without JS, with a skip link, labeled form fields, accessible navigation, visible focus, real links, image dimensions, lazy project images, structured data and OG metadata.
- The cursor is decorative and preserves the normal system cursor.

A 60fps guarantee needs testing on physical target phones; Lighthouse is a lab measurement, not a frame-rate guarantee. The mobile fallback avoids the WebGL workload entirely.

## Verification

```sh
npm test
npm run build
npm run preview -- --port 5173
# In another terminal, with Google Chrome installed:
node scripts/browser-check.js
npx lighthouse http://localhost:5173 --chrome-flags='--headless' --output=json --output-path=artifacts/lighthouse-mobile.json --only-categories=performance,accessibility,seo
```

The browser check generates screenshots and an axe report under ignored `artifacts/`. It checks desktop/mobile overflow, all projects, mobile menu operation, reduced motion, runtime errors, and intercepted successful/failed form responses. Change `channel: 'chrome'` if your test environment uses another Playwright browser installation.

Before the CV/portrait content update, production Lighthouse results were: **98 Performance / 100 Accessibility / 100 SEO on mobile**, and **100 / 100 / 100 on desktop**. Desktop/mobile axe checks reported zero WCAG A/AA violations. Scores depend on browser version, hardware, host response times and any replacement media; repeat after deployment.

## Latest CV update

The supplied September 2026 CV replaces the download byte-for-byte. Portfolio content now includes the INAXUS lead promotion (September 2024), the preceding INAXUS role, iRings dates from February 2021, Zoople, education dates of 2016–2020, expanded architecture/AI/tooling skills, languages and driving license, and the 2026 Local AI Document Parser. Earlier project store links are retained. The CV’s Gemini attribution under the February–August 2022 Future Trend role needs date clarification; that specific attribution is not repeated on the website. The PDF itself is unchanged.

## App logos

Seven package-matched app icons are included in `public/assets/logos/`, with provenance in `LOGO-SOURCES.md`. The current official INAXUS icon and archived SP Productivity, Cart and Cook, FGIC, Gulf Experts, Kudumbashree, and Oryx icons retain their original brand colours. Bitconia and the personal AI parser remain text-only because no suitable verified mark was available. Run `python3 scripts/package-delivery.py` after a build to refresh the source listing and ZIP deliverables.
