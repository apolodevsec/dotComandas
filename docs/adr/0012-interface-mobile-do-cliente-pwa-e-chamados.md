# ADR 0012: Interface Mobile do Cliente (PWA) e Chamados no Mapa de Mesas

## Status
Aceito

## Contexto
O autoatendimento presencial no **dotComandas** necessita de uma interface fluida e sem fricção para o cliente final na mesa, integrada à gestão da equipe de salão (garçons) e da cozinha (KDS).

## Decisão

1. **Plataforma React Native Web (PWA)**:
   - A interface do cliente será desenvolvida em React Native Web dentro de `apps/mobile`, permitindo acesso instantâneo via navegador do smartphone ao ler o QR Code da mesa sem instalar aplicativos nem criar cadastro.

2. **Comanda 100% Anônima por Mesa**:
   - Os pedidos são agregados estritamente pela `Sessão de Mesa` e identificados unicamente pelo número da Mesa, garantindo a simplicidade do modelo de dados no Astra DB.

3. **Navegação por Categorias Tradicionais**:
   - O cardápio digital do cliente será estruturado em abas clássicas de categorias (*Entradas*, *Pratos*, *Bebidas*, *Sobremesas*).

4. **Modal Bottom Sheet para Customizações**:
   - As opções de adicionais com alteração de preço (ex.: `+R$ 5,00`), seleções obrigatórias (ex.: ponto da carne) e observações de restrições alimentares serão apresentadas em um painel deslizante inferior (*Bottom Sheet*).

5. **Autoatendimento Direto e Notificação Dupla ao Garçom**:
   - A submissão do pedido envia os itens diretamente para a fila do KDS da cozinha.
   - Chamados do cliente ("Chamar Garçom" para dúvidas ou solicitar a conta) disparam um evento WebSocket que faz o cartão da mesa piscar em amarelo (🟡 `Aguardando Atendimento` / `Aguardando Fechamento`) no *Mapa de Mesas* e enviam notificação push/sonora ao garçom responsável.

6. **Notificações em Tempo Real via Toast Flutuante**:
   - Alterações no `Estado do Pedido` (`Pendente` -> `Em Preparo` -> `Pronto`) disparam toasts flutuantes na tela do cliente para mantê-lo informado sobre o progresso da refeição.

## Consequências
- Elimina o atrito de entrada do cliente na mesa.
- Garante alinhamento imediato entre cliente, cozinha e garçom através do *Mapa de Mesas*.
- Mantém o modelo de dados simples e atômico.
