import React from 'react';
import { Pedido, EstadoPedido } from '@dotcomandas/shared';

export interface KDSBoardProps {
  pedidos: Pedido[];
  onAvancarEstado: (pedidoId: string, novoEstado: EstadoPedido) => void;
  altoContraste?: boolean;
  onToggleAltoContraste?: () => void;
}

export function KDSBoard({
  pedidos,
  onAvancarEstado,
  altoContraste = false,
  onToggleAltoContraste,
}: KDSBoardProps) {
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
          <div>
            <span className="mesa-title">Mesa #{pedido.mesaId}</span>
            <span className="origem-badge">{pedido.origem}</span>
          </div>
          <span className={`timer-badge ${estaAtrasado ? 'atrasado' : ''}`}>
            {estaAtrasado ? '⚠️ ' : '⏱️ '}{minutos} MIN
          </span>
        </div>

        <ul className="pedido-itens">
          {pedido.itens.map((item) => (
            <li key={item.id} className="item-linha">
              <span className="item-quantidade">{item.quantidade}x</span>{' '}
              <span className="item-nome">{item.nome}</span>
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
            className="btn-primary"
            onClick={() => onAvancarEstado(pedido.id, proximoEstado)}
          >
            {textoBotao}
          </button>
        )}
      </div>
    );
  };

  return (
    <div className={`kds-container ${altoContraste ? 'alto-contraste-operacional' : ''}`}>
      <header className="kds-header">
        <div>
          <div className="label-caps-sm" style={{ color: 'var(--primary)', marginBottom: '0.25rem' }}>
            HAUTE HOSPITALITY — KITCHEN DISPLAY SYSTEM
          </div>
          <div className="kds-title">Cozinha & Gastronomia</div>
        </div>
        <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
          {onToggleAltoContraste && (
            <button
              className="btn-secondary"
              onClick={onToggleAltoContraste}
              style={{ width: 'auto', padding: '0.4rem 0.8rem', fontSize: '10px' }}
            >
              {altoContraste ? '⚡ ALTO CONTRASTE: ATIVO' : '👁️ MODO ALTO CONTRASTE'}
            </button>
          )}
          <div className="kds-status-badge">
            ASTRA DB CONECTADO 🟢
          </div>
        </div>
      </header>

      <main className="kds-grid">
        <section className="kds-column pendente">
          <div className="column-header">
            <span>PENDENTES</span>
            <span className="column-header-tag">{pendentes.length}</span>
          </div>
          <div className="column-body">
            {pendentes.map((p) => renderCardPedido(p, 'Em Preparo', 'INICIAR PREPARO'))}
          </div>
        </section>

        <section className="kds-column em-preparo">
          <div className="column-header">
            <span>EM PREPARO</span>
            <span className="column-header-tag">{emPreparo.length}</span>
          </div>
          <div className="column-body">
            {emPreparo.map((p) => renderCardPedido(p, 'Pronto', 'CONCLUIR PRATO'))}
          </div>
        </section>

        <section className="kds-column pronto">
          <div className="column-header">
            <span>PRONTOS</span>
            <span className="column-header-tag">{prontos.length}</span>
          </div>
          <div className="column-body">
            {prontos.map((p) => renderCardPedido(p, 'Entregue', 'FINALIZAR ENTREGA'))}
          </div>
        </section>
      </main>
    </div>
  );
}
