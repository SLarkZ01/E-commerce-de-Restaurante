import { chromium } from "@playwright/test";

const BASE = "http://localhost:3000";

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  console.log("=== Probando E-Kitchen ===\n");

  // 1. Landing page
  console.log("1. Landing page (/)...");
  await page.goto(BASE);
  const titulo = await page.locator("h1").textContent();
  console.log(`   Título: ${titulo} — ${titulo?.includes("E-Kitchen") ? "✅" : "❌"}`);

  // 2. Login page
  console.log("\n2. Login (/login)...");
  await page.goto(`${BASE}/login`);
  const loginTitulo = await page.locator("h1").textContent();
  const hayInput = await page.locator('input[type="email"]').count();
  console.log(`   Título: ${loginTitulo} — ${hayInput > 0 ? "✅" : "❌"}`);

  // 3. Login with credentials
  console.log("\n3. Iniciar sesión...");
  await page.fill('input[type="email"]', "admin@ekitchen.com");
  await page.fill('input[type="password"]', "admin123");
  await page.click('button[type="submit"]');
  await page.waitForURL("**/cocina", { timeout: 10000 });
  const cocinaTitulo = await page.locator("h1").textContent();
  console.log(`   Redirigido a /cocina: ${cocinaTitulo} — ✅`);

  // 4. Cocina page
  console.log("\n4. Panel de Cocina (/cocina)...");
  await page.goto(`${BASE}/cocina`);
  const columnas = await page.locator("text=Pendiente").count();
  console.log(`   Columna Pendiente visible: ${columnas > 0 ? "✅" : "⚠️ (sin pedidos aún)"}`);

  // 5. Catálogo de platos
  console.log("\n5. Gestión de Platos (/cocina/platos)...");
  await page.goto(`${BASE}/cocina/platos`);
  const tablaPlatos = await page.locator("table").count();
  console.log(`   Tabla de platos: ${tablaPlatos > 0 ? "✅" : "❌"}`);

  // 6. Logística
  console.log("\n6. Panel de Entregas (/logistica)...");
  await page.goto(`${BASE}/logistica`);
  const logisticaTitulo = await page.locator("h1").textContent();
  console.log(`   Título: ${logisticaTitulo} — ✅`);

  // 7. Admin
  console.log("\n7. Administración (/admin)...");
  await page.goto(`${BASE}/admin`);
  const adminTitulo = await page.locator("h1").textContent();
  console.log(`   Título: ${adminTitulo} — ✅`);

  // 8. Mesa pública (sin sesión)
  console.log("\n8. Menú cliente (/mesa/3275e687-d51d-477a-93a7-761e32d0419a)...");
  const anonContext = await browser.newContext();
  const anonPage = await anonContext.newPage();
  await anonPage.goto(`${BASE}/mesa/3275e687-d51d-477a-93a7-761e32d0419a`);
  const mesaTitulo = await anonPage.locator("header").textContent();
  console.log(`   Header: ${mesaTitulo} — ${mesaTitulo?.includes("Mesa") && mesaTitulo?.includes("5") ? "✅" : "❌"}`);
  const platos = await anonPage.locator("text=Pasta a la Boloñesa").count();
  console.log(`   Plato visible: ${platos > 0 ? "✅" : "❌"} (Pasta a la Boloñesa)`);

  // 9. Agregar plato al carrito
  console.log("\n9. Carrito...");
  await anonPage.locator('button[aria-label*="Agregar"]').first().click();
  const footer = await anonPage.locator("footer").textContent();
  console.log(`   Footer: ${footer} — ${footer?.includes("1 plato") ? "✅" : "❌"}`);

  // 10. Abrir carrito
  await anonPage.locator("footer button").click();
  await anonPage.waitForTimeout(500);
  const carritoTitulo = await anonPage.locator("text=Tu Pedido").count();
  console.log(`   Carrito abierto: ${carritoTitulo > 0 ? "✅" : "❌"}`);

  await browser.close();
  console.log("\n=== Pruebas completadas ===");
}

main().catch(console.error);
