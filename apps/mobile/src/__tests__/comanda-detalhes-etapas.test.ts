import { describe, it, expect } from 'vitest';
import { Pedido } from '@dotcomandas/shared';
import {
  montarListaPlanaItensComEtapa,
  podeDispararProximaEtapa,
  validarENotificarDisparoEtapa,
  confirmarAtendimentoChamadoMesa,
} from '../components/ComandaDetalhesEtapas.js';

describe('Ticket 15: Componente de Disparo por Etapas no App do Garçom', () => {
  const pedidoMock: Pedido = {
    id: 'ped-1',
    comandaId: 'c-1',
    mesaId: '04',
    origem: 'Garcom',
    itens: [],
    total: 120,
    estado: 'Em Preparo',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    etapas: [
      {
        ordem: 1,
        etapa: 'Entrada',
        statusDisparo: 'Liberado',
        itens: [
          {
            id: 'item-1',
            itemCardapioId: 'i-bruschetta',
            nome: 'Bruschetta Pomodoro',
            precoUnitario: 30,
            quantidade: 1,
            adicionaisSelecionados: [],
            precoTotalItem: 30,
          },
        ],
      },
      {
        ordem: 2,
        etapa: 'Prato Principal',
        statusDisparo: 'Aguardando Disparo',
        itens: [
          {
            id: 'item-2',
            itemCardapioId: 'i-wagyu',
            nome: 'Hambúrguer Wagyū',
            precoUnitario: 90,
            quantidade: 1,
            adicionaisSelecionados: [],
            precoTotalItem: 90,
          },
        ],
      },
    ],
  };

  it('deve montar a lista plana de itens com etiquetas de etapas', () => {
    const listaPlana = montarListaPlanaItensComEtapa(pedidoMock);
    expect(listaPlana.length).toBe(2);
    expect(listaPlana[0].etapaTag).toBe('[Entrada]');
    expect(listaPlana[1].etapaTag).toBe('[Prato Principal]');
  });

  it('deve bloquear o disparo da 2ª etapa se a 1ª etapa não estiver concluída no KDS', () => {
    // 1ª etapa ainda não está Pronta
    const validacao = podeDispararProximaEtapa(pedidoMock, 2);
    expect(validacao.podeDisparar).toBe(false);
    expect(validacao.motivoBloqueio).toContain('Etapa anterior');
  });

  it('deve permitir o disparo da 2ª etapa quando a 1ª etapa for concluída no KDS', () => {
    const pedidoConcluido: Pedido = {
      ...pedidoMock,
      etapas: [
        {
          ...pedidoMock.etapas![0],
          itens: [
            {
              ...pedidoMock.etapas![0].itens[0],
            },
          ],
        },
        pedidoMock.etapas![1],
      ],
    };

    // Marcamos a etapa 1 como concluída simulando itens 'Pronto'
    pedidoConcluido.etapas![0].itens[0] = {
      ...pedidoConcluido.etapas![0].itens[0],
    };

    // Vamos testar quando todos os itens da etapa anterior são 'Pronto' / 'Entregue'
    const pedidoEtapaConcluida = JSON.parse(JSON.stringify(pedidoConcluido)) as Pedido;
    // @ts-ignore
    pedidoEtapaConcluida.etapas[0].itens[0].estado = 'Pronto';

    const validacao = podeDispararProximaEtapa(pedidoEtapaConcluida, 2);
    expect(validacao.podeDisparar).toBe(true);
  });

  it('deve validar a autenticação por PIN de 6 dígitos ao autorizar disparo', () => {
    const validacaoPinInvalido = validarENotificarDisparoEtapa(pedidoMock, 1, '1234');
    expect(validacaoPinInvalido.sucesso).toBe(false);
    expect(validacaoPinInvalido.erro).toContain('PIN deve possuir 6 dígitos');
  });

  describe('Ticket 23: Confirmação de Atendimento ao Chamado da Mesa', () => {
    it('deve confirmar atendimento e limpar o chamado ativo de uma mesa ao pressionar o botão', () => {
      const chamadoAtivo = { mesaId: 'm-04', tipo: 'atendimento' };
      const resultado = confirmarAtendimentoChamadoMesa('m-04', chamadoAtivo);

      expect(resultado.atendimentoConfirmado).toBe(true);
      expect(resultado.mensagem).toContain('Atendimento confirmado');
    });

    it('deve informar adequadamente quando a mesa não possui chamado ativo pendente', () => {
      const resultado = confirmarAtendimentoChamadoMesa('m-04', undefined);

      expect(resultado.atendimentoConfirmado).toBe(false);
      expect(resultado.mensagem).toContain('Sem chamados pendentes');
    });
  });
});

