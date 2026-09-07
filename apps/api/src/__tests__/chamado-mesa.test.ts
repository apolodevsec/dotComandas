import { describe, it, expect, beforeEach } from 'vitest';
import {
  solicitarChamadoMesa,
  obterChamadosAtivosMesa,
  limparChamadoMesa,
} from '../services/chamado-service.js';

describe('Ticket 19: Endpoint de Chamado de Mesa e Emissão de Eventos WebSocket no Backend', () => {
  beforeEach(() => {
    limparChamadoMesa('m1');
    limparChamadoMesa('m2');
  });

  it('deve registrar solicitação de chamado de atendimento para a mesa', () => {
    const chamado = solicitarChamadoMesa('m1', 'atendimento');

    expect(chamado.mesaId).toBe('m1');
    expect(chamado.tipo).toBe('atendimento');
    expect(chamado.statusMesaResultante).toBe('Aguardando Atendimento');
    expect(chamado.timestamp).toBeDefined();

    const chamadosAtivos = obterChamadosAtivosMesa();
    expect(chamadosAtivos.length).toBe(1);
    expect(chamadosAtivos[0].mesaId).toBe('m1');
  });

  it('deve registrar solicitação de chamado de fechamento da conta para a mesa', () => {
    const chamado = solicitarChamadoMesa('m2', 'fechamento');

    expect(chamado.mesaId).toBe('m2');
    expect(chamado.tipo).toBe('fechamento');
    expect(chamado.statusMesaResultante).toBe('Aguardando Fechamento');
  });

  it('deve rejeitar solicitação com tipo de chamado inválido', () => {
    expect(() => solicitarChamadoMesa('m1', 'invalido' as any)).toThrowError(
      'Tipo de chamado inválido'
    );
  });

  it('deve permitir ao garçom atender e limpar o chamado ativo de uma mesa', () => {
    solicitarChamadoMesa('m1', 'atendimento');
    expect(obterChamadosAtivosMesa().length).toBe(1);

    limparChamadoMesa('m1');
    expect(obterChamadosAtivosMesa().length).toBe(0);
  });
});
