const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');

// Lista todos os animais com filtros opcionais
router.get('/', async (req, res) => {
  try {
    const { status, especie, porte, idade_min, idade_max } = req.query;
    
    // Monta o filtro dinâmico
    let filtro = {};
    
    if (status) filtro.status = status;
    if (especie) filtro.especie = especie;
    if (porte) filtro.porte = porte;
    
    // Filtros de idade
    if (idade_min || idade_max) {
      filtro.idade = {};
      if (idade_min) filtro.idade.$gte = parseInt(idade_min);
      if (idade_max) filtro.idade.$lte = parseInt(idade_max);
    }
    
    // Busca com filtros e ordena por data de cadastro (mais recentes primeiro)
    const animais = await Animal.find(filtro).sort({ createdAt: -1 });
    
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais' });
  }
});

// Lista animais recém-chegados (últimos 30 dias)
router.get('/recem-chegados', async (req, res) => {
  try {
    const trintaDiasAtras = new Date();
    trintaDiasAtras.setDate(trintaDiasAtras.getDate() - 30);
    
    const animais = await Animal.find({
      data_chegada: { $gte: trintaDiasAtras }
    }).sort({ data_chegada: -1 });
    
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais recém-chegados:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais recém-chegados' });
  }
});

// Lista os 10 animais disponíveis há mais tempo
router.get('/mais-antigos', async (req, res) => {
  try {
    const animais = await Animal.find({ status: 'Disponível' })
      .sort({ data_chegada: 1 })
      .limit(10);
    
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais mais antigos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais mais antigos' });
  }
});

// Busca um animal específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const animal = await Animal.findById(req.params.id);
    
    if (!animal) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    
    res.json(animal);
  } catch (erro) {
    console.error('Erro ao buscar animal:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animal' });
  }
});

// Cadastra um novo animal
router.post('/', async (req, res) => {
  try {
    const { nome, especie, idade, sexo, status, porte, data_chegada, imagem_url } = req.body;
    
    // Validação básica (Mongoose já valida pelo Schema)
    if (!nome || !especie || !idade || !sexo) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: nome, especie, idade, sexo'
      });
    }
    
    // Cria novo animal
    const novoAnimal = new Animal({
      nome,
      especie,
      idade,
      sexo,
      porte,
      imagem_url,
      status: status || 'Disponível',
      data_chegada: data_chegada || new Date()
    });
    
    // Salva no banco
    const animalSalvo = await novoAnimal.save();
    
    res.status(201).json({
      mensagem: 'Animal cadastrado com sucesso!',
      id_animal: animalSalvo._id,
      animal: animalSalvo
    });
  } catch (erro) {
    console.error('Erro ao cadastrar animal:', erro);
    
    // Erro de validação do Mongoose
    if (erro.name === 'ValidationError') {
      return res.status(400).json({ erro: erro.message });
    }
    
    res.status(500).json({ erro: 'Erro ao cadastrar animal' });
  }
});

// Atualiza um animal existente
router.put('/:id', async (req, res) => {
  try {
    const { nome, especie, porte, idade, sexo, status, imagem_url } = req.body;
    
    const animalAtualizado = await Animal.findByIdAndUpdate(
      req.params.id,
      { nome, especie, porte, idade, sexo, status, imagem_url },
      { new: true, runValidators: true } // Retorna documento atualizado e valida
    );
    
    if (!animalAtualizado) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    
    res.json({
      mensagem: 'Animal atualizado com sucesso!',
      animal: animalAtualizado
    });
  } catch (erro) {
    console.error('Erro ao atualizar animal:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar animal' });
  }
});

// Remove um animal
router.delete('/:id', async (req, res) => {
  try {
    const animalRemovido = await Animal.findByIdAndDelete(req.params.id);
    
    if (!animalRemovido) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    
    res.json({ mensagem: 'Animal removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao remover animal:', erro);
    res.status(500).json({ erro: 'Erro ao remover animal' });
  }
});

module.exports = router;