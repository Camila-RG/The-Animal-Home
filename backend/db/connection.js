const mongoose = require('mongoose');

// URL de conexão com o MongoDB
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/TheAnimalHome';

// Configurações de conexão
const connectDB = async () => {
  try {
    await mongoose.connect(MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('✅ Conectado ao MongoDB com sucesso!');
  } catch (erro) {
    console.error('❌ Erro ao conectar ao MongoDB:', erro.message);
    process.exit(1); // Encerra a aplicação se não conseguir conectar
  }
};

// Eventos de conexão
mongoose.connection.on('connected', () => {
  console.log('📊 Mongoose conectado ao MongoDB');
});

mongoose.connection.on('error', (erro) => {
  console.error('❌ Erro na conexão do Mongoose:', erro);
});

mongoose.connection.on('disconnected', () => {
  console.log('⚠️ Mongoose desconectado do MongoDB');
});

// Exporta a função de conexão
module.exports = connectDB;