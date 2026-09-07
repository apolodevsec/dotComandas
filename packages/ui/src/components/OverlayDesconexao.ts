export type StatusConexaoRede = 'conectado' | 'desconectado' | 'reconectando';

export interface EstadoOverlayDesconexao {
  exibirOverlay: boolean;
  bloquearInteracao: boolean;
  titulo?: string;
  mensagem?: string;
  corOverlay?: string;
}

/**
 * Retorna o estado do overlay de bloqueio em tela cheia baseado no status de conexão da rede/WebSocket.
 */
export function obterEstadoOverlayDesconexao(
  statusConexao: StatusConexaoRede
): EstadoOverlayDesconexao {
  switch (statusConexao) {
    case 'desconectado':
      return {
        exibirOverlay: true,
        bloquearInteracao: true,
        titulo: '⚠️ Conexão Perdida',
        mensagem:
          'A conexão de rede foi interrompida. Aguardando reconexão com o servidor para garantir a integridade dos pedidos.',
        corOverlay: 'rgba(19, 19, 19, 0.95)', // Carvão Profundo
      };
    case 'reconectando':
      return {
        exibirOverlay: true,
        bloquearInteracao: true,
        titulo: '🔄 Reconectando...',
        mensagem:
          'Tentando restabelecer sincronização em tempo real com a cozinha e o salão...',
        corOverlay: 'rgba(19, 19, 19, 0.92)',
      };
    case 'conectado':
    default:
      return {
        exibirOverlay: false,
        bloquearInteracao: false,
      };
  }
}
