const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const ROOT = path.join(__dirname, '..');
const IMAGES_SRC = path.join(ROOT, 'Welo Assets', 'Images');
const LOGOS_SRC = path.join(ROOT, 'Welo Assets', 'Logo');
const IMAGES_OUT = path.join(ROOT, 'public', 'images', 'optimized');
const LOGOS_OUT = path.join(ROOT, 'public', 'logos');

const SIZES = [
  { suffix: '-lg', width: 1600 },
  { suffix: '-sm', width: 800 }
];

async function optimizeImages() {
  fs.mkdirSync(IMAGES_OUT, { recursive: true });
  fs.mkdirSync(LOGOS_OUT, { recursive: true });

  const files = fs.readdirSync(IMAGES_SRC).filter(f => /\.jpe?g$/i.test(f));
  console.log(`Found ${files.length} images to optimize...`);

  let processed = 0;
  for (const file of files) {
    const inputPath = path.join(IMAGES_SRC, file);
    const baseName = path.parse(file).name;

    for (const size of SIZES) {
      const jpgOut = path.join(IMAGES_OUT, `${baseName}${size.suffix}.jpg`);
      const webpOut = path.join(IMAGES_OUT, `${baseName}${size.suffix}.webp`);

      await sharp(inputPath)
        .resize({ width: size.width, withoutEnlargement: true })
        .jpeg({ quality: 80, mozjpeg: true })
        .toFile(jpgOut);

      await sharp(inputPath)
        .resize({ width: size.width, withoutEnlargement: true })
        .webp({ quality: 75 })
        .toFile(webpOut);
    }

    processed++;
    if (processed % 10 === 0) {
      console.log(`  ${processed}/${files.length} images done`);
    }
  }
  console.log(`All ${processed} images optimized.`);

  const logos = fs.readdirSync(LOGOS_SRC).filter(f => /\.png$/i.test(f));
  for (const logo of logos) {
    fs.copyFileSync(path.join(LOGOS_SRC, logo), path.join(LOGOS_OUT, logo));
  }
  console.log(`Copied ${logos.length} logos.`);
}

optimizeImages().catch(err => {
  console.error('Image optimization failed:', err);
  process.exit(1);
});
