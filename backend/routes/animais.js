const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Lista todos os animais, permitindo filtros
router.get('/', async (req, res) => {
  try {
    const { status, especie, porte, idade_min, idade_max } = req.query;
    let query = 'SELECT * FROM Animal WHERE 1=1';
    let params = [];
    if (status) { query += ' AND status = ?'; params.push(status); }
    if (especie) { query += ' AND especie = ?'; params.push(especie); }
    if (porte) { query += ' AND porte = ?'; params.push(porte); }
    if (idade_min) { query += ' AND idade >= ?'; params.push(parseInt(idade_min)); }
    if (idade_max) { query += ' AND idade <= ?'; params.push(parseInt(idade_max)); }
    query += ' ORDER BY id_animal DESC';
    const [animais] = await db.query(query, params);
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais' });
  }
});

// Busca um animal pelo ID
router.get('/:id', async (req, res) => {
  try {
    const [animais] = await db.query('SELECT * FROM Animal WHERE id_animal = ?', [req.params.id]);
    if (animais.length === 0) return res.status(404).json({ erro: 'Animal não encontrado' });
    res.json(animais[0]);
  } catch (erro) {
    console.error('Erro ao buscar animal:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animal' });
  }
});

// --- ESTA É A ROTA CORRIGIDA ---
// Cadastra um novo animal no sistema
router.post('/', async (req, res) => {
  try {
    const { nome, especie, idade, sexo, status, porte, data_chegada, imagem_url } = req.body;
    if (!nome || !especie || !idade || !sexo) {
      return res.status(400).json({ erro: 'Campos obrigatórios: nome, especie, idade, sexo' });
    }
    const [resultado] = await db.query(
      'INSERT INTO Animal (nome, especie, porte, idade, sexo, status, data_chegada, imagem_url) VALUES (?, ?, ?, ?, ?, ?, ?, ?)',
      [nome, especie, porte || null, idade, sexo, status || 'Disponível', data_chegada || new Date(), imagem_url || null]
    );
    res.status(201).json({
      mensagem: 'Animal cadastrado com sucesso!',
      id_animal: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro detalhado ao cadastrar animal:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar animal' });
  }
});

// Atualiza um animal
router.put('/:id', async (req, res) => {
  try {
    const { nome, especie, porte, idade, sexo, status } = req.body;
    const { id } = req.params;
    const [resultado] = await db.query(
      'UPDATE Animal SET nome = ?, especie = ?, porte = ?, idade = ?, sexo = ?, status = ? WHERE id_animal = ?',
      [nome, especie, porte, idade, sexo, status, id]
    );
    if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Animal não encontrado' });
    res.json({ mensagem: 'Animal atualizado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar animal:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar animal' });
  }
});

// Remove um animal
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await db.query('DELETE FROM Animal WHERE id_animal = ?', [req.params.id]);
    if (resultado.affectedRows === 0) return res.status(404).json({ erro: 'Animal não encontrado' });
    res.json({ mensagem: 'Animal removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao remover animal:', erro);
    res.status(500).json({ erro: 'Erro ao remover animal' });
  }
});

module.exports = router;