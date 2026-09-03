import { chromium } from 'playwright';

const browser = await chromium.launch({ executablePath: '/opt/pw-browsers/chromium/chrome-linux/chrome' });
const page = await browser.newPage({ viewport: { width: 1400, height: 900 } });

const routes = [
  ['/patients', 'patients-list.png'],
  ['/patients/p3', 'patient-profile.png'],
  ['/history', 'history-trends.png'],
];

for (const [path, file] of routes) {
  const errors = [];
  page.on('pageerror', (e) => errors.push(String(e)));
  await page.goto(`http://localhost:5183${path}`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);
  await page.screenshot({ path: `/tmp/claude-0/-home-user-Kidney-Risk-CDSS/9aaf3308-84e4-59cd-b559-9d91613f577c/scratchpad/${file}` });
  console.log(path, 'errors:', errors);
  page.removeAllListeners('pageerror');
}

await browser.close();
