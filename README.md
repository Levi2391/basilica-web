# Basílica de la Puríssima Concepció — Kiosk

Static HTML/CSS/JS touchscreen kiosk app, deployed via GitHub Pages from `main`.

## Structure

```
index.html              Entry point - all views live inside #panel, toggled via JS
css/styles.css          All styles
js/                     One file per feature (historia, horarios, contact, slideshow, ...)
components/             HTML fragments fetched and injected into index.html at runtime
data/
  events.json           Unreferenced - kept for future use
  events_2026.xlsx       "
  historia/{es,ca,en}.json   Historia section content, per language
images/
  content/              Full-size photos used in historia detail sections
  icons/                Small badge icons used in the historia section list
  *.png / *.jpg          Misc images used directly by index.html/js (QR codes, horarios image, location photos)
assets/
  favicon/               Favicon + web manifest icon set
  logos/                 Kiosk menu logo (dark/light theme variants)
advertisements/          Carousel videos/posters + manifest.json listing what to show
```

## Notes

- No build step - everything is served as-is. `index.html` loads all `<script>`/`<link>` tags directly.
- All asset paths are relative (not root-absolute) because this site is served from a GitHub Pages subpath (`/basilica-web/`), not domain root - a root-absolute path like `/favicon.ico` 404s there.
- `images/icons/*.png`: several of these are not actually PNGs (mislabeled extensions from before this cleanup - some are full-size JPEGs/WebP reused as "icons"). Tracked as a known issue, not fixed as part of the structural reorg.
- Local testing: serve with a static server that disables caching (mobile browsers aggressively cache otherwise), e.g. `npx http-server -c-1`, then open `http://<your-LAN-ip>:8080` on a phone on the same network.
