const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Lista todas as adoções, trazendo dados do animal e do adotante
router.get('/', async (req, res) => {
  try {
    const [adocoes] = await db.query(`
      SELECT
        a.id_adocao,
        a.data_adocao,
        an.id_animal,
        an.nome AS nome_animal,
        an.especie,
        ad.id_adotante,
        ad.nome AS nome_adotante,
        ad.email
      FROM Adocao a
      JOIN Animal an ON a.id_animal = an.id_animal
      JOIN Adotante ad ON a.id_adotante = ad.id_adotante
      ORDER BY a.data_adocao DESC
    `);
    res.json(adocoes);
  } catch (erro) {
    console.error('Erro ao buscar adoções:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoções' });
  }
});

// Busca uma adoção específica pelo ID
router.get('/:id', async (req, res) => {
  try {
    const [adocoes] = await db.query(`
      SELECT
        a.id_adocao,
        a.data_adocao,
        an.id_animal,
        an.nome AS nome_animal,
        an.especie,
        ad.id_adotante,
        ad.nome AS nome_adotante,
        ad.email,
        ad.telefone
      FROM Adocao a
      JOIN Animal an ON a.id_animal = an.id_animal
      JOIN Adotante ad ON a.id_adotante = ad.id_adotante
      WHERE a.id_adocao = ?
    `, [req.params.id]);

    if (adocoes.length === 0) {
      return res.status(404).json({ erro: 'Adoção não encontrada' });
    }

    res.json(adocoes[0]);
  } catch (erro) {
    console.error('Erro ao buscar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoção' });
  }
});

// Registra uma nova adoção
router.post('/', async (req, res) => {
  const conexao = await db.getConnection();
  
  try {
    const { id_animal, id_adotante, data_adocao } = req.body;

    if (!id_animal || !id_adotante) {
      return res.status(400).json({
        erro: 'Campos obrigatórios: id_animal, id_adotante'
      });
    }

    await conexao.beginTransaction();

    const [animais] = await conexao.query(
      'SELECT * FROM Animal WHERE id_animal = ? FOR UPDATE',
      [id_animal]
    );

    if (animais.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ erro: 'Animal não encontrado' });
    }

    if (animais[0].status === 'Adotado') {
      await conexao.rollback();
      return res.status(400).json({ erro: 'Animal já foi adotado' });
    }

    const [adotantes] = await conexao.query(
      'SELECT * FROM Adotante WHERE id_adotante = ?',
      [id_adotante]
    );

    if (adotantes.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ erro: 'Adotante não encontrado' });
    }

    const [resultadoAdocao] = await conexao.query(
      'INSERT INTO Adocao (id_animal, id_adotante, data_adocao) VALUES (?, ?, ?)',
      [id_animal, id_adotante, data_adocao || new Date()]
    );

    await conexao.query(
      'UPDATE Animal SET status = ? WHERE id_animal = ?',
      ['Adotado', id_animal]
    );

    await conexao.commit();

    res.status(201).json({
      mensagem: 'Adoção registrada com sucesso!',
      id_adocao: resultadoAdocao.insertId
    });

  } catch (erro) {
    await conexao.rollback();
    console.error('Erro ao registrar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao registrar adoção' });
  } finally {
    conexao.release();
  }
});

// Cancela uma adoção
router.delete('/:id', async (req, res) => {
  const conexao = await db.getConnection();
  
  try {
    await conexao.beginTransaction();

    const [adocoes] = await conexao.query(
      'SELECT id_animal FROM Adocao WHERE id_adocao = ?',
      [req.params.id]
    );

    if (adocoes.length === 0) {
      await conexao.rollback();
      return res.status(404).json({ erro: 'Adoção não encontrada' });
    }

    const id_animal = adocoes[0].id_animal;

    await conexao.query('DELETE FROM Adocao WHERE id_adocao = ?', [req.params.id]);

    const [outrasAdocoes] = await conexao.query(
      'SELECT COUNT(*) as total FROM Adocao WHERE id_animal = ?',
      [id_animal]
    );

    if (outrasAdocoes[0].total === 0) {
      await conexao.query(
        'UPDATE Animal SET status = ? WHERE id_animal = ?',
        ['Disponível', id_animal]
      );
    }

    await conexao.commit();
    res.json({ mensagem: 'Adoção cancelada com sucesso!' });

  } catch (erro) {
    await conexao.rollback();
    console.error('Erro ao cancelar adoção:', erro);
    res.status(500).json({ erro: 'Erro ao cancelar adoção' });
  } finally {
    conexao.release();
  }
});

// ROTA NOVA: Remove todos os registros de adoção (limpa o histórico)
router.delete('/historico/limpar', async (req, res) => {
  try {
    // Executa o comando para apagar todos os dados da tabela Adocao
    await db.query('TRUNCATE TABLE Adocao');
    res.json({ mensagem: 'Histórico de adoções foi limpo com sucesso!' });
  } catch (erro) {
    console.error('Erro ao limpar histórico de adoções:', erro);
    res.status(500).json({ erro: 'Erro ao limpar o histórico' });
  }
});

module.exports = router;