const express = require('express');
const router = express.Router();
const Adocao = require('../models/Adocao');
const Animal = require('../models/Animal');
const Adotante = require('../models/Adotante');
const mongoose = require('mongoose');

// Lista todas as adoções com dados do animal e adotante
router.get('/', async (req, res) => {
  try {
    const adocoes = await Adocao.find()
      .populate('id_animal', 'nome especie') // Popula dados do animal
      .populate('id_adotante', 'nome email') // Popula dados do adotante
      .sort({ data_adocao: -1 });
    
    // Formata a resposta para manter compatibilidade com frontend
    const adocoesFormatadas = adocoes.map(adocao => ({
      id_adocao: adocao._id,
      data_adocao: adocao.data_adocao,
      id_animal: adocao.id_animal._id,
      nome_animal: adocao.id_animal.nome,
      especie: adocao.id_animal.especie,
      id_adotante: adocao.id_adotante._id,
      nome_adotante: adocao.id_adotante.nome,
      email: adocao.id_adotante.email
    }));
    
    res.json(adocoesFormatadas);
  } catch (erro) {
    console.error('Erro ao buscar adoções:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoções' });
  }
});

// Busca uma adoção específica
router.get('/:id', async (req, res) => {
  try {
    const adocao = await Adocao.findById(req.params.id)
      .populate('id_animal')
      .populate('id_adotante');
    
    if (!adocao) {
      return res.status(404).json({ erro: 'Adoção não encontrada' });
    }
    
    res.json(adocao);
  } catch (erro) {
    console.error('Erro ao buscar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoção' });
  }
});

// Registra uma nova adoção
router.post('/', async (req, res) => {
  try {
    const { id_animal, id_adotante, data_adocao } = req.body;
    
    // Validação
    if (!id_animal || !id_adotante) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: id_animal, id_adotante'
      });
    }
    
    // Verifica se o animal existe
    const animal = await Animal.findById(id_animal);
    if (!animal) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    
    // Verifica se já não foi adotado
    if (animal.status === 'Adotado') {
      return res.status(400).json({ erro: 'Animal já foi adotado' });
    }
    
    // Verifica se o adotante existe
    const adotante = await Adotante.findById(id_adotante);
    if (!adotante) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }
    
    // 1. Cria e Salva a adoção
    const novaAdocao = new Adocao({
      id_animal,
      id_adotante,
      data_adocao: data_adocao || new Date()
    });
    
    await novaAdocao.save();
    
    // 2. Atualiza o status do animal e Salva
    animal.status = 'Adotado';
    await animal.save();
    
    res.status(201).json({
      mensagem: 'Adoção registrada com sucesso!',
      id_adocao: novaAdocao._id
    });
    
  } catch (erro) {
    console.error('Erro ao registrar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao registrar adoção' });
  }
});

// Cancela uma adoção
// Cancela uma adoção (CORRIGIDO: Sem transações)
router.delete('/:id', async (req, res) => {
  try {
    // Busca a adoção antes de apagar para saber qual animal liberar
    const adocao = await Adocao.findById(req.params.id);
    
    if (!adocao) {
      return res.status(404).json({ erro: 'Adoção não encontrada' });
    }
    
    const id_animal = adocao.id_animal;
    
    // Remove a adoção
    await Adocao.findByIdAndDelete(req.params.id);
    
    // Verifica se o animal deve voltar a ser disponível
    if (id_animal) {
       // Se não sobrou nenhuma outra adoção para este animal...
       const outrasAdocoes = await Adocao.countDocuments({ id_animal });
       
       if (outrasAdocoes === 0) {
         // ...ele volta para status Disponível
         await Animal.findByIdAndUpdate(id_animal, { status: 'Disponível' });
       }
    }
    
    res.json({ mensagem: 'Adoção cancelada com sucesso!' });
    
  } catch (erro) {
    console.error('Erro ao cancelar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao cancelar adoção' });
  }
});

// Limpa todo o histórico de adoções
router.delete('/historico/limpar', async (req, res) => {
  try {
    await Adocao.deleteMany({});
    res.json({ mensagem: 'Histórico de adoções foi limpo com sucesso!' });
  } catch (erro) {
    console.error('Erro ao limpar histórico:', erro);
    res.status(500).json({ erro: 'Erro ao limpar o histórico' });
  }
});

module.exports = router;