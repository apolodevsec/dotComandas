'use client';

import React, { useState } from 'react';
import { KDSBoard } from '../components/KDSBoard';
import { Pedido, EstadoPedido } from '@dotcomandas/shared';

const DEMO_PEDIDOS: Pedido[] = [
  {
    id: 'ped-101',
    comandaId: 'comanda-1',
    mesaId: '04',
    origem: 'Cliente',
    estado: 'Pendente',
    total: 32.5,
    createdAt: new Date(Date.now() - 18 * 60 * 1000).toISOString(), // 18 min atras (alerta)
    updatedAt: new Date().toISOString(),
    itens: [
      {
        id: 'item-101-1',
        itemCardapioId: 'item-1',
        nome: 'Hambúrguer Artesanal',
        precoUnitario: 28.0,
        quantidade: 1,
        adicionaisSelecionados: [{ opcaoId: 'op-bacon', nome: 'Bacon Crocante', precoUnitario: 4.5 }],
        observacao: 'Ao ponto, sem cebola',
        precoTotalItem: 32.5,
      },
    ],
  },
  {
    id: 'ped-102',
    comandaId: 'comanda-2',
    mesaId: '12',
    origem: 'Garcom',
    estado: 'Pendente',
    total: 18.0,
    createdAt: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    itens: [
      {
        id: 'item-102-1',
        itemCardapioId: 'item-2',
        nome: 'Refrigerante Lata 350ml',
        precoUnitario: 6.0,
        quantidade: 3,
        adicionaisSelecionados: [],
        precoTotalItem: 18.0,
      },
    ],
  },
  {
    id: 'ped-103',
    comandaId: 'comanda-3',
    mesaId: '07',
    origem: 'Garcom',
    estado: 'Em Preparo',
    total: 56.0,
    createdAt: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    itens: [
      {
        id: 'item-103-1',
        itemCardapioId: 'item-1',
        nome: 'Hambúrguer Artesanal',
        precoUnitario: 28.0,
        quantidade: 2,
        adicionaisSelecionados: [{ opcaoId: 'op-queijo', nome: 'Queijo Extra', precoUnitario: 3.0 }],
        precoTotalItem: 56.0,
      },
    ],
  },
  {
    id: 'ped-104',
    comandaId: 'comanda-4',
    mesaId: '02',
    origem: 'Cliente',
    estado: 'Pronto',
    total: 12.0,
    createdAt: new Date(Date.now() - 12 * 60 * 1000).toISOString(),
    updatedAt: new Date().toISOString(),
    itens: [
      {
        id: 'item-104-1',
        itemCardapioId: 'item-3',
        nome: 'Pudim de Leite',
        precoUnitario: 12.0,
        quantidade: 1,
        adicionaisSelecionados: [],
        precoTotalItem: 12.0,
      },
    ],
  },
];

export default function KDSPage() {
  const [pedidos, setPedidos] = useState<Pedido[]>(DEMO_PEDIDOS);

  const handleAvancarEstado = (pedidoId: string, novoEstado: EstadoPedido) => {
    setPedidos((prev) =>
      prev.map((p) => (p.id === pedidoId ? { ...p, estado: novoEstado } : p))
    );
  };

  const handleAdicionarPedidoDemo = () => {
    const numeroMesa = Math.floor(Math.random() * 20) + 1;
    const novo: Pedido = {
      id: `ped-${Date.now().toString().slice(-4)}`,
      comandaId: `comanda-${numeroMesa}`,
      mesaId: numeroMesa.toString().padStart(2, '0'),
      origem: Math.random() > 0.5 ? 'Cliente' : 'Garcom',
      estado: 'Pendente',
      total: 28.0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      itens: [
        {
          id: `item-${Date.now()}`,
          itemCardapioId: 'item-1',
          nome: 'Hambúrguer Artesanal',
          precoUnitario: 28.0,
          quantidade: 1,
          adicionaisSelecionados: [{ opcaoId: 'op-ponto', nome: 'Bem Passada', precoUnitario: 0 }],
          observacao: 'Pedido inserido ao vivo',
          precoTotalItem: 28.0,
        },
      ],
    };

    setPedidos((prev) => [novo, ...prev]);
  };

  return (
    <div style={{ position: 'relative' }}>
      <div
        style={{
          position: 'absolute',
          top: '12px',
          right: '20px',
          zIndex: 100,
        }}
      >
        <button
          onClick={handleAdicionarPedidoDemo}
          style={{
            backgroundColor: '#3b82f6',
            color: '#fff',
            border: 'none',
            padding: '8px 16px',
            borderRadius: '6px',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          ➕ Simular Novo Pedido Chegando
        </button>
      </div>

      <KDSBoard pedidos={pedidos} onAvancarEstado={handleAvancarEstado} />
    </div>
  );
}
