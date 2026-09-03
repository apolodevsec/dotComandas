import React from 'react';
import { Pedido, EstadoPedido } from '@dotcomandas/shared';

export interface KDSBoardProps {
  pedidos: Pedido[];
  onAvancarEstado: (pedidoId: string, novoEstado: EstadoPedido) => void;
}

export function KDSBoard({ pedidos, onAvancarEstado }: KDSBoardProps) {
  const pendentes = pedidos.filter((p) => p.estado === 'Pendente');
  const emPreparo = pedidos.filter((p) => p.estado === 'Em Preparo');
  const prontos = pedidos.filter((p) => p.estado === 'Pronto');

  const calcularMinutosEspera = (createdAt: string) => {
    const inicio = new Date(createdAt).getTime();
    const agora = Date.now();
    return Math.floor((agora - inicio) / (1000 * 60));
  };

  const renderCardPedido = (pedido: Pedido, proximoEstado?: EstadoPedido, textoBotao?: string) => {
    const minutos = calcularMinutosEspera(pedido.createdAt);
    const estaAtrasado = minutos >= 15;

    return (
      <div
        key={pedido.id}
        className={`pedido-card ${estaAtrasado ? 'alerta-atraso' : ''}`}
        data-testid={`pedido-card-${pedido.id}`}
      >
        <div className="pedido-header">
          <span>Mesa #{pedido.mesaId}</span>
          <span className={`timer-badge ${estaAtrasado ? 'atrasado' : ''}`}>
            ⏱️ {minutos} min {estaAtrasado ? '⚠️ ATRASADO' : ''}
          </span>
        </div>

        <ul className="pedido-itens">
          {pedido.itens.map((item) => (
            <li key={item.id} className="item-linha">
              <strong>{item.quantidade}x</strong> {item.nome}
              {item.adicionaisSelecionados.length > 0 && (
                <div className="item-adicionais">
                  + {item.adicionaisSelecionados.map((a) => a.nome).join(', ')}
                </div>
              )}
              {item.observacao && (
                <div className="item-observacao">Obs: "{item.observacao}"</div>
              )}
            </li>
          ))}
        </ul>

        {proximoEstado && textoBotao && (
          <button
            className={`btn-acao ${proximoEstado === 'Pronto' ? 'avancar' : ''}`}
            onClick={() => onAvancarEstado(pedido.id, proximoEstado)}
          >
            {textoBotao}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className="kds-container">
      <header className="kds-header">
        <div className="kds-title">🍳 KDS - Cozinha em Tempo Real</div>
        <div>Status: Conectado ao Astra DB 🟢</div>
      </header>

      <main className="kds-grid">
        <section className="kds-column pendente">
          <div className="column-header">
            <span>🟡 Pendentes</span>
            <span>({pendentes.length})</span>
          </div>
          <div className="column-body">
            {pendentes.map((p) => renderCardPedido(p, 'Em Preparo', '▶ INICIAR PREPARO'))}
          </div>
        </section>

        <section className="kds-column em-preparo">
          <div className="column-header">
            <span>🔵 Em Preparo</span>
            <span>({emPreparo.length})</span>
          </div>
          <div className="column-body">
            {emPreparo.map((p) => renderCardPedido(p, 'Pronto', '✔ CONCLUIR PRATO'))}
          </div>
        </section>

        <section className="kds-column pronto">
          <div className="column-header">
            <span>🟢 Prontos</span>
            <span>({prontos.length})</span>
          </div>
          <div className="column-body">
            {prontos.map((p) => renderCardPedido(p, 'Entregue', '🚀 ENTREGAR'))}
          </div>
        </section>
      </main>
    </div>
  );
}
