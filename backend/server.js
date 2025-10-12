// Importa variáveis de ambiente do arquivo .env
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Importa as rotas da aplicação
const animaisRoutes = require('./routes/animais');
const adotantesRoutes = require('./routes/adotantes');
const adocoesRoutes = require('./routes/adocoes');
const estatisticasRoutes = require('./routes/estatisticas');
// IMPORTAÇÃO DA NOVA ROTA DE CONSULTAS
const consultasRoutes = require('./routes/consultas');

// Inicializa o app Express
const app = express();
const PORT = process.env.PORT || 3000;

// Configura o CORS
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares globais
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({ 
    mensagem: 'API The Animal Home está funcionando!',
    rotas_disponiveis: {
      animais: '/animais',
      adotantes: '/adotantes',
      adocoes: '/adocoes',
      estatisticas: '/estatisticas',
      consultas: '/consultas/:id'
    }
  });
});

// Registra as rotas principais
app.use('/animais', animaisRoutes);
app.use('/adotantes', adotantesRoutes);
app.use('/adocoes', adocoesRoutes);
app.use('/estatisticas', estatisticasRoutes);
// REGISTRO DA NOVA ROTA DE CONSULTAS
app.use('/consultas', consultasRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
});