// Importa variáveis de ambiente do arquivo .env
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa as rotas da aplicação
const animaisRoutes = require('./routes/animais');
const adotantesRoutes = require('./routes/adotantes');
const adocoesRoutes = require('./routes/adocoes');
const estatisticasRoutes = require('./routes/estatisticas');

// Inicializa o app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configura os middlewares globais
app.use(cors()); // Permite requisições de outros domínios
app.use(express.json()); // Permite receber JSON no corpo das requisições

// Rota raiz para teste rápido da API
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API The Animal Home está funcionando!',
    rotas_disponiveis: {
      animais: '/animais',
      adotantes: '/adotantes',
      adocoes: '/adocoes',
      estatisticas: '/estatisticas'
    }
  });
});

// Registra as rotas principais da aplicação
app.use('/animais', animaisRoutes);
app.use('/adotantes', adotantesRoutes);
app.use('/adocoes', adocoesRoutes);
app.use('/estatisticas', estatisticasRoutes);

// Inicia o servidor na porta definida
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});