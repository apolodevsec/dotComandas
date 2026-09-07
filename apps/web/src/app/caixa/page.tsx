'use client';

import React, { useState } from 'react';

interface ComandaCaixaDemo {
  id: string;
  mesaNumero: number;
  cliente: string;
  itens: { nome: string; quantidade: number; valorTotal: number }[];
  subtotal: number;
  desconto: number;
  totalLiquido: number;
  estado: 'Aberta' | 'Aguardando Fechamento' | 'Fechada';
}

const COMANDAS_DEMO: ComandaCaixaDemo[] = [
  {
    id: 'c-101',
    mesaNumero: 1,
    cliente: 'Mesa 01 (Sessão QR Code)',
    itens: [
      { nome: 'Risotto de Cogumelos Selvagens', quantidade: 2, valorTotal: 112.0 },
      { nome: 'Vinho Tinto Reserva Barolo', quantidade: 1, valorTotal: 180.0 },
      { nome: 'Petit Gâteau de Chocolate 70%', quantidade: 2, valorTotal: 48.0 },
    ],
    subtotal: 340.0,
    desconto: 0,
    totalLiquido: 340.0,
    estado: 'Aguardando Fechamento',
  },
  {
    id: 'c-102',
    mesaNumero: 4,
    cliente: 'Mesa 04 (Garçom Lucas)',
    itens: [
      { nome: 'Hambúrguer Artesanal Wagyū', quantidade: 3, valorTotal: 97.5 },
      { nome: 'Cerveja Artesanal IPA', quantidade: 4, valorTotal: 64.0 },
    ],
    subtotal: 161.5,
    desconto: 10.0,
    totalLiquido: 151.5,
    estado: 'Aguardando Fechamento',
  },
];

