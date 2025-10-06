const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Lista todos os adotantes cadastrados
router.get('/', async (req, res) => {
  try {
    const [adotantes] = await db.query('SELECT * FROM Adotante');
    res.json(adotantes);
  } catch (erro) {
    // Se ocorrer erro na consulta, retorna erro 500
    console.error('Erro ao buscar adotantes:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adotantes' });
  }
});

// Busca um adotante específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const [adotantes] = await db.query(
      'SELECT * FROM Adotante WHERE id_adotante = ?',
      [req.params.id]
    );

    // Retorna erro se não encontrar adotante
    if (adotantes.length === 0) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }

    res.json(adotantes[0]);
  } catch (erro) {
    console.error('Erro ao buscar adotante:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adotante' });
  }
});

// Cadastra um novo adotante
router.post('/', async (req, res) => {
  try {
    const { nome, email, telefone, endereco } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !email || !telefone) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios: nome, email, telefone' 
      });
    }

    // Insere o adotante na base de dados
    const [resultado] = await db.query(
      'INSERT INTO Adotante (nome, email, telefone, endereco) VALUES (?, ?, ?, ?)',
      [nome, email, telefone, endereco || null]
    );

    res.status(201).json({
      mensagem: 'Adotante cadastrado com sucesso!',
      id_adotante: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao cadastrar adotante:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar adotante' });
  }
});

// Atualiza os dados de um adotante existente
router.put('/:id', async (req, res) => {
  try {
    const { nome, email, telefone, endereco } = req.body;
    const { id } = req.params;

    // Atualiza os dados no banco
    const [resultado] = await db.query(
      'UPDATE Adotante SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE id_adotante = ?',
      [nome, email, telefone, endereco, id]
    );

    // Se não encontrou adotante para atualizar
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }

    res.json({ mensagem: 'Adotante atualizado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar adotante:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar adotante' });
  }
});

// Remove um adotante do sistema
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await db.query(
      'DELETE FROM Adotante WHERE id_adotante = ?',
      [req.params.id]
    );

    // Se não encontrou adotante para remover
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }

    res.json({ mensagem: 'Adotante removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao remover adotante:', erro);
    res.status(500).json({ erro: 'Erro ao remover adotante' });
  }
});

// Exporta as rotas para uso no app principal
module.exports = router;