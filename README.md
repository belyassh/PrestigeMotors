
# Prestige Motors (demo)

This is a small demo site themed for a premium motorbike shop called *Prestige Motors*.

Try it


Theme changes


Files changed


# Prestige Motors (demo)

This is a small, static demo site themed for a premium motorbike shop called *Prestige Motors*. It's intentionally lightweight: plain HTML, CSS and vanilla JavaScript so you can run it locally without build tools.

## What is included

- `index.html` — Main landing page with a hero, a category slider (Sport, Premium, Comfort, Sedan, Supercar), and per-category motorbike grids.
- `styles.css` — Global styles, responsive layout, and transitions used across pages.
- `script.js` — Small DOM script for the mobile nav and category switching (includes deep-linking support via `?category=` or `#category`).
- `park/` — Folder with per-category motorbike detail pages (a few sample pages are included under `park/sport/`).
- `Images/` — Static images used as placeholders (e.g. `banner_bikes.jpg`).

## Quick start (local)

1. Clone the repo (if not already):

	git clone <repo-url>

2. Open `index.html` directly in your browser, or serve with a static server for nicer URL handling. Example using Python (macOS / Linux):

```bash
python3 -m http.server 8000
# then visit http://localhost:8000
```

## Notes & tips

 - Improved card click behavior for better user experience.
 - Updated button color for enhanced visibility and aesthetics.
 - Accessibility & interaction improvements:
 - Cards are now clickable: clicking the card image or body opens the gallery (not only the "View gallery" button).
 - Cards are keyboard-focusable and activate on Enter/Space, improving accessibility for keyboard users.
 - The "View gallery" button has been restyled to match the primary CTA color for visual consistency.

## Suggestions & next steps

- Replace placeholder images with per-motorbike photos to give the site a polished look.
- Add small animations when switching grids (already implemented as a subtle fade; tweak duration in `styles.css`).
- Consider generating motorbike pages from a JSON file and a small generator script if you plan to manage many models.

## Managing the models manifest

This project reads `data/models.json` on load (if present). To add or edit models, edit `data/models.json` manually. Each entry should look like:

```json
{
	"id": "model-id",
	"name": "Display Name",
	"folder": "moto/model-id",
	"images": ["front.jpg", "side.jpg"],
	"price": "$12,000",
	"desc": "Short description"
}
```

Place model folders under `moto/` (e.g. `moto/model-id`) and put images inside. The front-end will load the manifest and use the files from the specified folders.

If you prefer automation (e.g. to auto-generate `data/models.json` from the folder structure), consider adding a small generator script back — but the project works fine with manual editing.

### Быстрое добавление модели (утилита)

Если вы хотите простой способ добавить новую карточку, доступен вспомогательный скрипт `scripts/add-model.js`. Он создаёт папку `moto/<slug>` (если нужно), записывает `meta.json` и добавляет запись в `data/models.json`.

Пример использования:

```bash
# через npm script
npm run add-model -- --slug ducati-supersport --name "Ducati Supersport" --images front.jpg,side.jpg --price "$18,500" --desc "Sporty and elegant."

# или напрямую
node scripts/add-model.js --slug ducati-supersport --name "Ducati Supersport" --images front.jpg,side.jpg
```

После выполнения создайте/загрузите файлы изображений в папку `moto/ducati-supersport` (названия файлов те, что указали в `--images`), затем откройте сайт — новая карточка появится автоматически.

Примечание: скрипт не загружает изображения для вас; он только обновляет `meta.json` и `data/models.json`.

## Contributing

This is a demo repository — open a PR with improvements or file issues for visual tweaks, performance, or accessibility.

## License

No license specified — feel free to use this demo for learning and internal experiments.

