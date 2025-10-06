USE TheAnimalHome;

-- 1. Lista todos os animais que estão disponíveis para adoção
SELECT * FROM Animal WHERE status = 'Disponível';

-- 2. Traz o histórico completo de adoções, mostrando dados do animal e do adotante
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
ORDER BY a.data_adocao DESC;

-- 3. Conta quantos animais existem de cada espécie cadastrada
SELECT especie, COUNT(*) as total
FROM Animal
GROUP BY especie;

-- 4. Lista os adotantes junto com o total de adoções feitas por cada um
SELECT 
  ad.nome AS adotante,
  ad.email,
  COUNT(a.id_adocao) as total_adocoes
FROM Adotante ad
LEFT JOIN Adocao a ON ad.id_adotante = a.id_adotante
GROUP BY ad.id_adotante, ad.nome, ad.email
HAVING total_adocoes > 0;

-- 5. Mostra os animais que nunca foram adotados
SELECT * FROM Animal
WHERE id_animal NOT IN (SELECT id_animal FROM Adocao);