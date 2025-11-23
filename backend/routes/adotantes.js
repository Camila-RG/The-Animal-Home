const express = require('express');
const router = express.Router();
const Adotante = require('../models/Adotante');

// Lista todos os adotantes
router.get('/', async (req, res) => {
  try {
    const adotantes = await Adotante.find().sort({ createdAt: -1 });
    res.json(adotantes);
  } catch (erro) {
    console.error('Erro ao buscar adotantes:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adotantes' });
  }
});

// Busca um adotante específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const adotante = await Adotante.findById(req.params.id);
    
    if (!adotante) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }
    
    res.json(adotante);
  } catch (erro) {
    console.error('Erro ao buscar adotante:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adotante' });
  }
});

// Cadastra um novo adotante
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, endereco } = req.body;
    
    // Validação básica
    if (!nome || !email || !telefone) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: nome, email, telefone'
      });
    }
    
    // Verifica se o email já existe
    const adotanteExistente = await Adotante.findOne({ email });
    if (adotanteExistente) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }
    
    // Cria novo adotante
    const novoAdotante = new Adotante({
      nome,
      email,
      telefone,
      endereco
    });
    
    const adotanteSalvo = await novoAdotante.save();
    
    res.status(201).json({
      mensagem: 'Adotante cadastrado com sucesso!',
      id_adotante: adotanteSalvo._id,
      adotante: adotanteSalvo
    });
  } catch (erro) {
    console.error('Erro ao cadastrar adotante:', erro);
    
    // Erro de validação
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: erro.message });
    }
    
    // Erro de duplicação (email único)
    if (erro.code === 11000) {
      return res.status(400).json({ erro: 'Email já cadastrado' });
    }
    
    res.status(500).json({ erro: 'Erro ao cadastrar adotante' });
  }
});

// Atualiza um adotante existente
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, telefone, endereco } = req.body;
    
    const adotanteAtualizado = await Adotante.findByIdAndUpdate(
      req.params.id,
      { nome, email, telefone, endereco },
      { new: true, runValidators: true }
    );
    
    if (!adotanteAtualizado) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }
    
    res.json({
      mensagem: 'Adotante atualizado com sucesso!',
      adotante: adotanteAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar adotante:', erro);
    
    if (erro.code === 11000) {
      return res.status(400).json({ erro: 'Email já cadastrado por outro adotante' });
    }
    
    res.status(500).json({ erro: 'Erro ao atualizar adotante' });
  }
});

// Remove um adotante
router.delete('/:id', async (req, res) => {
  try {
    const adotanteRemovido = await Adotante.findByIdAndDelete(req.params.id);
    
    if (!adotanteRemovido) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }
    
    res.json({ mensagem: 'Adotante removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao remover adotante:', erro);
    res.status(500).json({ erro: 'Erro ao remover adotante' });
  }
});

module.exports = router;