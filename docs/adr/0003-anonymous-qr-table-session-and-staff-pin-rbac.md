# Autenticação de Clientes por QR Code e Funcionários por PIN com RBAC

Decidimos que os **Clientes** acessarão o cardápio e a comanda de forma anônima e sem cadastro prévio via **Sessão de Mesa** gerada por QR Code. Para os **Funcionários** (Garçom, Cozinha, Caixa, Admin), a autenticação será realizada por usuário e **PIN numérico de 6 dígitos** com controle de acesso baseado em papéis (RBAC). Essa decisão elimina a fricção no atendimento ao cliente e permite que a equipe operacional altere o login de maneira extremamente rápida nos dispositivos compartilhados.
