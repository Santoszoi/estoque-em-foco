import { chromium } from "@playwright/test";
import { mkdir, rename } from "node:fs/promises";
await mkdir("media", { recursive: true });
const browser = await chromium.launch({
  executablePath: process.env.CHROMIUM_PATH || undefined,
  args: process.env.CHROMIUM_PATH
    ? ["--no-sandbox", "--disable-dev-shm-usage"]
    : [],
});
const context = await browser.newContext({
  viewport: { width: 1440, height: 1100 },
  recordVideo: { dir: "media/raw", size: { width: 1440, height: 1100 } },
});
const page = await context.newPage();
await page.goto("http://127.0.0.1:4173");
await page.screenshot({ path: "media/01-estoque.png", fullPage: true });
await page.waitForTimeout(1600);
await page.getByLabel("Categoria", { exact: true }).selectOption("Bebidas");
await page.waitForTimeout(1000);
await page.getByLabel("Situação", { exact: true }).selectOption("baixo");
await page.waitForTimeout(1000);
await page
  .getByLabel("Nome ou código")
  .pressSequentially("cafe", { delay: 180 });
await page.screenshot({ path: "media/02-filtros.png", fullPage: true });
await page.waitForTimeout(1800);
await page.getByLabel("Nome ou código").fill("inexistente");
await page.screenshot({ path: "media/03-vazio.png", fullPage: true });
await page.waitForTimeout(1800);
await page.getByRole("button", { name: "Limpar e buscar novamente" }).click();
await page.getByLabel("Ordenar por").selectOption("saldo");
await page.waitForTimeout(2400);
const video = page.video();
await context.close();
await rename(await video.path(), "media/estoque-em-foco.webm");
const mobile = await browser.newPage({ viewport: { width: 390, height: 844 } });
await mobile.goto("http://127.0.0.1:4173");
await mobile.screenshot({ path: "media/04-mobile.png", fullPage: true });
await browser.close();
