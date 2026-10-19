# Texto para revisar e publicar com o vídeo

Como encontrar rapidamente os produtos que precisam de reposição?

No Estoque em Foco, explorei esse problema com uma interface em React e TypeScript e uma base de 12 produtos fictícios.

A tela combina busca por nome ou código, categoria e situação do saldo. A busca encontra “café” mesmo quando digitamos “cafe”. Também permite ordenar pelo menor saldo.

Uma decisão importante foi fazer os indicadores acompanharem os filtros: produtos encontrados, unidades, itens que precisam de atenção e valor de venda do saldo. Assim, o resumo corresponde ao que aparece na tabela.

O fluxo inclui estado sem resultados, limpeza dos filtros com retorno do foco à busca e navegação por teclado. Em telas menores, a tabela mantém os dados e permite rolagem horizontal.

Validei as regras com 10 testes unitários e o comportamento da interface com 6 testes no navegador. A compilação também passou. Os testes cobrem combinações de filtros, limite do estoque mínimo, ordenação sem alterar os dados originais e recuperação do estado vazio.

As verificações automatizadas de acessibilidade não substituem avaliação manual com leitor de tela, que permanece pendente.

É um estudo de portfólio com dados fictícios, sem API ou movimentação de estoque real.

#React #TypeScript #Frontend #DesenvolvimentoWeb #TestesDeSoftware

---
Antes de publicar: confira o vídeo, leia o código e explique o que você entendeu com suas palavras. Adicione a URL do repositório apenas depois de criá-lo. Não foi feita publicação automática.