export default function CaixaPage() {
  const [comandas, setComandas] = useState<ComandaCaixaDemo[]>(COMANDAS_DEMO);
  const [comandaSelecionada, setComandaSelecionada] = useState<ComandaCaixaDemo | null>(
    COMANDAS_DEMO[0]
  );
  const [formaPagamento, setFormaPagamento] = useState<'Pix' | 'CartaoCredito' | 'CartaoDebito' | 'Dinheiro'>('Pix');
  const [mensagemSucesso, setMensagemSucesso] = useState('');

  const handleFinalizarFechamento = () => {
    if (!comandaSelecionada) return;

    setComandas((prev) =>
      prev.map((c) => (c.id === comandaSelecionada.id ? { ...c, estado: 'Fechada' } : c))
    );

    setMensagemSucesso(
      `✅ Comanda da Mesa #${comandaSelecionada.mesaNumero} fechada com sucesso via ${formaPagamento}! Mesa liberada.`
    );

    setTimeout(() => setMensagemSucesso(''), 5000);
  };

  return (
    <div style={{ backgroundColor: '#131313', color: '#F7F7F7', minHeight: '100vh', padding: '2rem', fontFamily: 'Plus Jakarta Sans, sans-serif' }}>
      <header style={{ borderBottom: '1px solid rgba(196, 154, 108, 0.3)', paddingBottom: '1rem', marginBottom: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#C49A6C', fontSize: '11px', letterSpacing: '2px', textTransform: 'uppercase', marginBottom: '0.25rem' }}>
            HAUTE HOSPITALITY — GESTÃO FINANCEIRA
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.75rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Operador de Caixa & Fechamento
          </h1>
        </div>
        <div style={{ backgroundColor: '#2A2A2A', padding: '0.5rem 1rem', borderRadius: '4px', fontSize: '12px', border: '1px solid rgba(196, 154, 108, 0.3)' }}>
          ASTRA DB ATOMICO 🟢
        </div>
      </header>

      {mensagemSucesso && (
        <div style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)', border: '1px solid #22c55e', color: '#4ade80', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', fontSize: '14px' }}>
          {mensagemSucesso}
        </div>
      )}

      <main style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '2rem' }}>
        {/* Painel Esquerdo: Lista de Comandas Aguardando Fechamento */}
        <section style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', padding: '1.5rem', borderRadius: '4px' }}>
          <h2 style={{ fontSize: '1rem', color: '#C49A6C', marginTop: 0, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
            Comandas Pendentes
          </h2>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
            {comandas.map((c) => (
              <div
                key={c.id}
                onClick={() => setComandaSelecionada(c)}
                style={{
                  padding: '1rem',
                  backgroundColor: comandaSelecionada?.id === c.id ? '#2A2A2A' : '#131313',
                  border: `1px solid ${comandaSelecionada?.id === c.id ? '#C49A6C' : '#2A2A2A'}`,
                  borderRadius: '4px',
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                }}
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                  <span style={{ fontWeight: 600, color: '#FFFFFF' }}>Mesa #{c.mesaNumero}</span>
                  <span style={{ fontSize: '12px', color: c.estado === 'Fechada' ? '#22c55e' : '#eab308' }}>
                    {c.estado === 'Fechada' ? '🟢 FECHADA' : '🟡 AGUARDANDO'}
                  </span>
                </div>
                <div style={{ fontSize: '12px', color: '#A0A0A0' }}>{c.cliente}</div>
                <div style={{ fontSize: '14px', fontWeight: 600, color: '#C49A6C', marginTop: '0.5rem' }}>
                  R$ {c.totalLiquido.toFixed(2)}
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Painel Direito: Detalhes do Fechamento e Pagamento */}
        {comandaSelecionada && (
          <section style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', padding: '1.5rem', borderRadius: '4px' }}>
            <h2 style={{ fontSize: '1rem', color: '#C49A6C', marginTop: 0, marginBottom: '1rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Resumo do Consumo — Mesa #{comandaSelecionada.mesaNumero}
            </h2>

            <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '1.5rem', fontSize: '13px' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #2A2A2A', textAlign: 'left', color: '#A0A0A0' }}>
                  <th style={{ padding: '0.5rem 0' }}>Item</th>
                  <th style={{ padding: '0.5rem 0' }}>Qtd</th>
                  <th style={{ padding: '0.5rem 0', textAlign: 'right' }}>Total</th>
                </tr>
              </thead>
              <tbody>
                {comandaSelecionada.itens.map((item, index) => (
                  <tr key={index} style={{ borderBottom: '1px solid #222222' }}>
                    <td style={{ padding: '0.75rem 0', color: '#FFFFFF' }}>{item.nome}</td>
                    <td style={{ padding: '0.75rem 0', color: '#A0A0A0' }}>{item.quantidade}x</td>
                    <td style={{ padding: '0.75rem 0', textAlign: 'right', color: '#FFFFFF' }}>
                      R$ {item.valorTotal.toFixed(2)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            <div style={{ backgroundColor: '#131313', padding: '1rem', borderRadius: '4px', marginBottom: '1.5rem', border: '1px solid #2A2A2A' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px', color: '#A0A0A0' }}>
                <span>Subtotal Consumido:</span>
                <span>R$ {comandaSelecionada.subtotal.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem', fontSize: '13px', color: '#ef4444' }}>
                <span>Desconto Aplicado:</span>
                <span>- R$ {comandaSelecionada.desconto.toFixed(2)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '16px', fontWeight: 600, color: '#C49A6C', paddingTop: '0.5rem', borderTop: '1px solid #2A2A2A' }}>
                <span>Total a Pagar:</span>
                <span>R$ {comandaSelecionada.totalLiquido.toFixed(2)}</span>
              </div>
            </div>

            <div style={{ marginBottom: '1.5rem' }}>
              <label style={{ display: 'block', fontSize: '12px', color: '#C49A6C', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '1px' }}>
                Forma de Pagamento
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                {(['Pix', 'CartaoCredito', 'CartaoDebito', 'Dinheiro'] as const).map((forma) => (
                  <button
                    key={forma}
                    onClick={() => setFormaPagamento(forma)}
                    style={{
                      padding: '0.75rem',
                      backgroundColor: formaPagamento === forma ? '#C49A6C' : '#131313',
                      color: formaPagamento === forma ? '#131313' : '#FFFFFF',
                      border: '1px solid #C49A6C',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      fontSize: '12px',
                      fontWeight: 600,
                    }}
                  >
                    {forma === 'CartaoCredito' ? 'Crédito' : forma === 'CartaoDebito' ? 'Débito' : forma}
                  </button>
                ))}
              </div>
            </div>

            <button
              onClick={handleFinalizarFechamento}
              disabled={comandaSelecionada.estado === 'Fechada'}
              style={{
                width: '100%',
                padding: '1rem',
                backgroundColor: comandaSelecionada.estado === 'Fechada' ? '#2A2A2A' : '#C49A6C',
                color: comandaSelecionada.estado === 'Fechada' ? '#666' : '#131313',
                border: 'none',
                borderRadius: '4px',
                fontSize: '14px',
                fontWeight: 700,
                cursor: comandaSelecionada.estado === 'Fechada' ? 'not-allowed' : 'pointer',
                letterSpacing: '1px',
                textTransform: 'uppercase',
              }}
            >
              {comandaSelecionada.estado === 'Fechada' ? 'COMANDA JA FECHADA' : 'REGISTRAR PAGAMENTO E FECHAR COMANDA'}
            </button>
          </section>
        )}
      </main>
    </div>
  );
}
