'use client';

import React, { useState } from 'react';
import { useParams } from 'next/navigation';

interface ItemClienteDemo {
  id: string;
  nome: string;
  categoria: 'Entradas' | 'Pratos' | 'Bebidas' | 'Sobremesas';
  preco: number;
  descricao: string;
}

const CARDAPIO_CLIENTE_DEMO: ItemClienteDemo[] = [
  { id: 'i1', nome: 'Carpaccio de Polvo Trufado', categoria: 'Entradas', preco: 68.0, descricao: 'Fatias finas de polvo com azeite de trufas brancas e flor de sal' },
  { id: 'i2', nome: 'Ancho Wagyu 300g com Manteiga de Ervas', categoria: 'Pratos', preco: 145.0, descricao: 'Corte nobre grelhado na parrilla com risoto de parmigiano reggiano' },
  { id: 'i3', nome: 'Vinho Brunello di Montalcino DOCG', categoria: 'Bebidas', preco: 480.0, descricao: 'Rótulo italiano safra 2018 ideal para harmonização com carnes' },
  { id: 'i4', nome: 'Petit Gâteau Gold 70% Cacau', categoria: 'Sobremesas', preco: 42.0, descricao: 'Bolinho quente de cacau belga com sorvete artesanal de fava de baunilha' },
];

