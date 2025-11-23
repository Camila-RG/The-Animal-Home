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

// Registra uma nova adoção (com transação)
router.post('/', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    const { id_animal, id_adotante, data_adocao } = req.body;
    
    // Validação
    if (!id_animal || !id_adotante) {
      await session.abortTransaction();
      return res.status(400).json({
        erro: 'Campos obrigatórios: id_animal, id_adotante'
      });
    }
    
    // Verifica se o animal existe e está disponível
    const animal = await Animal.findById(id_animal).session(session);
    if (!animal) {
      await session.abortTransaction();
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }
    
    if (animal.status === 'Adotado') {
      await session.abortTransaction();
      return res.status(400).json({ erro: 'Animal já foi adotado' });
    }
    
    // Verifica se o adotante existe
    const adotante = await Adotante.findById(id_adotante).session(session);
    if (!adotante) {
      await session.abortTransaction();
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }
    
    // Cria a adoção
    const novaAdocao = new Adocao({
      id_animal,
      id_adotante,
      data_adocao: data_adocao || new Date()
    });
    
    await novaAdocao.save({ session });
    
    // Atualiza o status do animal
    animal.status = 'Adotado';
    await animal.save({ session });
    
    // Confirma a transação
    await session.commitTransaction();
    
    res.status(201).json({
      mensagem: 'Adoção registrada com sucesso!',
      id_adocao: novaAdocao._id
    });
    
  } catch (erro) {
    await session.abortTransaction();
    console.error('Erro ao registrar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao registrar adoção' });
  } finally {
    session.endSession();
  }
});

// Cancela uma adoção
router.delete('/:id', async (req, res) => {
  const session = await mongoose.startSession();
  session.startTransaction();
  
  try {
    // Busca a adoção
    const adocao = await Adocao.findById(req.params.id).session(session);
    
    if (!adocao) {
      await session.abortTransaction();
      return res.status(404).json({ erro: 'Adoção não encontrada' });
    }
    
    const id_animal = adocao.id_animal;
    
    // Remove a adoção
    await Adocao.findByIdAndDelete(req.params.id).session(session);
    
    // Verifica se há outras adoções desse animal
    const outrasAdocoes = await Adocao.countDocuments({ 
      id_animal 
    }).session(session);
    
    // Se não há outras adoções, marca animal como disponível
    if (outrasAdocoes === 0) {
      await Animal.findByIdAndUpdate(
        id_animal,
        { status: 'Disponível' },
        { session }
      );
    }
    
    await session.commitTransaction();
    res.json({ mensagem: 'Adoção cancelada com sucesso!' });
    
  } catch (erro) {
    await session.abortTransaction();
    console.error('Erro ao cancelar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao cancelar adoção' });
  } finally {
    session.endSession();
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