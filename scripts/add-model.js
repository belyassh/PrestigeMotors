#!/usr/bin/env node
const fs = require('fs');
const path = require('path');

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {};
  args.forEach((a, i) => {
    if (a.startsWith('--')) {
      const key = a.slice(2);
      const val = args[i+1] && !args[i+1].startsWith('--') ? args[i+1] : true;
      out[key] = val;
    }
  });
  return out;
}

const argv = parseArgs();
const slug = argv.slug || argv.s;
const name = argv.name || argv.n || slug;
const price = argv.price || argv.p || '';
const desc = argv.desc || argv.d || '';
const images = (argv.images || argv.i || '').split(',').filter(Boolean);

if (!slug) {
  console.error('Usage: node scripts/add-model.js --slug my-model-slug --name "Display Name" [--images front.jpg,side.jpg] [--price "$12,000"] [--desc "Short description"]');
  process.exit(1);
}

const root = path.join(__dirname, '..');
const motoDir = path.join(root, 'moto');
const modelDir = path.join(motoDir, slug);
const dataFile = path.join(root, 'data', 'models.json');

// Ensure moto folder
if (!fs.existsSync(motoDir)) fs.mkdirSync(motoDir, { recursive: true });
// Create model folder if missing
if (!fs.existsSync(modelDir)) fs.mkdirSync(modelDir, { recursive: true });

// Write meta.json (only fields provided)
const metaPath = path.join(modelDir, 'meta.json');
const meta = { name, desc, price, images };
fs.writeFileSync(metaPath, JSON.stringify(meta, null, 2));
console.log('Wrote', metaPath);

// Read or create data/models.json
let models = [];
if (fs.existsSync(dataFile)) {
  try {
    const raw = fs.readFileSync(dataFile, 'utf8');
    models = JSON.parse(raw);
    if (!Array.isArray(models)) models = [];
  } catch (e) {
    console.warn('Failed to parse existing data/models.json, overwriting.');
    models = [];
  }
}

// Check duplicate id
if (models.some(m => m.id === slug)) {
  console.error('A model with id "%s" already exists in data/models.json. Aborting to avoid duplicates.', slug);
  process.exit(1);
}

const entry = {
  id: slug,
  name,
  folder: path.posix.join('moto', slug),
  images,
  price,
  desc
};

models.push(entry);
fs.writeFileSync(dataFile, JSON.stringify(models, null, 2));
console.log('Appended model to', dataFile);

// Optional: copy image files into the model folder
const copyFlag = argv.copy || argv.c;
if (copyFlag) {
  // if value is true (boolean true), assume images names refer to files in current working dir
  const toCopy = (typeof copyFlag === 'string' && copyFlag !== 'true') ? copyFlag.split(',').map(s => s.trim()).filter(Boolean) : images;
  toCopy.forEach(src => {
    const srcPath = path.isAbsolute(src) ? src : path.join(process.cwd(), src);
    const destPath = path.join(modelDir, path.basename(src));
    try {
      if (!fs.existsSync(srcPath)) {
        console.warn('Source image not found, skipping:', srcPath);
        return;
      }
      fs.copyFileSync(srcPath, destPath);
      console.log('Copied', srcPath, '->', destPath);
    } catch (err) {
      console.error('Failed to copy', srcPath, err.message);
    }
  });
}

// Generate a simple index.html for the model from a template
const pagePath = path.join(modelDir, 'index.html');
const relFolder = path.posix.join('..', path.posix.join('..'));
function escapeHtml(s){ return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;'); }
const imagesHtml = images.map((img, i) => `  <div class="gallery-item"><img src="${escapeHtml(img)}" alt="${escapeHtml(name)} ${i+1}"></div>`).join('\n');
const specs = entry.specs || {};
const specsHtml = `
<dl class="specs-list">
  <dt>Engine</dt><dd>${escapeHtml(specs.engine || '')}</dd>
  <dt>Power</dt><dd>${escapeHtml(specs.power || '')}</dd>
  <dt>Seats</dt><dd>${escapeHtml(specs.seats || '')}</dd>
  <dt>Transmission</dt><dd>${escapeHtml(specs.transmission || '')}</dd>
  <dt>Mileage</dt><dd>${escapeHtml(specs.mileage || '')}</dd>
</dl>`;

const page = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>${escapeHtml(name)} — Prestige Motors</title>
  <link rel="stylesheet" href="../styles.css">
</head>
<body>
    <header class="sticky-header"><div class="header-inner"><h1 class="logo"><a href="/">Prestige Motors</a></h1></div></header>
  <main class="model-page">
    <a class="btn btn-outline" href="../index.html">← Back to inventory</a>
    <h2>${escapeHtml(name)}</h2>
    <div class="model-gallery g-cols-${Math.min(3, images.length)}">
${imagesHtml}
    </div>
    <div class="model-meta">
      <p class="model-desc">${escapeHtml(desc)}</p>
      <p class="model-price">${escapeHtml(price)}</p>
      ${specsHtml}
    </div>

    <section class="booking">
      <h3>Booking request</h3>
      <form class="booking-form" action="#" method="post" onsubmit="alert('Booking submitted (demo)'); return false;">
        <div class="booking-row"><input name="name" placeholder="Your name" required></div>
        <div class="booking-row"><input name="phone" placeholder="Phone number" required></div>
        <div class="booking-row">
          <select name="contact_method">
            <option>Telegram</option>
            <option>WhatsApp</option>
            <option>Email</option>
          </select>
          <input name="email" placeholder="Email (optional)">
        </div>
        <div><button class="btn btn-primary" type="submit">Send booking request</button></div>
      </form>
    </section>
  </main>
</body>
</html>`;

fs.writeFileSync(pagePath, page);
console.log('Generated model page at', pagePath);
console.log('\nDone.');
console.log('Next steps: add image files into', modelDir, 'for the names you specified in --images (or update meta.json).');
