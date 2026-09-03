# dotComandas

Sistema de comanda eletrônica, autoatendimento e gerenciamento de pedidos para restaurantes, bares e lanchonetes.

## Language

**Comanda**:
Registro de consumo único associado a uma mesa ou cartão de cliente, agregando todos os pedidos efetuados durante o atendimento.
_Avoid_: Conta, Ticket, Subtotal

**Mesa**:
Ponto físico de atendimento no estabelecimento, identificado por número e associado a um QR Code para acesso do cliente.
_Avoid_: Lugar, Assento

**Sessão de Mesa**:
Token de acesso temporário gerado ao ler o QR Code da mesa, permitindo que o cliente faça pedidos sem cadastro prévio.
_Avoid_: Auth Token, Login do Cliente

**PIN de Funcionário**:
Código numérico de 6 dígitos utilizado para autenticação rápida de garçons, cozinheiros e caixas nas interfaces operacionais.
_Avoid_: Senha do Garçom, Passcode

**Papel (Role)**:
Perfil de acesso atribuído a um funcionário (ex.: Garçom, Cozinha, Caixa, Administrador) que estabelece as permissões no sistema (RBAC).
_Avoid_: Permissão, Grupo

**Pedido**:
Solicitação de um ou mais itens do cardápio enviada pelo Cliente ou Garçom para a fila de preparo.
_Avoid_: Solicitação, Requisição, Order

**Estado do Pedido**:
Fase atual de preparo e entrega do pedido (`Pendente` -> `Em Preparo` -> `Pronto` -> `Entregue` -> `Cancelado`).
_Avoid_: Status do Prato, Fase do Pedido

**Estado da Comanda**:
Situação atual da comanda no estabelecimento (`Aberta` -> `Em Atendimento` -> `Aguardando Fechamento` -> `Fechada` -> `Cancelada`).
_Avoid_: Status da Conta, Fase da Comanda

**Item do Cardápio**:
Produto cadastrado disponível para venda, contendo nome, preço, categoria e possíveis adicionais ou observações.
_Avoid_: Produto, Prato

**Grupo de Adicionais**:
Conjunto de opções vinculadas a um item do cardápio, que podem ser de seleção única (ex.: Ponto da Carne) ou seleção múltipla com custo (ex.: Adicionais).
_Avoid_: Complementos, Modificadores

**KDS (Kitchen Display System)**:
Painel em tempo real utilizado pela equipe de cozinha e bar para visualizar e transicionar os estados de preparo dos pedidos.
_Avoid_: Tela de Pedidos, Monitor da Cozinha

**Fechamento**:
Operação realizada pelo Caixa para consolidar os pedidos de uma comanda, aplicar taxas/descontos e registrar a liquidação do pagamento.
_Avoid_: Checkout, Baixa de Comanda

**Forma de Pagamento**:
Método financeiro utilizado para liquidar o valor total no fechamento da comanda (Dinheiro, Crédito, Débito, Pix).
_Avoid_: Meio de Pagamento, Modalidade de Pago
