const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Lista todos os animais, permitindo filtros por query string
router.get('/', async (req, res) => {
  try {
    const { status, especie, porte, idade_min, idade_max } = req.query;
    
    let query = 'SELECT * FROM Animal WHERE 1=1';
    let params = [];

    // Adiciona filtro pelo status do animal, se informado
    if (status) {
      query += ' AND status = ?';
      params.push(status);
    }

    // Adiciona filtro pela espécie do animal
    if (especie) {
      query += ' AND especie = ?';
      params.push(especie);
    }

    // Adiciona filtro pelo porte do animal
    if (porte) {
      query += ' AND porte = ?';
      params.push(porte);
    }

    // Filtro para idade mínima
    if (idade_min) {
      query += ' AND idade >= ?';
      params.push(parseInt(idade_min));
    }
    // Filtro para idade máxima
    if (idade_max) {
      query += ' AND idade <= ?';
      params.push(parseInt(idade_max));
    }

    query += ' ORDER BY id_animal DESC';

    // Executa a consulta com os filtros aplicados
    const [animais] = await db.query(query, params);
    res.json(animais);
  } catch (erro) {
    // Loga o erro e retorna resposta padrão
    console.error('Erro ao buscar animais:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais' });
  }
});

// Lista animais que chegaram nos últimos 30 dias
router.get('/recem-chegados', async (req, res) => {
  try {
    const [animais] = await db.query(`
      SELECT * FROM Animal 
      WHERE data_chegada >= DATE_SUB(CURDATE(), INTERVAL 30 DAY)
      ORDER BY data_chegada DESC
    `);
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais recém-chegados:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais recém-chegados' });
  }
});

// Lista os 10 animais disponíveis há mais tempo
router.get('/mais-antigos', async (req, res) => {
  try {
    const [animais] = await db.query(`
      SELECT * FROM Animal 
      WHERE status = 'Disponível'
      ORDER BY data_chegada ASC
      LIMIT 10
    `);
    res.json(animais);
  } catch (erro) {
    console.error('Erro ao buscar animais mais antigos:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animais mais antigos' });
  }
});

// Busca um animal específico pelo ID
router.get('/:id', async (req, res) => {
  try {
    const [animais] = await db.query(
      'SELECT * FROM Animal WHERE id_animal = ?',
      [req.params.id]
    );

    // Retorna erro se não encontrar animal
    if (animais.length === 0) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }

    res.json(animais[0]);
  } catch (erro) {
    console.error('Erro ao buscar animal:', erro);
    res.status(500).json({ erro: 'Erro ao buscar animal' });
  }
});

// Cadastra um novo animal no sistema
router.post('/', async (req, res) => {
  try {
    const { nome, especie, idade, sexo, status, porte, data_chegada } = req.body;

    // Validação dos campos obrigatórios
    if (!nome || !especie || !idade || !sexo) {
      return res.status(400).json({ 
        erro: 'Campos obrigatórios: nome, especie, idade, sexo' 
      });
    }

    // Insere o animal na base de dados
    const [resultado] = await db.query(
      'INSERT INTO Animal (nome, especie, porte, idade, sexo, status, data_chegada) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [nome, especie, porte || null, idade, sexo, status || 'Disponível', data_chegada || new Date()]
    );

    res.status(201).json({
      mensagem: 'Animal cadastrado com sucesso!',
      id_animal: resultado.insertId
    });
  } catch (erro) {
    console.error('Erro ao cadastrar animal:', erro);
    res.status(500).json({ erro: 'Erro ao cadastrar animal' });
  }
});

// Atualiza os dados de um animal existente
router.put('/:id', async (req, res) => {
  try {
    const { nome, especie, porte, idade, sexo, status } = req.body;
    const { id } = req.params;

    // Atualiza os dados no banco
    const [resultado] = await db.query(
      'UPDATE Animal SET nome = ?, especie = ?, porte = ?, idade = ?, sexo = ?, status = ? WHERE id_animal = ?',
      [nome, especie, porte, idade, sexo, status, id]
    );

    // Se não encontrou animal para atualizar
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }

    res.json({ mensagem: 'Animal atualizado com sucesso!' });
  } catch (erro) {
    console.error('Erro ao atualizar animal:', erro);
    res.status(500).json({ erro: 'Erro ao atualizar animal' });
  }
});

// Remove um animal do sistema
router.delete('/:id', async (req, res) => {
  try {
    const [resultado] = await db.query(
      'DELETE FROM Animal WHERE id_animal = ?',
      [req.params.id]
    );

    // Se não encontrou animal para remover
    if (resultado.affectedRows === 0) {
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }

    res.json({ mensagem: 'Animal removido com sucesso!' });
  } catch (erro) {
    console.error('Erro ao remover animal:', erro);
    res.status(500).json({ erro: 'Erro ao remover animal' });
  }
});

// Exporta as rotas para uso no app principal
module.exports = router;