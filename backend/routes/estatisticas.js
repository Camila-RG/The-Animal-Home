const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const Adotante = require('../models/Adotante');
const Adocao = require('../models/Adocao');

// Rota para estatísticas gerais
router.get('/', async (req, res) => {
  try {
    // Total de animais
    const totalAnimais = await Animal.countDocuments();
    
    // Animais disponíveis
    const disponiveis = await Animal.countDocuments({ status: 'Disponível' });
    
    // Animais adotados
    const adotados = await Animal.countDocuments({ status: 'Adotado' });
    
    // Total de adoções
    const totalAdocoes = await Adocao.countDocuments();
    
    // Total de adotantes
    const totalAdotantes = await Adotante.countDocuments();
    
    // Adoções nos últimos 7 dias
    const seteDiasAtras = new Date();
    seteDiasAtras.setDate(seteDiasAtras.getDate() - 7);
    const adocoesRecentes = await Adocao.countDocuments({
      data_adocao: { $gte: seteDiasAtras }
    });
    
    // Animais por espécie (agregação)
    const porEspecie = await Animal.aggregate([
      {
        $group: {
          _id: '$especie',
          quantidade: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          especie: '$_id',
          quantidade: 1
        }
      },
      { $sort: { quantidade: -1 } }
    ]);
    
    // Animais por status
    const porStatus = await Animal.aggregate([
      {
        $group: {
          _id: '$status',
          quantidade: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          status: '$_id',
          quantidade: 1
        }
      }
    ]);
    
    // Retorna todas as estatísticas
    res.json({
      resumo: {
        total_animais: totalAnimais,
        disponiveis: disponiveis,
        adotados: adotados,
        total_adocoes: totalAdocoes,
        total_adotantes: totalAdotantes,
        adocoes_ultimos_7_dias: adocoesRecentes
      },
      por_especie: porEspecie,
      por_status: porStatus
    });
    
  } catch (erro) {
    console.error('Erro ao buscar estatísticas:', erro);
    res.status(500).json({ erro: 'Erro ao buscar estatísticas' });
  }
});

// Adoções por mês
router.get('/adocoes-por-mes', async (req, res) => {
  try {
    const resultado = await Adocao.aggregate([
      {
        $group: {
          _id: {
            ano: { $year: '$data_adocao' },
            mes: { $month: '$data_adocao' }
          },
          total: { $sum: 1 }
        }
      },
      {
        $project: {
          _id: 0,
          mes: {
            $concat: [
              { $toString: '$_id.ano' },
              '-',
              {
                $cond: [
                  { $lt: ['$_id.mes', 10] },
                  { $concat: ['0', { $toString: '$_id.mes' }] },
                  { $toString: '$_id.mes' }
                ]
              }
            ]
          },
          total: 1
        }
      },
      { $sort: { mes: -1 } },
      { $limit: 12 }
    ]);
    
    res.json(resultado);
  } catch (erro) {
    console.error('Erro ao buscar adoções por mês:', erro);
    res.status(500).json({ erro: 'Erro ao buscar adoções por mês' });
  }
});

module.exports = router;