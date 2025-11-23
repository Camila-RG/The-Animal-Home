const mongoose = require('mongoose');

// Define o Schema do Adotante
const adotanteSchema = new mongoose.Schema({
  nome: {
    type: String,
    required: [true, 'Nome é obrigatório'],
    trim: true
  },
  email: {
    type: String,
    required: [true, 'Email é obrigatório'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\S+@\S+\.\S+$/, 'Email inválido']
  },
  telefone: {
    type: String,
    required: [true, 'Telefone é obrigatório'],
    trim: true
  },
  endereco: {
    type: String,
    default: null,
    trim: true
  }
}, {
  timestamps: true
});

// Índice para email (já é único, mas melhora performance)
adotanteSchema.index({ email: 1 });

// Exporta o modelo
module.exports = mongoose.model('Adotante', adotanteSchema);