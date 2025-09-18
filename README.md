
# Prestige Motors (demo)

This is a small demo site themed for a premium car shop called *Prestige Motors*.

Try it


Theme changes


Files changed


# Prestige Motors (demo)

This is a small, static demo site themed for a premium car shop called *Prestige Motors*. It's intentionally lightweight: plain HTML, CSS and vanilla JavaScript so you can run it locally without build tools.

## What is included

- `index.html` — Main landing page with a hero, a category slider (Sport, Premium, Comfort, Sedan, Supercar), and per-category car grids.
- `styles.css` — Global styles, responsive layout, and transitions used across pages.
- `script.js` — Small DOM script for the mobile nav and category switching (includes deep-linking support via `?category=` or `#category`).
- `park/` — Folder with per-category car detail pages (a few sample pages are included under `park/sport/`).
- `Images/` — Static images used as placeholders (e.g. `banner_cars.jpg`).

## Quick start (local)

1. Clone the repo (if not already):

	git clone <repo-url>

2. Open `index.html` directly in your browser, or serve with a static server for nicer URL handling. Example using Python (macOS / Linux):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes & tips

- The category tabs are deep-linkable. For example: `http://localhost:8000/?category=premium` opens the Premium grid on load.
- Each card links to a detail page under `park/`. Replace placeholder images in `Images/` with real car photos and update `src` attributes to improve the look.
- The header on detail pages is sticky to keep navigation visible while scrolling.

## Suggestions & next steps

- Replace placeholder images with per-car photos to give the site a polished look.
- Add small animations when switching grids (already implemented as a subtle fade; tweak duration in `styles.css`).
- Consider generating car pages from a JSON file and a small generator script if you plan to manage many cars.

## Contributing

This is a demo repository — open a PR with improvements or file issues for visual tweaks, performance, or accessibility.

## License

No license specified — feel free to use this demo for learning and internal experiments.

