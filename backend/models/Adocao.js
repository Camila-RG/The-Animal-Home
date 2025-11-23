const mongoose = require('mongoose');

// Define o Schema da Adoção
const adocaoSchema = new mongoose.Schema({
  id_animal: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Animal', // Referência ao modelo Animal
    required: [true, 'ID do animal é obrigatório']
  },
  id_adotante: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Adotante', // Referência ao modelo Adotante
    required: [true, 'ID do adotante é obrigatório']
  },
  data_adocao: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Índices para melhorar performance
adocaoSchema.index({ id_animal: 1 });
adocaoSchema.index({ id_adotante: 1 });
adocaoSchema.index({ data_adocao: -1 });

// Exporta o modelo
module.exports = mongoose.model('Adocao', adocaoSchema);