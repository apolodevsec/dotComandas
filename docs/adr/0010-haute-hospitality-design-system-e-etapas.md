# ADR 0010: Design System Haute Hospitality, Modo de Alto Contraste e Etapas de Cozinha

## Status
Aceito

## Contexto
Com a evolução da marca dotComandas para atender estabelecimentos de alta gastronomia e boutique hospitality, surgiu a necessidade de:
1. Padronizar o design system sob a estética **Haute Hospitality** (luxo silencioso, carvão profundo `#131313`/`#2A2A2A`, acentos em ouro-areia `#C49A6C`, fontes `Playfair Display` + `Plus Jakarta Sans` e cantos retangulares `0px`).
2. Garantir que a iluminação penumbral do salão e o ritmo acelerado da cozinha (KDS) coexistam com contraste operacional adequado.
3. Incorporar suporte domain-driven para o sequenciamento de pratos (*Etapas de Cozinha*) e sugestão de bebidas (*Harmonização*).

## Decisões
1. **Centralização do Design System em `@dotcomandas/ui`**:
   - Os tokens de cores, tipografia, bordas retas e componentes universais do Haute Hospitality serão extraídos para o pacote compartilhado `packages/ui` no monorepo.
2. **Modo de Alto Contraste Operacional no KDS**:
   - O painel KDS manterá a estética Haute Hospitality por padrão, mas contará com alternador para modo de alto contraste em horários de pico, intensificando a iluminação dos alertas de atraso (`> 15 min`).
3. **Modelagem de Etapas de Cozinha e Harmonização**:
   - Os pedidos e itens passam a suportar a propriedade `etapaCozinha` (`Entrada`, `Prato Principal`, `Sobremesa`) para liberação cadenciada de preparo na cozinha.
   - Adicionada a capacidade de vinculação técnica de rótulos/bebidas aos itens do cardápio (`harmonizacao`).
