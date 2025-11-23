const mongoose = require('mongoose');

// Define o Schema (estrutura) do Animal
const animalSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  especie: {
    type: String,
    required: [true, 'Espécie é obrigatória'],
    enum: ['Cachorro', 'Gato', 'Jacaré', 'Galinha'],
    trim: true
  },
  idade: {
    type: Number,
    required: [true, 'Idade é obrigatória'],
    min: [0, 'Idade não pode ser negativa']
  },
  sexo: {
    type: String,
    required: [true, 'Sexo é obrigatório'],
    enum: ['M', 'F'],
    uppercase: true
  },
  porte: {
    type: String,
    enum: ['Pequeno', 'Médio', 'Grande'],
    default: null
  },
  imagem_url: {
    type: String,
    default: null
  },
  data_chegada: {
    type: Date,
    default: Date.now
  },
  status: {
    type: String,
    enum: ['Disponível', 'Adotado'],
    default: 'Disponível'
  }
}, {
  timestamps: true // Adiciona createdAt e updatedAt automaticamente
});

// Índices para melhorar performance de buscas
animalSchema.index({ status: 1 });
animalSchema.index({ especie: 1 });
animalSchema.index({ data_chegada: -1 });

// Exporta o modelo
module.exports = mongoose.model('Animal', animalSchema);