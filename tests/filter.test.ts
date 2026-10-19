import { test } from "node:test";
import assert from "node:assert/strict";
import {
  filterProducts,
  statusOf,
  summarize,
  defaults,
  normalize,
  type Product,
} from "../src/stock.ts";
const fixture: readonly Product[] = [
  {
    id: 1,
    name: "Café especial",
    sku: "BEB-001",
    category: "Bebidas",
    stock: 0,
    minimum: 5,
    priceCents: 199,
  },
  {
    id: 2,
    name: "Água mineral",
    sku: "BEB-002",
    category: "Bebidas",
    stock: 5,
    minimum: 5,
    priceCents: 250,
  },
  {
    id: 3,
    name: "Sabão líquido",
    sku: "LIM-001",
    category: "Limpeza",
    stock: 6,
    minimum: 5,
    priceCents: 350,
  },
];
test("zero, equal-to-minimum and above-minimum have distinct statuses", () =>
  assert.deepEqual(fixture.map(statusOf), ["esgotado", "baixo", "disponivel"]));
test("normalizes accents, case and outside spaces", () =>
  assert.equal(normalize("  ÁGUA  "), "agua"));
test("matches all search terms independent of order and accent", () =>
  assert.deepEqual(
    filterProducts(fixture, { ...defaults, query: "MINERAL agua" }).map(
      (p) => p.id,
    ),
    [2],
  ));
test("searches SKU with case insensitivity", () =>
  assert.deepEqual(
    filterProducts(fixture, { ...defaults, query: "beb-001" }).map((p) => p.id),
    [1],
  ));
test("combines category, status and text with AND semantics", () =>
  assert.deepEqual(
    filterProducts(fixture, {
      ...defaults,
      category: "Bebidas",
      status: "baixo",
      query: "agua",
    }).map((p) => p.id),
    [2],
  ));
test("incompatible category and status produce empty results", () =>
  assert.equal(
    filterProducts(fixture, {
      ...defaults,
      category: "Limpeza",
      status: "esgotado",
    }).length,
    0,
  ));
test("whitespace search does not remove products", () =>
  assert.equal(
    filterProducts(fixture, { ...defaults, query: "  \t " }).length,
    3,
  ));
test("sorts by ascending stock without mutating source order", () => {
  const source = [fixture[2], fixture[0], fixture[1]];
  assert.deepEqual(
    filterProducts(source, { ...defaults, sort: "saldo" }).map((p) => p.id),
    [1, 2, 3],
  );
  assert.deepEqual(
    source.map((p) => p.id),
    [3, 1, 2],
  );
});
test("summarizes only the selected products using integer cents", () =>
  assert.deepEqual(summarize([fixture[1], fixture[2]]), {
    items: 2,
    units: 11,
    attention: 1,
    valueCents: 3350,
  }));
test("empty summary is zero and input markup is only a search string", () => {
  assert.deepEqual(summarize([]), {
    items: 0,
    units: 0,
    attention: 0,
    valueCents: 0,
  });
  assert.equal(
    filterProducts(fixture, { ...defaults, query: "<script>" }).length,
    0,
  );
});
