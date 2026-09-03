import { Mesa, StatusMesa, EstadoComanda } from '@dotcomandas/shared';

export interface MesaMapaItem extends Mesa {
  corStatus: string;
  labelStatus: string;
  estadoComanda?: EstadoComanda;
}

export function obterCorETexturaMesa(statusMesa: StatusMesa, estadoComanda?: EstadoComanda): { cor: string; label: string } {
  if (estadoComanda === 'Aguardando Fechamento') {
    return { cor: '#eab308', label: '🟡 Aguardando Fechamento' };
  }

  switch (statusMesa) {
    case 'Livre':
      return { cor: '#22c55e', label: '🟢 Livre' };
    case 'Ocupada':
      return { cor: '#ef4444', label: '🔴 Em Atendimento' };
    case 'Reservada':
      return { cor: '#a855f7', label: '🟣 Reservada' };
    default:
      return { cor: '#64748b', label: '⚪ Desconhecida' };
  }
}

export function montarGradeMapaMesas(mesas: Mesa[], comandasAtivas: { mesaId: string; estado: EstadoComanda }[]): MesaMapaItem[] {
  return mesas.map((mesa) => {
    const comanda = comandasAtivas.find((c) => c.mesaId === mesa.id);
    const { cor, label } = obterCorETexturaMesa(mesa.status, comanda?.estado);

    return {
      ...mesa,
      corStatus: cor,
      labelStatus: label,
      estadoComanda: comanda?.estado,
    };
  });
}
