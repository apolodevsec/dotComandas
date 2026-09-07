# Ticket 21: Estrutura de Rotas Web Unificadas e Validação de QR Code Estático

Status: resolved

## Descrição
Configurar o roteamento unificado no Next.js (`apps/web`) para as rotas `/m/:mesaId` (Cliente), `/kds` (Cozinha) e `/caixa` (Caixa), implementando a validação do token estático assinado do QR Code contra o estado da Comanda no Astra DB.

## Tarefas
- [x] Configurar o roteamento Next.js para `/m/[mesaId]`, `/kds` e `/caixa`.
- [x] Implementar a validação do token estático JWT do QR Code via `gerarTokenEstaticoMesa` e `validarAcessoMesaQrCodeEstatico`.
- [x] Validar no Astra DB se a `Comanda` da mesa está `Aberta` ou `Em Atendimento`.
- [x] Exibir mensagem amigável de sessão encerrada caso a comanda esteja `Fechada`.
- [x] Adicionar testes de integração para o roteamento e validação de tokens estáticos (`qr-estatico-roteamento.test.ts`).