export default function ClienteMesaPage() {
  const routeParams = useParams();
  const rawMesaId = routeParams?.mesaId;
  const mesaId = Array.isArray(rawMesaId) ? rawMesaId[0] : (rawMesaId as string) || '1';

  const [categoriaAtiva, setCategoriaAtiva] = useState<'Entradas' | 'Pratos' | 'Bebidas' | 'Sobremesas'>('Entradas');
  const [carrinho, setCarrinho] = useState<{ item: ItemClienteDemo; quantidade: number }[]>([]);
  const [toastMensagem, setToastMensagem] = useState('');

  const itensFiltrados = CARDAPIO_CLIENTE_DEMO.filter((item) => item.categoria === categoriaAtiva);

  const handleAdicionarAoCarrinho = (item: ItemClienteDemo) => {
    setCarrinho((prev) => {
      const existe = prev.find((c) => c.item.id === item.id);
      if (existe) {
        return prev.map((c) => (c.item.id === item.id ? { ...c, quantidade: c.quantidade + 1 } : c));
      }
      return [...prev, { item, quantidade: 1 }];
    });

    setToastMensagem(`🛒 "${item.nome}" adicionado ao pedido da Mesa #${mesaId}!`);
    setTimeout(() => setToastMensagem(''), 4000);
  };

  const handleChamarGarcom = (tipo: string) => {
    setToastMensagem(`🛎️ Chamado de ${tipo} enviado com sucesso! O garçom está a caminho.`);
    setTimeout(() => setToastMensagem(''), 5000);
  };

  const subtotal = carrinho.reduce((acc, c) => acc + c.item.preco * c.quantidade, 0);

  return (
    <div style={{ backgroundColor: '#131313', color: '#F7F7F7', minHeight: '100vh', padding: '1.5rem', fontFamily: 'Plus Jakarta Sans, sans-serif', maxWidth: '480px', margin: '0 auto' }}>
      {/* Header com identificação da mesa */}
      <header style={{ borderBottom: '1px solid rgba(196, 154, 108, 0.3)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div>
          <div style={{ color: '#C49A6C', fontSize: '10px', letterSpacing: '2px', textTransform: 'uppercase' }}>
            HAUTE HOSPITALITY
          </div>
          <h1 style={{ fontFamily: 'Playfair Display, serif', fontSize: '1.5rem', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>
            Mesa #{mesaId}
          </h1>
        </div>
        <div style={{ backgroundColor: '#2A2A2A', color: '#C49A6C', padding: '0.4rem 0.8rem', borderRadius: '4px', fontSize: '11px', fontWeight: 600, border: '1px solid rgba(196, 154, 108, 0.3)' }}>
          SESSÃO ATIVA 🟢
        </div>
      </header>

      {/* Toast Flutuante em Tempo Real */}
      {toastMensagem && (
        <div style={{ position: 'fixed', top: '1rem', left: '50%', transform: 'translateX(-50%)', backgroundColor: '#2A2A2A', border: '1px solid #C49A6C', color: '#FFFFFF', padding: '0.75rem 1.25rem', borderRadius: '4px', fontSize: '13px', zIndex: 1000, boxShadow: '0 4px 12px rgba(0,0,0,0.5)', width: '90%', maxWidth: '420px', textAlign: 'center' }}>
          {toastMensagem}
        </div>
      )}

      {/* Navegação por Categorias Tradicionais */}
      <nav style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', marginBottom: '1.5rem', paddingBottom: '0.5rem' }}>
        {(['Entradas', 'Pratos', 'Bebidas', 'Sobremesas'] as const).map((cat) => (
          <button
            key={cat}
            onClick={() => setCategoriaAtiva(cat)}
            style={{
              padding: '0.6rem 1rem',
              backgroundColor: categoriaAtiva === cat ? '#C49A6C' : '#1A1A1A',
              color: categoriaAtiva === cat ? '#131313' : '#FFFFFF',
              border: `1px solid ${categoriaAtiva === cat ? '#C49A6C' : '#2A2A2A'}`,
              borderRadius: '4px',
              fontSize: '12px',
              fontWeight: 600,
              cursor: 'pointer',
              whiteSpace: 'nowrap',
            }}
          >
            {cat}
          </button>
        ))}
      </nav>

      {/* Lista de Itens do Cardápio */}
      <main style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
        {itensFiltrados.map((item) => (
          <div key={item.id} style={{ backgroundColor: '#1A1A1A', border: '1px solid #2A2A2A', borderRadius: '4px', padding: '1rem', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: '0.4rem' }}>
                <h3 style={{ fontSize: '15px', fontWeight: 600, color: '#FFFFFF', margin: 0 }}>{item.nome}</h3>
                <span style={{ fontSize: '14px', fontWeight: 600, color: '#C49A6C' }}>R$ {item.preco.toFixed(2)}</span>
              </div>
              <p style={{ fontSize: '12px', color: '#A0A0A0', margin: '0 0 1rem 0', lineHeight: '1.4' }}>{item.descricao}</p>
            </div>
            <button
              onClick={() => handleAdicionarAoCarrinho(item)}
              style={{ padding: '0.6rem', backgroundColor: '#2A2A2A', color: '#C49A6C', border: '1px solid rgba(196, 154, 108, 0.4)', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
            >
              + ADICIONAR AO PEDIDO
            </button>
          </div>
        ))}
      </main>

      {/* Barra Inferior com Subtotal e Botão "Chamar Garçom" */}
      <footer style={{ position: 'sticky', bottom: '1rem', backgroundColor: '#1A1A1A', border: '1px solid #C49A6C', borderRadius: '4px', padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: '13px', color: '#A0A0A0' }}>Subtotal Consumido:</span>
          <span style={{ fontSize: '16px', fontWeight: 700, color: '#C49A6C' }}>R$ {subtotal.toFixed(2)}</span>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
          <button
            onClick={() => handleChamarGarcom('Atendimento')}
            style={{ padding: '0.75rem', backgroundColor: '#2A2A2A', color: '#FFFFFF', border: '1px solid #444', borderRadius: '4px', fontSize: '12px', fontWeight: 600, cursor: 'pointer' }}
          >
            🛎️ CHAMAR GARÇOM
          </button>
          <button
            onClick={() => handleChamarGarcom('Conta')}
            style={{ padding: '0.75rem', backgroundColor: '#C49A6C', color: '#131313', border: 'none', borderRadius: '4px', fontSize: '12px', fontWeight: 700, cursor: 'pointer' }}
          >
            💳 PEDIR A CONTA
          </button>
        </div>
      </footer>
    </div>
  );
}
