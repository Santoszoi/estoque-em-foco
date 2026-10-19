import { test, expect } from "@playwright/test";
import AxeBuilder from "@axe-core/playwright";
test.beforeEach(async ({ page }) => {
  await page.goto("/");
});
test("combines filters and recalculates counts and totals", async ({
  page,
}) => {
  await expect(page.getByRole("status")).toHaveText(
    "12 de 12 produtos · 0 filtros ativos",
  );
  await page.getByLabel("Categoria", { exact: true }).selectOption("Bebidas");
  await page.getByLabel("Situação", { exact: true }).selectOption("baixo");
  await page.getByLabel("Nome ou código").fill("CAFE");
  await expect(page.getByRole("status")).toHaveText(
    "1 de 12 produtos · 3 filtros ativos",
  );
  await expect(page.locator("tbody tr")).toHaveCount(1);
  await expect(page.locator("tbody")).toContainText("Café gelado 250 ml");
  await expect(
    page.getByRole("region", { name: "Resumo dos resultados" }),
  ).toContainText("35,60");
});
test("empty state resets all controls and returns keyboard focus", async ({
  page,
}) => {
  await page.getByLabel("Nome ou código").fill("inexistente");
  await page.getByLabel("Categoria", { exact: true }).selectOption("Limpeza");
  await page.getByLabel("Ordenar por").selectOption("saldo");
  await expect(
    page.getByRole("heading", { name: "Nenhum produto encontrado" }),
  ).toBeVisible();
  await page.getByRole("button", { name: "Limpar e buscar novamente" }).click();
  await expect(page.getByLabel("Nome ou código")).toBeFocused();
  await expect(page.getByLabel("Categoria", { exact: true })).toHaveValue("");
  await expect(page.getByLabel("Ordenar por")).toHaveValue("nome");
  await expect(page.locator("tbody tr")).toHaveCount(12);
});
test("keyboard reaches all filters and can order by stock", async ({
  page,
}) => {
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("link", { name: "Pular para o conteúdo" }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await page.keyboard.press("Tab");
  await expect(
    page.getByRole("button", { name: "Limpar filtros", exact: true }),
  ).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Nome ou código")).toBeFocused();
  await page.keyboard.type("beb");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Categoria", { exact: true })).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Situação", { exact: true })).toBeFocused();
  await page.keyboard.press("Tab");
  await expect(page.getByLabel("Ordenar por")).toBeFocused();
  await page.keyboard.press("ArrowDown");
  await expect(page.locator("tbody tr").first()).toContainText("Suco de uva");
  await page.keyboard.press("Shift+Tab");
  await expect(page.getByLabel("Situação", { exact: true })).toBeFocused();
});
test("stock boundary, SKU search and reload behavior", async ({ page }) => {
  await page.getByLabel("Nome ou código").fill("mer-002");
  await expect(page.locator("tbody")).toContainText("Estoque baixo");
  await expect(page.locator("tbody")).toContainText("Feijão");
  await page.reload();
  await expect(page.locator("tbody tr")).toHaveCount(12);
});
test("automated accessibility scan in initial, filtered and empty states", async ({
  page,
}) => {
  for (const value of ["", "cafe", "inexistente"]) {
    await page.getByLabel("Nome ou código").fill(value);
    await expect(page.getByRole("status")).toContainText(
      value === "" ? "12 de 12" : value === "cafe" ? "1 de 12" : "0 de 12",
    );
    const result = await new AxeBuilder({ page })
      .withTags(["wcag2a", "wcag2aa", "wcag21aa"])
      .analyze();
    expect(result.violations).toEqual([]);
  }
});
test("mobile page fits width and table remains keyboard scrollable", async ({
  page,
}) => {
  for (const width of [390, 320]) {
    await page.setViewportSize({ width, height: 844 });
    expect(
      await page.evaluate(
        () => document.documentElement.scrollWidth <= window.innerWidth,
      ),
    ).toBe(true);
    const region = page.getByRole("region", { name: /Tabela de produtos/ });
    await region.focus();
    await page.keyboard.press("ArrowRight");
    await expect(region).toBeFocused();
    await page.getByLabel("Nome ou código").fill("sabao");
    await expect(page.locator("tbody tr")).toHaveCount(1);
    await page
      .getByRole("button", { name: "Limpar filtros", exact: true })
      .click();
  }
});
