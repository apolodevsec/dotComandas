import { describe, it, expect } from 'vitest';
import {
  obterEstadoOverlayDesconexao,
  StatusConexaoRede,
} from '../components/OverlayDesconexao.js';

describe('Ticket 22: Overlay Rígido de Bloqueio por Desconexão', () => {
  it('deve exibir overlay rígido de bloqueio quando a conexão for perdida (desconectado)', () => {
    const estado = obterEstadoOverlayDesconexao('desconectado');

    expect(estado.exibirOverlay).toBe(true);
    expect(estado.bloquearInteracao).toBe(true);
    expect(estado.titulo).toBe('⚠️ Conexão Perdida');
    expect(estado.mensagem).toContain('Aguardando reconexão com o servidor');
  });

  it('deve manter o overlay ativado durante a tentativa de reconexão', () => {
    const estado = obterEstadoOverlayDesconexao('reconectando');

    expect(estado.exibirOverlay).toBe(true);
    expect(estado.bloquearInteracao).toBe(true);
    expect(estado.titulo).toBe('🔄 Reconectando...');
  });

  it('deve ocultar o overlay e liberar interações quando a conexão estiver restabelecida (conectado)', () => {
    const estado = obterEstadoOverlayDesconexao('conectado');

    expect(estado.exibirOverlay).toBe(false);
    expect(estado.bloquearInteracao).toBe(false);
  });
});
