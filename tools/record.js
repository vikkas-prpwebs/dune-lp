// Renders product-video.html frame by frame and pipes JPEG frames into ffmpeg.
// Usage: node record.js <url> <out.mp4> [fps] [width] [height]
const { spawn } = require('child_process');
const puppeteer = require('puppeteer-core');

const [url, out, fpsArg, wArg, hArg] = process.argv.slice(2);
const fps = Number(fpsArg || 30);
const W = Number(wArg || 1920), H = Number(hArg || 1080);

(async () => {
  const browser = await puppeteer.launch({
    executablePath: '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome',
    headless: 'new',
    args: ['--hide-scrollbars', '--force-device-scale-factor=1'],
  });
  const page = await browser.newPage();
  await page.setViewport({ width: W, height: H, deviceScaleFactor: 1 });
  await page.goto(url, { waitUntil: 'networkidle0' });
  await page.evaluate(async () => {
    await document.fonts.ready;
    await Promise.all([...document.images].map(i => i.complete ? 0 : new Promise(r => { i.onload = i.onerror = r; })));
    window.tl.pause(0);
  });
  const duration = await page.evaluate(() => window.tl.duration());
  const total = Math.round(duration * fps);

  const ff = spawn('/opt/homebrew/bin/ffmpeg', [
    '-y', '-f', 'image2pipe', '-framerate', String(fps), '-i', '-',
    '-c:v', 'libx264', '-preset', 'slow', '-crf', '17', '-pix_fmt', 'yuv420p',
    '-movflags', '+faststart', out,
  ], { stdio: ['pipe', 'inherit', 'pipe'] });
  let ffErr = '';
  ff.stderr.on('data', d => { ffErr += d; });

  for (let f = 0; f < total; f++) {
    const t = f / fps;
    // Drive both the GSAP timeline and CSS animations from the same clock.
    await page.evaluate(t => {
      window.tl.pause(t);
      document.getAnimations().forEach(a => { a.pause(); a.currentTime = t * 1000; });
    }, t);
    const buf = await page.screenshot({ type: 'jpeg', quality: 95 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (f % (fps * 5) === 0) console.log(`frame ${f}/${total}`);
  }
  ff.stdin.end();
  const code = await new Promise(r => ff.on('close', r));
  await browser.close();
  if (code !== 0) { console.error(ffErr.slice(-2000)); process.exit(1); }
  console.log(`done: ${total} frames, ${duration.toFixed(2)}s -> ${out}`);
})().catch(e => { console.error(e); process.exit(1); });
