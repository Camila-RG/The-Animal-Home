const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Rota principal para executar consultas pré-definidas com base em um ID
router.get('/:id', async (req, res) => {
  const consultaId = req.params.id;
  let query = '';

  // Seleciona a query SQL com base no ID recebido
  switch (consultaId) {
    case '1':
      // 1. Lista todos os animais que estão disponíveis para adoção
      query = `SELECT * FROM Animal WHERE status = 'Disponível'`;
      break;
    case '2':
      // 2. Traz o histórico completo de adoções
      query = `
        SELECT 
          a.id_adocao,
          an.nome AS animal,
          an.especie,
          ad.nome AS adotante,
          ad.email,
          a.data_adocao
        FROM Adocao a
        JOIN Animal an ON a.id_animal = an.id_animal
        JOIN Adotante ad ON a.id_adotante = ad.id_adotante
        ORDER BY a.data_adocao DESC
      `;
      break;
    case '3':
      // 3. Conta quantos animais existem de cada espécie
      query = `
        SELECT especie, COUNT(*) as total
        FROM Animal
        GROUP BY especie
      `;
      break;
    case '4':
      // 4. Lista os adotantes com o total de adoções feitas
      query = `
        SELECT 
          ad.nome AS adotante,
          ad.email,
          COUNT(a.id_adocao) as total_adocoes
        FROM Adotante ad
        LEFT JOIN Adocao a ON ad.id_adotante = a.id_adotante
        GROUP BY ad.id_adotante, ad.nome, ad.email
        HAVING total_adocoes > 0
      `;
      break;
    case '5':
      // 5. Mostra os animais que nunca foram adotados
      query = `SELECT * FROM Animal WHERE id_animal NOT IN (SELECT id_animal FROM Adocao)`;
      break;
    default:
      // Se o ID não for válido, retorna um erro
      return res.status(400).json({ erro: 'Consulta não encontrada' });
  }

  try {
    // Executa a query selecionada e retorna o resultado
    const [resultados] = await db.query(query);
    res.json(resultados);
  } catch (erro) {
    console.error(`Erro ao executar consulta ${consultaId}:`, erro);
    res.status(500).json({ erro: `Erro ao executar a consulta` });
  }
});

module.exports = router;