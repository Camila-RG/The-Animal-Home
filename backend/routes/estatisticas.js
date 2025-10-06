const express = require('express');
const router = express.Router();
const db = require('../db/connection');

// Rota para buscar estatísticas gerais do sistema
router.get('/', async (req, res) => {
  try {
    // Busca o total de animais cadastrados
    const [totalAnimais] = await db.query('SELECT COUNT(*) as total FROM Animal');
    
    // Busca o total de animais disponíveis para adoção
    const [disponiveis] = await db.query('SELECT COUNT(*) as total FROM Animal WHERE status = "Disponível"');
    
    // Busca o total de animais já adotados
    const [adotados] = await db.query('SELECT COUNT(*) as total FROM Animal WHERE status = "Adotado"');
    
    // Busca o total de adoções realizadas
    const [totalAdocoes] = await db.query('SELECT COUNT(*) as total FROM Adocao');
    
    // Busca o total de pessoas cadastradas como adotantes
    const [totalAdotantes] = await db.query('SELECT COUNT(*) as total FROM Adotante');
    
    // Agrupa os animais por espécie, mostrando a quantidade de cada uma
    const [porEspecie] = await db.query(`
      SELECT especie, COUNT(*) as quantidade
      FROM Animal
      GROUP BY especie
      ORDER BY quantidade DESC
    `);
    
    // Agrupa os animais por status (ex: disponível, adotado)
    const [porStatus] = await db.query(`
      SELECT status, COUNT(*) as quantidade
      FROM Animal
      GROUP BY status
    `);
    
    // Conta quantas adoções foram feitas nos últimos 7 dias
    const [adocoesRecentes] = await db.query(`
      SELECT COUNT(*) as total
      FROM Adocao
      WHERE data_adocao >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
    `);

    // Retorna todas as estatísticas em formato JSON
    res.json({
      resumo: {
        total_animais: totalAnimais[0].total,
        disponiveis: disponiveis[0].total,
        adotados: adotados[0].total,
        total_adocoes: totalAdocoes[0].total,
        total_adotantes: totalAdotantes[0].total,
        adocoes_ultimos_7_dias: adocoesRecentes[0].total
      },
      por_especie: porEspecie,
      por_status: porStatus
    });
  } catch (erro) {
    // Caso ocorra algum erro na consulta, retorna erro 500
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

// Rota para buscar o número de adoções agrupadas por mês
router.get('/adocoes-por-mes', async (req, res) => {
  try {
    // Agrupa as adoções por mês e retorna os últimos 12 meses
    const [resultado] = await db.query(`
      SELECT 
        DATE_FORMAT(data_adocao, '%Y-%m') as mes,
        COUNT(*) as total
      FROM Adocao
      GROUP BY mes
      ORDER BY mes DESC
      LIMIT 12
    `);
    res.json(resultado);
  } catch (erro) {
    // Caso ocorra algum erro na consulta, retorna erro 500
    console.error('Erro ao buscar adoções por mês:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoções por mês' });
  }
});

// Exporta o router para ser usado nas rotas principais
module.exports = router;