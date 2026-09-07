import { describe, it, expect } from 'vitest';
import {
  gerarTokenEstaticoMesa,
  validarAcessoMesaQrCodeEstatico,
} from '../services/mesa-service.js';

describe('Ticket 21: Validação de QR Code Estático e Roteamento', () => {
  it('deve gerar um token estático assinado permanente para a mesa', () => {
    const token = gerarTokenEstaticoMesa('mesa-1');
    expect(token).toBeDefined();
    expect(typeof token).toBe('string');
  });

  it('deve permitir acesso à rota /m/mesa-1 quando o token é válido e a comanda está aberta', () => {
    const token = gerarTokenEstaticoMesa('mesa-1');
    const resultado = validarAcessoMesaQrCodeEstatico('mesa-1', token, 'Aberta');

    expect(resultado.sessaoValida).toBe(true);
    expect(resultado.mesaId).toBe('mesa-1');
  });

  it('deve permitir acesso à rota /m/mesa-1 quando o token é válido e a comanda está em atendimento', () => {
    const token = gerarTokenEstaticoMesa('mesa-1');
    const resultado = validarAcessoMesaQrCodeEstatico('mesa-1', token, 'Em Atendimento');

    expect(resultado.sessaoValida).toBe(true);
  });

  it('deve recusar o acesso com mensagem amigável caso a comanda da mesa esteja fechada', () => {
    const token = gerarTokenEstaticoMesa('mesa-1');
    const resultado = validarAcessoMesaQrCodeEstatico('mesa-1', token, 'Fechada');

    expect(resultado.sessaoValida).toBe(false);
    expect(resultado.mensagemErro).toContain('Esta sessão de mesa foi encerrada');
  });

  it('deve recusar o acesso se o token estático for inválido ou adulterado', () => {
    const resultado = validarAcessoMesaQrCodeEstatico('mesa-1', 'token-invalido-adulterado', 'Aberta');

    expect(resultado.sessaoValida).toBe(false);
    expect(resultado.mensagemErro).toContain('Token de QR Code inválido ou adulterado');
  });
});
