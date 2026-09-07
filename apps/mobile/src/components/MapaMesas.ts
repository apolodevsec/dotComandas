import { Mesa, StatusMesa, EstadoComanda } from '@dotcomandas/shared';

export interface ChamadoAtivoMesa {
  mesaId: string;
  tipo: 'atendimento' | 'fechamento';
}

export interface MesaMapaItem extends Mesa {
  corStatus: string;
  labelStatus: string;
  estadoComanda?: EstadoComanda;
  alertaPiscante: boolean;
  efeitoSonoro: boolean;
}

export function obterCorETexturaMesa(
  statusMesa: StatusMesa,
  estadoComanda?: EstadoComanda,
  chamadoAtivo?: ChamadoAtivoMesa
): { cor: string; label: string; alertaPiscante: boolean; efeitoSonoro: boolean } {
  if (chamadoAtivo) {
    const label =
      chamadoAtivo.tipo === 'fechamento'
        ? '🟡 Aguardando Fechamento'
        : '🟡 Aguardando Atendimento';
    return {
      cor: '#f59e0b',
      label,
      alertaPiscante: true,
      efeitoSonoro: true,
    };
  }

  if (estadoComanda === 'Aguardando Fechamento') {
    return {
      cor: '#eab308',
      label: '🟡 Aguardando Fechamento',
      alertaPiscante: false,
      efeitoSonoro: false,
    };
  }

  switch (statusMesa) {
    case 'Livre':
      return { cor: '#22c55e', label: '🟢 Livre', alertaPiscante: false, efeitoSonoro: false };
    case 'Ocupada':
      return { cor: '#ef4444', label: '🔴 Em Atendimento', alertaPiscante: false, efeitoSonoro: false };
    case 'Reservada':
      return { cor: '#a855f7', label: '🟣 Reservada', alertaPiscante: false, efeitoSonoro: false };
    default:
      return { cor: '#64748b', label: '⚪ Desconhecida', alertaPiscante: false, efeitoSonoro: false };
  }
}

export function montarGradeMapaMesas(
  mesas: Mesa[],
  comandasAtivas: { mesaId: string; estado: EstadoComanda }[],
  chamadosAtivos: ChamadoAtivoMesa[] = []
): MesaMapaItem[] {
  return mesas.map((mesa) => {
    const comanda = comandasAtivas.find((c) => c.mesaId === mesa.id);
    const chamado = chamadosAtivos.find((ch) => ch.mesaId === mesa.id);
    const { cor, label, alertaPiscante, efeitoSonoro } = obterCorETexturaMesa(
      mesa.status,
      comanda?.estado,
      chamado
    );

    return {
      ...mesa,
      corStatus: cor,
      labelStatus: label,
      estadoComanda: comanda?.estado,
      alertaPiscante,
      efeitoSonoro,
    };
  });
}
