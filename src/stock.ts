export type Category = "Bebidas" | "Mercearia" | "Limpeza";
export type StockStatus = "disponivel" | "baixo" | "esgotado";
export type Product = Readonly<{
  id: number;
  sku: string;
  name: string;
  category: Category;
  stock: number;
  minimum: number;
  priceCents: number;
}>;
export type Filters = {
  query: string;
  category: Category | "";
  status: StockStatus | "";
  sort: "nome" | "saldo";
};
export const defaults: Filters = {
  query: "",
  category: "",
  status: "",
  sort: "nome",
};
export function statusOf(product: Product): StockStatus {
  if (product.stock === 0) return "esgotado";
  return product.stock <= product.minimum ? "baixo" : "disponivel";
}
export const labels: Record<StockStatus, string> = {
  disponivel: "Disponível",
  baixo: "Estoque baixo",
  esgotado: "Esgotado",
};
export function normalize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLocaleLowerCase("pt-BR")
    .trim();
}
export function filterProducts(
  products: readonly Product[],
  filters: Filters,
): Product[] {
  const terms = normalize(filters.query).split(/\s+/).filter(Boolean);
  const result = products.filter((p) => {
    const text = normalize(`${p.name} ${p.sku}`);
    return (
      terms.every((term) => text.includes(term)) &&
      (!filters.category || p.category === filters.category) &&
      (!filters.status || statusOf(p) === filters.status)
    );
  });
  return result.sort(
    (a, b) =>
      (filters.sort === "saldo" ? a.stock - b.stock : 0) ||
      a.name.localeCompare(b.name, "pt-BR") ||
      a.id - b.id,
  );
}
export function summarize(products: readonly Product[]) {
  return {
    items: products.length,
    units: products.reduce((sum, p) => sum + p.stock, 0),
    attention: products.filter((p) => statusOf(p) !== "disponivel").length,
    valueCents: products.reduce((sum, p) => sum + p.stock * p.priceCents, 0),
  };
}
