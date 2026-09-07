import 'dotenv/config';
import http from 'http';
import { estaConectadoAstraDB } from './config/astra-client.js';
import { listarCardapio } from './services/cardapio-service.js';
import { buscarOuCriarComandaAtivaPorMesa, criarPedido } from './services/pedido-service.js';
import { autenticarFuncionarioPorPin } from './services/auth-service.js';
import { iniciarSessaoMesaPorQrCode } from './services/mesa-service.js';
import { transicionarEstadoPedidoKDS, listarFilaKDS } from './services/kds-service.js';
import { obterResumoCaixaComanda, registrarPagamentoEFecharComanda } from './services/caixa-service.js';

const PORT = process.env.PORT || 4000;

const server = http.createServer((req, res) => {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    res.writeHead(204);
    res.end();
    return;
  }

  const url = new URL(req.url || '/', `http://${req.headers.host}`);

  // Endpoints HTTP da API
  if (url.pathname === '/health' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({ status: 'ok', astraDbConectado: estaConectadoAstraDB() }));
    return;
  }

  if (url.pathname === '/api/cardapio' && req.method === 'GET') {
    res.writeHead(200, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(listarCardapio()));
    return;
  }

  if (url.pathname === '/api/auth/pin' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { usuario, pin } = JSON.parse(body || '{}');
        const resultado = autenticarFuncionarioPorPin(usuario, pin);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resultado));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: err.message }));
      }
    });
    return;
  }

  if (url.pathname === '/api/sessoes/mesa' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { qrCodePayload } = JSON.parse(body || '{}');
        const resultado = iniciarSessaoMesaPorQrCode(qrCodePayload || 'mesa-1');
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify(resultado));
      } catch (err: any) {
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ erro: err.message }));
      }
    });
    return;
  }

  const matchDisparoEtapa = url.pathname.match(/^\/api\/(?:comandas|pedidos)\/([^/]+)\/etapas\/([^/]+)\/disparar$/);
  if (matchDisparoEtapa && req.method === 'POST') {
    const pedidoId = matchDisparoEtapa[1];
    const ordemEtapa = parseInt(matchDisparoEtapa[2], 10);
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      try {
        const { pinFuncionarios, pin } = JSON.parse(body || '{}');
        const pinFinal = pinFuncionarios || pin || '';
        const { dispararEtapaPedido } = require('./services/pedido-service.js');
        const resultado = dispararEtapaPedido(pedidoId, ordemEtapa, pinFinal);
        res.writeHead(200, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({ sucesso: true, pedido: resultado }));
      } catch (err: any) {
        const isEtapaPendente = err.message && err.message.includes('ETAPA_ANTERIOR_PENDENTE');
        res.writeHead(400, { 'Content-Type': 'application/json' });
        res.end(JSON.stringify({
          erro: err.message,
          codigo: isEtapaPendente ? 'ETAPA_ANTERIOR_PENDENTE' : 'ERRO_VALIDACAO',
        }));
      }
    });
    return;
  }

  // Rota padrão 404
  res.writeHead(404, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify({ erro: 'Endpoint não encontrado', rotasDisponiveis: ['/health', '/api/cardapio', '/api/auth/pin', '/api/sessoes/mesa', '/api/pedidos/:id/etapas/:ordem/disparar'] }));
});

server.listen(PORT, () => {
  console.log(`\n==================================================`);
  console.log(`🚀 API Backend dotComandas rodando na porta ${PORT}`);
  console.log(`📊 Health Check: http://localhost:${PORT}/health`);
  console.log(`📋 Cardápio: http://localhost:${PORT}/api/cardapio`);
  console.log(`⚡ Astra DB Status: ${estaConectadoAstraDB() ? 'Conectado (Nuvem DataStax 🟢)' : 'Memória Local 🟡'}`);
  console.log(`==================================================\n`);
});
