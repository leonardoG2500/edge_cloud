const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

(async () => {
  const aliados = JSON.parse(fs.readFileSync('./data/aliados.json', 'utf8'));
  const browser = await puppeteer.launch();

  for (const aliado of aliados) {
    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 800 });
    await page.goto(aliado.url, { waitUntil: 'networkidle2' });

    const filename = path.basename(aliado.preview);
    await page.screenshot({ path: `./public/img/previews/${filename}` });
    await page.close();
  }

  await browser.close();
})();
