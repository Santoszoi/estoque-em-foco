import { useRef, useState } from "react";
import { products } from "./data";
import {
  defaults,
  filterProducts,
  labels,
  statusOf,
  summarize,
  type Filters,
} from "./stock";
const currency = new Intl.NumberFormat("pt-BR", {
  style: "currency",
  currency: "BRL",
});
export default function App() {
  const [filters, setFilters] = useState<Filters>({ ...defaults });
  const search = useRef<HTMLInputElement>(null);
  const filtered = filterProducts(products, filters);
  const summary = summarize(filtered);
  const active =
    Number(Boolean(filters.query.trim())) +
    Number(Boolean(filters.category)) +
    Number(Boolean(filters.status));
  function set<K extends keyof Filters>(key: K, value: Filters[K]) {
    setFilters((previous) => ({ ...previous, [key]: value }));
  }
  function reset() {
    setFilters({ ...defaults });
    search.current?.focus();
  }
  return (
    <>
      <a href="#conteudo" className="skip">
        Pular para o conteúdo
      </a>
      <header>
        <a href="#conteudo" className="brand">
          <span className="brand-icon" aria-hidden="true">
            ▥
          </span>
          <span>
            Marcos Solutions<small>ESTUDOS DE FRONT-END / 02</small>
          </span>
        </a>
        <span className="demo">Dados fictícios · demonstração</span>
      </header>
      <main id="conteudo">
        <div className="intro">
          <div>
            <p className="eyebrow">OPERAÇÃO MAIS CLARA</p>
            <h1>
              Estoque em foco<span>.</span>
            </h1>
            <p className="lead">
              Encontre o que precisa. Veja o que pede reposição.
            </p>
          </div>
          <div className="scope">
            12 produtos de exemplo
            <br />
            <span>Sem conexão com estoque real</span>
          </div>
        </div>
        <section aria-label="Resumo dos resultados" className="metrics">
          <article>
            <span>Produtos encontrados</span>
            <strong>{summary.items.toString().padStart(2, "0")}</strong>
            <small>no recorte atual</small>
          </article>
          <article>
            <span>Unidades em estoque</span>
            <strong>{summary.units}</strong>
            <small>soma dos saldos filtrados</small>
          </article>
          <article className="attention">
            <span>Precisam de atenção</span>
            <strong>{summary.attention.toString().padStart(2, "0")}</strong>
            <small>estoque baixo ou esgotado</small>
          </article>
          <article>
            <span>Valor de venda do saldo</span>
            <strong className="money">
              {currency.format(summary.valueCents / 100)}
            </strong>
            <small>quantidade × preço de venda</small>
          </article>
        </section>
        <section className="workspace" aria-labelledby="products-title">
          <div className="section-heading">
            <div>
              <h2 id="products-title">Produtos</h2>
              <p>Combine os filtros para definir sua próxima ação.</p>
            </div>
            <button type="button" className="reset" onClick={reset}>
              Limpar filtros
            </button>
          </div>
          <form
            role="search"
            aria-label="Filtrar produtos"
            onSubmit={(e) => e.preventDefault()}
            className="filters"
          >
            <div className="search-field">
              <label htmlFor="search">Nome ou código</label>
              <input
                id="search"
                ref={search}
                type="search"
                value={filters.query}
                onChange={(e) => set("query", e.target.value)}
                placeholder="Ex.: café ou BEB-002"
                maxLength={100}
                autoComplete="off"
              />
            </div>
            <div>
              <label htmlFor="category">Categoria</label>
              <select
                id="category"
                value={filters.category}
                onChange={(e) =>
                  set("category", e.target.value as Filters["category"])
                }
              >
                <option value="">Todas as categorias</option>
                {["Bebidas", "Mercearia", "Limpeza"].map((c) => (
                  <option key={c}>{c}</option>
                ))}
              </select>
            </div>
            <div>
              <label htmlFor="status">Situação</label>
              <select
                id="status"
                value={filters.status}
                onChange={(e) =>
                  set("status", e.target.value as Filters["status"])
                }
              >
                <option value="">Todas as situações</option>
                <option value="disponivel">Disponível</option>
                <option value="baixo">Estoque baixo</option>
                <option value="esgotado">Esgotado</option>
              </select>
            </div>
            <div>
              <label htmlFor="sort">Ordenar por</label>
              <select
                id="sort"
                value={filters.sort}
                onChange={(e) => set("sort", e.target.value as Filters["sort"])}
              >
                <option value="nome">Nome (A–Z)</option>
                <option value="saldo">Menor saldo</option>
              </select>
            </div>
          </form>
          <div className="results-line">
            <p role="status" aria-live="polite" aria-atomic="true">
              {filtered.length} de {products.length} produtos · {active}{" "}
              {active === 1 ? "filtro ativo" : "filtros ativos"}
            </p>
            <span>Baixo: saldo positivo até o mínimo, inclusive</span>
          </div>
          {filtered.length ? (
            <div
              className="table-scroll"
              role="region"
              aria-label="Tabela de produtos, role horizontalmente em telas pequenas"
              tabIndex={0}
            >
              <table>
                <caption className="sr-only">
                  Produtos fictícios que correspondem aos filtros atuais
                </caption>
                <thead>
                  <tr>
                    <th scope="col">Produto</th>
                    <th scope="col">Categoria</th>
                    <th scope="col" className="numeric">
                      Saldo
                    </th>
                    <th scope="col" className="numeric">
                      Mínimo
                    </th>
                    <th scope="col" className="numeric">
                      Preço un.
                    </th>
                    <th scope="col">Situação</th>
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((p) => (
                    <tr key={p.id}>
                      <th scope="row">
                        <span className="product-name">{p.name}</span>
                        <span className="sku">{p.sku}</span>
                      </th>
                      <td>{p.category}</td>
                      <td className="numeric stock">{p.stock}</td>
                      <td className="numeric muted">{p.minimum}</td>
                      <td className="numeric">
                        {currency.format(p.priceCents / 100)}
                      </td>
                      <td>
                        <span className={"badge " + statusOf(p)}>
                          <span aria-hidden="true">●</span>{" "}
                          {labels[statusOf(p)]}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className="empty">
              <span aria-hidden="true">⌕</span>
              <h3>Nenhum produto encontrado</h3>
              <p>Tente outro nome, código ou combinação de filtros.</p>
              <button type="button" onClick={reset}>
                Limpar e buscar novamente
              </button>
            </div>
          )}
        </section>
        <footer>
          <span>React + TypeScript · Marcos Neves</span>
          <span>Os filtros não alteram quantidades nem registram vendas.</span>
        </footer>
      </main>
    </>
  );
}
