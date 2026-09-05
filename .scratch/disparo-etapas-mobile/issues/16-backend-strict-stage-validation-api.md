# Ticket 16: Validação Estrita do Bloqueio Sequencial na API (Backend)

Status: ready-for-agent

## Descrição
Implementar o endpoint `POST /api/comandas/:id/etapas/:ordem/disparar` no serviço `apps/api` com validação de PIN de funcionário e verificação estrita de conclusão da etapa anterior no Astra DB.

## Tarefas
- [ ] Criar a rota de disparo de etapa no servidor Express (`apps/api`).
- [ ] Validar a autenticação de PIN do funcionário.
- [ ] Consultar o documento da comanda no Astra DB e validar se a etapa $N-1$ está totalmente concluída (`Pronto` / `Entregue`).
- [ ] Retornar HTTP 400 (`ETAPA_ANTERIOR_PENDENTE`) se a trava sequencial for violada.
- [ ] Atualizar o status da etapa para `Liberado` e mover os itens para a fila de preparo `Pendente`.
- [ ] Adicionar testes de integração para o endpoint da API.
