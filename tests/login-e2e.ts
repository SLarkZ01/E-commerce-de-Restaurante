import { chromium } from "playwright";

const EMAIL = "admin@ekitchen.com";
const PASSWORD = "admin123";
const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const page = await browser.newPage();

  page.on("console", (msg) => console.log(`   [Browser ${msg.type()}] ${msg.text()}`));
  page.on("pageerror", (err) => console.log(`   [Browser error] ${err.message}`));

  console.log("1. Navegando a / ...");
  const res = await page.goto(`${BASE}/`, { waitUntil: "networkidle" });
  console.log(`   Status: ${res?.status()}`);
  console.log(`   URL actual: ${page.url()}`);

  console.log("2. Verificando que se muestra el formulario de login...");
  const emailInput = page.locator('input[type="email"]');
  const passwordInput = page.locator('input[type="password"]');
  const submitBtn = page.locator('button[type="submit"]');

  await emailInput.waitFor({ timeout: 5000 });
  await emailInput.fill(EMAIL);
  await passwordInput.fill(PASSWORD);

  console.log("3. Enviando formulario...");
  await submitBtn.click();

  await page.waitForTimeout(5000);
  console.log(`   URL después del submit: ${page.url()}`);

  if (page.url().includes("/cocina")) {
    console.log("✅ Login exitoso — redirigido a /cocina");
  } else if (page.url() === `${BASE}/` || page.url() === `${BASE}`) {
    console.log("❌ Sigue en / — revisando el problema...");
    const bodyText = (await page.textContent("body")) ?? "";
    console.log(`   Contenido: ${bodyText.slice(0, 400)}`);
  } else {
    console.log(`   URL final: ${page.url()}`);
  }

  await browser.close();
}

main().catch((e) => {
  console.error("Error:", e.message);
  process.exit(1);
});
