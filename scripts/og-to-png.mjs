import sharp from 'sharp';

const targets = ['default-og', 'works-og'];
for (const name of targets) {
  await sharp(`public/images/og/${name}.svg`, { density: 200 })
    .resize(1200, 630, { fit: 'cover' })
    .png()
    .toFile(`public/images/og/${name}.png`);
  console.log(`✓ ${name}.png (1200×630)`);
}
