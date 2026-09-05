# Ticket 15: Componente de Disparo por Etapas no App do Garçom (Mobile)

Status: ready-for-agent

## Descrição
Desenvolver o componente de visualização de comanda por etapas no aplicativo móvel (`apps/mobile`), exibindo a lista plana com marcadores de etapas e o botão de disparo condicional protegido por PIN.

## Tarefas
- [ ] Criar o componente `ComandaDetalhesEtapas.ts` em `apps/mobile/src/components`.
- [ ] Renderizar os itens em lista plana com etiquetas de etapas (ex.: `[Entrada]`, `[Prato Principal]`).
- [ ] Exibir o botão "🚀 Disparar Próxima Etapa" habilitado apenas quando a etapa anterior estiver concluída no KDS.
- [ ] Integrar modal/teclado de digitação de `PIN de Funcionário` para confirmação do disparo.
- [ ] Adicionar testes unitários para o componente mobile.
