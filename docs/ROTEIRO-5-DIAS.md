# Cinco dias para estudar e explicar o Estoque em Foco

Reserve de 45 a 90 minutos por dia. O objetivo é entender e conseguir alterar o projeto, não decorar uma apresentação.

## Dia 1 · Problema e execução
Instale Node.js 24, extraia a pasta e execute `npm ci`, `npm run dev`. Compare o comportamento de busca por `café`, `CAFE` e `BEB-002`. Leia `data.ts` e identifique quais campos vêm de um estoque real. Explique em um minuto por que filtros combinados ajudam uma pessoa a encontrar itens para reposição. Não apresente a demonstração como sistema de cliente real.

## Dia 2 · TypeScript e regras
Leia `stock.ts`. Desenhe os estados: saldo zero é esgotado; saldo positivo até o mínimo é baixo; acima do mínimo é disponível. Execute `npm test`. Modifique apenas os dados de exemplo para observar o limite. Explique por que as condições de categoria, texto e situação usam AND e por que usamos todos os termos da busca. Encontre o teste que protege a imutabilidade.

## Dia 3 · Estado React
Leia `App.tsx`. Siga um `onChange` até a lista resultante. Explique a diferença entre estado armazenado e valor derivado. Modifique o texto de um indicador e execute `npm run build`. Responda: por que os indicadores usam a lista filtrada? Por que não usamos um efeito para recalcular totais? Por que não precisamos de Redux ou memoização com 12 registros?

## Dia 4 · Teclado, responsividade e testes
Instale o navegador com `npx playwright install chromium`, execute `npm run build` e `npm run test:e2e`. Percorra tudo com Tab e Shift+Tab. Selecione a tabela com o teclado e role horizontalmente. Faça uma busca sem resultado e confira o foco depois de limpar. Observe a tela em 320 px e 390 px. Se possível, experimente NVDA ou VoiceOver e registre o que realmente ocorreu; essa revisão manual não foi feita na entrega.

## Dia 5 · Entrevista e publicação
Grave uma explicação de até dois minutos: problema, três filtros, estado vazio, reset com foco, teste de limite. Explique uma escolha técnica e uma limitação. Leia o README em inglês. Revise o texto do LinkedIn com suas próprias palavras. Acrescente um link real somente depois de publicar. Não prometa integração com API, persistência ou conformidade WCAG.

## Perguntas para treinar
- O que acontece quando o saldo é igual ao mínimo? E quando é zero?
- O total em reais representa lucro, custo ou valor de venda do saldo?
- Como evitar que ordenar a lista modifique a fonte de dados?
- O que mudaria para 100 mil produtos e uma API lenta?
- Por que tipos TypeScript não validam dados recebidos de uma API em tempo de execução?
- O que os testes automatizados deixam de cobrir em acessibilidade?

Para uma API real, investigue validação da resposta, paginação no servidor, cancelamento de buscas antigas, estados de carregamento e erro, autorização e consistência dos dados. Essas funcionalidades não estão implementadas.
