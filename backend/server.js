// Importa variáveis de ambiente
require('dotenv').config();
const express = require('express');
const cors = require('cors');
const connectDB = require('./db/connection');

// Importa as rotas
const animaisRoutes = require('./routes/animais');
const adotantesRoutes = require('./routes/adotantes');
const adocoesRoutes = require('./routes/adocoes');
const estatisticasRoutes = require('./routes/estatisticas');
const consultasRoutes = require('./routes/consultas');

// Inicializa o Express
const app = express();
const PORT = process.env.PORT || 3000;

// Conecta ao MongoDB
connectDB();

// Configurações de CORS
const corsOptions = {
  origin: 'http://127.0.0.1:5500',
  optionsSuccessStatus: 200
};
app.use(cors(corsOptions));

// Middlewares
app.use(express.json());

// Rota raiz
app.get('/', (req, res) => {
  res.json({
    mensagem: 'API The Animal Home está funcionando com MongoDB!',
    banco_de_dados: 'MongoDB',
    rotas_disponiveis: {
      animais: '/animais',
      adotantes: '/adotantes',
      adocoes: '/adocoes',
      estatisticas: '/estatisticas',
      consultas: '/consultas/:id'
    }
  });
});

// Registra as rotas
app.use('/animais', animaisRoutes);
app.use('/adotantes', adotantesRoutes);
app.use('/adocoes', adocoesRoutes);
app.use('/estatisticas', estatisticasRoutes);
app.use('/consultas', consultasRoutes);

// Inicia o servidor
app.listen(PORT, () => {
  console.log(`🚀 Servidor rodando na porta ${PORT}`);
  console.log(`📍 Acesse: http://localhost:${PORT}`);
  console.log(`🗄️ Usando MongoDB como banco de dados`);
});