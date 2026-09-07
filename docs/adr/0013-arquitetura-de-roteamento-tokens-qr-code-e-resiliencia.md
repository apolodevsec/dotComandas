# ADR 0013: Arquitetura de Roteamento de Serviços, QR Code Estático e Bloqueio de Conexão

## Status
Aceito

## Contexto
A infraestrutura do **dotComandas** necessita de regras claras para o roteamento de suas aplicações (Web PWA para clientes, KDS para a cozinha, App do Garçom e API), validação de segurança nos QR Codes das mesas e comportamento defensivo em caso de oscilações de rede no ambiente de alta gastronomia.

## Decisão

1. **Roteamento em Domínio Único**:
   - Todas as aplicações e serviços serão expostos sob o mesmo domínio principal (`https://dotcomandas.com`) com separação por prefixos de rota:
     - `/m/:mesaId?token=:jwtTokenHash` -> Interface PWA do Cliente (Next.js em `apps/web`)
     - `/kds` -> Painel KDS da Cozinha em Rota Única Global (Next.js em `apps/web`)
     - `/caixa` -> Painel do Caixa (Next.js em `apps/web`)
     - `/api/*` -> Backend API REST e WebSockets (Node.js em `apps/api`)

2. **QR Code com Token Estático Assinado por Mesa**:
   - O QR Code impresso em cada mesa física conterá um token assinado permanente (`/m/:mesaId?token=:jwtTokenHash`). A validação do acesso dependerá estritamente do estado ativo da `Comanda` no Astra DB (`Aberta` vs `Fechada`), eliminando a necessidade de reimpressão de QR Codes.

3. **Overlay Rígido de Desconexão (Tela Cheia)**:
   - Em caso de queda na conexão WebSocket ou HTTP no KDS da cozinha ou no PWA do cliente, a interface exibirá um overlay de bloqueio em tela cheia impedindo interações até que a sincronia seja restabelecida, evitando a perda ou duplicidade de pedidos.

4. **Navegação do Garçom no Mapa de Mesas**:
   - O aplicativo móvel do garçom (`apps/mobile`) terá o **Mapa de Mesas** como tela principal (Root).
   - Ao tocar em uma mesa com chamado ativo (piscando em amarelo 🟡), o aplicativo navega diretamente para a tela `ComandaDetalhesEtapas` contendo o botão em destaque *"✅ Confirmar Atendimento"*, que limpa o alerta piscante no servidor e silencia os avisos sonoros.

## Consequências
- Simplifica a logística de impressão de QR Codes nas mesas.
- Garante total integridade nos pedidos ao bloquear interações durante quedas de rede.
- Proporciona navegação direta e ágil para o garçom no atendimento de mesas.
