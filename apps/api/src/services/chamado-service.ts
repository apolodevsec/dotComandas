export type TipoChamadoMesa = 'atendimento' | 'fechamento';

export interface ChamadoMesa {
  id: string;
  mesaId: string;
  tipo: TipoChamadoMesa;
  statusMesaResultante: 'Aguardando Atendimento' | 'Aguardando Fechamento';
  timestamp: string;
}

// Armazenamento em memória de chamados ativos (espelhado no Astra DB se conectado)
let chamadosAtivosMemoria: ChamadoMesa[] = [];

/**
 * Solicita um chamado de mesa (atendimento ou fechamento de conta).
 */
export function solicitarChamadoMesa(
  mesaId: string,
  tipo: TipoChamadoMesa
): ChamadoMesa {
  if (tipo !== 'atendimento' && tipo !== 'fechamento') {
    throw new Error('Tipo de chamado inválido. Use "atendimento" ou "fechamento".');
  }

  const statusMesaResultante =
    tipo === 'atendimento' ? 'Aguardando Atendimento' : 'Aguardando Fechamento';

  const novoChamado: ChamadoMesa = {
    id: `chamado-${Date.now()}-${Math.random().toString(36).substring(2, 6)}`,
    mesaId,
    tipo,
    statusMesaResultante,
    timestamp: new Date().toISOString(),
  };

  // Remove chamados antigos da mesma mesa para evitar duplicidade
  chamadosAtivosMemoria = chamadosAtivosMemoria.filter((c) => c.mesaId !== mesaId);
  chamadosAtivosMemoria.push(novoChamado);

  return novoChamado;
}

/**
 * Retorna a lista de chamados de mesa atualmente ativos.
 */
export function obterChamadosAtivosMesa(): ChamadoMesa[] {
  return [...chamadosAtivosMemoria];
}

/**
 * Limpa/atende o chamado ativo de uma mesa específica.
 */
export function limparChamadoMesa(mesaId: string): void {
  chamadosAtivosMemoria = chamadosAtivosMemoria.filter((c) => c.mesaId !== mesaId);
}
