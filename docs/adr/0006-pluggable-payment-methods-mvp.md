# Registro de Pagamentos no Caixa e Arquitetura Plugável de Gateways

No MVP, o sistema suportará pagamentos nas modalidades Dinheiro, Cartão de Crédito, Cartão de Débito e Pix com **registro manual efetuado pelo operador de Caixa**. A arquitetura da API de pagamentos é desenhada de forma modular/plugável (*Strategy Pattern*) para permitir a integração futura com gateways de pagamento em tempo real (ex.: Pix dinâmico via Mercado Pago, EFI ou PagBank).
