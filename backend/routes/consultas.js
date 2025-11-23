const express = require('express');
const router = express.Router();
const Animal = require('../models/Animal');
const Adotante = require('../models/Adotante');
const Adocao = require('../models/Adocao');

// Rota para executar consultas predefinidas
router.get('/:id', async (req, res) => {
  const consultaId = req.params.id;
  
  try {
    let resultado;
    
    switch (consultaId) {
      case '1':
        // 1. Lista animais disponíveis
        resultado = await Animal.find({ status: 'Disponível' });
        break;
        
      case '2':
        // 2. Histórico completo de adoções
        const adocoes = await Adocao.find()
          .populate('id_animal', 'nome especie')
          .populate('id_adotante', 'nome email')
          .sort({ data_adocao: -1 });
        
          resultado = adocoes.map(a => ({
            id_adocao: a._id,
            // Verifica se o animal ainda existe (?) Se sim, pega o nome. Se não (:), escreve aviso
            animal: a.id_animal ? a.id_animal.nome : 'Animal Removido',
            especie: a.id_animal ? a.id_animal.especie : '-',
            // Mesma proteção para o adotante
            adotante: a.id_adotante ? a.id_adotante.nome : 'Adotante Removido',
            email: a.id_adotante ? a.id_adotante.email : '-',
            data_adocao: a.data_adocao
          }));
          break;
        
      case '3':
        // 3. Conta animais por espécie
        resultado = await Animal.aggregate([
          {
            $group: {
              _id: '$especie',
              total: { $sum: 1 }
            }
          },
          {
            $project: {
              _id: 0,
              especie: '$_id',
              total: 1
            }
          },
          { $sort: { total: -1 } }
        ]);
        break;
        
      case '4':
        // 4. Lista adotantes com total de adoções
        resultado = await Adocao.aggregate([
          {
            $group: {
              _id: '$id_adotante',
              total_adocoes: { $sum: 1 }
            }
          },
          {
            $lookup: {
              from: 'adotantes',
              localField: '_id',
              foreignField: '_id',
              as: 'adotante_info'
            }
          },
          { $unwind: '$adotante_info' },
          {
            $match: {
              total_adocoes: { $gt: 0 }
            }
          },
          {
            $project: {
              _id: 0,
              adotante: '$adotante_info.nome',
              email: '$adotante_info.email',
              total_adocoes: 1
            }
          },
          { $sort: { total_adocoes: -1 } }
        ]);
        break;
        
      case '5':
        // 5. Animais nunca adotados
        const animaisAdotados = await Adocao.distinct('id_animal');
        resultado = await Animal.find({
          _id: { $nin: animaisAdotados }
        });
        break;
        
      default:
        return res.status(400).json({ erro: 'Consulta não encontrada' });
    }
    
    res.json(resultado);
    
  } catch (erro) {
    console.error(`Erro ao executar consulta ${consultaId}:`, erro);
    res.status(500).json({ erro: 'Erro ao executar a consulta' });
  }
});

module.exports = router;