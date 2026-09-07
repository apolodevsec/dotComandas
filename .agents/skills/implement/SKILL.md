---
name: implement
description: "Implement a piece of work based on a spec or set of tickets using TDD and pushing increments to GitHub."
---

Implement the work described by the user in the spec or tickets.

## Regras de Fluxo e Prática TDD

1. **Prática TDD Obrigatória (Red → Green → Refactor)**:
   - Toda implementação deve seguir o fluxo TDD em fatias verticais.
   - Defina os *seams* (fronteiras públicas) com o usuário e escreva primeiro o teste que falha (Red).
   - Desenvolva apenas o código mínimo estritamente necessário para fazer o teste passar (Green).

2. **Validação Regular**:
   - Execute a checagem de tipos (`typecheck`) e os testes individuais a cada ciclo.
   - Execute a suíte de testes completa ao finalizar o ciclo de fatias.

3. **Envio de Incrementos ao GitHub**:
   - A cada incremento/fatidade concluída com testes passando com sucesso, faça o commit das alterações.
   - Suba (*push*) imediatamente os commits para o repositório remoto no GitHub (`git push`).

4. **Revisão**:
   - Ao finalizar todas as etapas, utilize a skill `/code-review` para revisão de padrões e especificação.

