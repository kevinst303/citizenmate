const { chromium } = require('playwright');

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage();
  console.log("Navigating to http://localhost:4000/admin");
  await page.goto('http://localhost:4000/admin');
  console.log("Current URL after direct navigation:", page.url());
  
  await page.goto('http://localhost:4000/en/test-link');
  console.log("Navigated to test link page");
  await page.click('text="Go to Admin"');
  await page.waitForTimeout(2000);
  console.log("Current URL after client navigation:", page.url());
  
  await browser.close();
})();
