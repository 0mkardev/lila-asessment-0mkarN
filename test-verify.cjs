const puppeteer = require('puppeteer');

(async () => {
  const browser = await puppeteer.launch({ 
    headless: "new",
    args: ['--no-sandbox', '--window-size=1600,900']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1600, height: 900 });
  
  page.on('console', msg => console.log('PAGE LOG:', msg.text()));
  page.on('pageerror', error => console.log('PAGE ERROR:', error.message));

  await page.goto('http://localhost:5173', { waitUntil: 'networkidle0' });
  await new Promise(r => setTimeout(r, 3000));

  // Select a match known to have storm deaths for good path visibility
  const selects = await page.$$('select');
  if (selects.length >= 2) {
    // Get all match options
    const options = await page.evaluate(el => 
      Array.from(el.options).map(o => ({ value: o.value, text: o.text })), 
      selects[1]
    );
    console.log('Available matches:', options.slice(0,5).map(o => o.text).join(', '));
    
    // Pick the first valid match (not empty)
    const valid = options.find(o => o.value && o.value !== '');
    if (valid) {
      await selects[1].select(valid.value);
      console.log('Selected match:', valid.text);
      // Wait for data to load
      await new Promise(r => setTimeout(r, 5000));
    }
  }

  // Screenshot full map view
  await page.screenshot({ path: 'path_verification.png', fullPage: false });
  console.log('Saved path_verification.png');

  // Now zoom in to a corner region to check path-road alignment
  // Simulate scroll to zoom
  const canvas = await page.$('canvas');
  if (canvas) {
    const box = await canvas.boundingBox();
    const cx = box.x + box.width / 2;
    const cy = box.y + box.height / 2;
    // Scroll wheel to zoom in
    await page.mouse.move(cx, cy);
    for (let i = 0; i < 5; i++) {
      await page.mouse.wheel({ deltaY: -300 });
      await new Promise(r => setTimeout(r, 200));
    }
    await new Promise(r => setTimeout(r, 1500));
    await page.screenshot({ path: 'path_verification_zoomed.png', fullPage: false });
    console.log('Saved path_verification_zoomed.png');
  }

  await browser.close();
})();
