# dotComandas

Sistema de comanda eletrônica, autoatendimento e gerenciamento de pedidos para restaurantes, bares e lanchonetes.

## Language

**Comanda**:
Registro de consumo único associado a uma mesa ou cartão de cliente, agregando todos os pedidos efetuados durante o atendimento.
_Avoid_: Conta, Ticket, Subtotal

**Documento de Comanda**:
Estrutura JSON atômica persistida no Astra DB que agrupa os dados da comanda, seus pedidos, itens e adicionais em um único registro.
_Avoid_: Linha de Comanda, Registro Relacional

**Mesa**:
Ponto físico de atendimento no estabelecimento, identificado por número e associado a um QR Code para acesso do cliente.
_Avoid_: Lugar, Assento

**Mapa de Mesas**:
Grade visual no aplicativo do garçom exibindo o status de cada mesa por cores (🟢 Livre, 🔴 Em Atendimento, 🟡 Aguardando Fechamento).
_Avoid_: Lista de Mesas, Tabela de Lugares

**Sessão de Mesa**:
Token de acesso temporário gerado ao ler o QR Code da mesa, permitindo que o cliente faça pedidos sem cadastro prévio.
_Avoid_: Auth Token, Login do Cliente

**PIN de Funcionário**:
Código numérico de 6 dígitos utilizado para autenticação rápida de garçons, cozinheiros e caixas nas interfaces operacionais.
_Avoid_: Senha do Garçom, Passcode

**Teclado PIN (PIN Pad)**:
Interface tátil numérica para digitação rápida do código de 6 dígitos pelos funcionários no aplicativo móvel ou web.
_Avoid_: Teclado Numérico Generico

**Papel (Role)**:
Perfil de acesso atribuído a um funcionário (ex.: Garçom, Cozinha, Caixa, Administrador) que estabelece as permissões no sistema (RBAC).
_Avoid_: Permissão, Grupo

**Pedido**:
Solicitação de um ou mais itens do cardápio enviada pelo Cliente ou Garçom para a fila de preparo.
_Avoid_: Solicitação, Requisição, Order

**Estado do Pedido**:
Fase atual de preparo e entrega do pedido (`Pendente` -> `Em Preparo` -> `Pronto` -> `Entregue` -> `Cancelado`).
_Avoid_: Status do Prato, Fase do Pedido

**Alerta de Espera**:
Sinalização visual no KDS disparada quando um pedido permanece em preparo acima do tempo limite tolerável (15 minutos).
_Avoid_: Warning de Atraso, Timer Excedido

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

**Etapa de Cozinha**:
Sequenciamento e momento de disparo para liberação de preparo de um item ou grupo de pedidos na cozinha (ex.: Entrada, Prato Principal, Sobremesa), mantendo o ritmo cadenciado do atendimento.
_Avoid_: Rodada de Pratos, Marcha, Turno de Preparo

**Harmonização**:
Sugestão técnica e vinculação de bebidas ou rótulos a um item do cardápio ou etapa de degustação para enriquecer a experiência do cliente.
_Avoid_: Combo, Pairing, Sugestão do Chef

**Chamado de Mesa**:
Alerta em tempo real disparado pelo cliente em seu dispositivo móvel (para suporte ou solicitação de conta) que sinaliza o garçom piscando a mesa em amarelo no Mapa de Mesas e emitindo um aviso sonoro/push.
_Avoid_: Notificação de Garçom, Chamada de Atendimento, Bip
