// Saves stills of the video page at given times: node stills.js <url> <outdir> <w> <h> t1 t2 ...
const puppeteer = require('puppeteer-core');
const [url, dir, w, h, ...times] = process.argv.slice(2);
(async () => {
  const b = await puppeteer.launch({ executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome', headless: 'new' });
  const p = await b.newPage();
  await p.setViewport({ width: +w, height: +h });
  await p.goto(url, { waitUntil: 'networkidle0' });
  await p.evaluate(() => document.fonts.ready);
  for (const t of times) {
    await p.evaluate(t => { tl.pause(t); document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; }); }, +t);
    await p.screenshot({ path: `${dir}/v_${t}.jpg`, type: 'jpeg', quality: 80 });
  }
  await b.close();
})();
