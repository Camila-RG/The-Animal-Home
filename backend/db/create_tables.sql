-- Criação do banco de dados caso não exista
CREATE DATABASE IF NOT EXISTS TheAnimalHome;
USE TheAnimalHome;

-- Tabela principal para cadastro dos animais (COM A COLUNA imagem_url ADICIONADA)
CREATE TABLE IF NOT EXISTS Animal (
  id_animal INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único do animal
  nome VARCHAR(100) NOT NULL,               -- Nome do animal
  especie VARCHAR(100) NOT NULL,            -- Espécie (ex: cachorro, gato)
  idade INT NOT NULL,                       -- Idade em anos
  sexo CHAR(1) NOT NULL,                    -- Sexo: M ou F
  porte VARCHAR(20),                        -- Porte do animal (Pequeno, Médio, Grande)
  imagem_url VARCHAR(255),                  -- URL da imagem do animal (CORREÇÃO APLICADA AQUI)
  data_chegada DATE,                        -- Data de chegada do animal no abrigo
  status VARCHAR(20) DEFAULT 'Disponível'   -- Situação do animal (ex: disponível, adotado)
);

-- Tabela para cadastro dos adotantes
CREATE TABLE IF NOT EXISTS Adotante (
  id_adotante INT PRIMARY KEY AUTO_INCREMENT, -- Identificador único do adotante
  nome VARCHAR(100) NOT NULL,                 -- Nome completo
  email VARCHAR(100) NOT NULL UNIQUE,         -- E-mail do adotante
  telefone VARCHAR(20) NOT NULL,              -- Telefone para contato
  endereco VARCHAR(200)                       -- Endereço residencial
);

CREATE TABLE IF NOT EXISTS Adocao (
  id_adocao INT PRIMARY KEY AUTO_INCREMENT,   -- Identificador único da adoção
  id_animal INT NOT NULL,                     -- Animal adotado
  id_adotante INT NOT NULL,                   -- Pessoa que adotou
  data_adocao DATE NOT NULL,                  -- Data da adoção
  FOREIGN KEY (id_animal) REFERENCES Animal(id_animal) ON DELETE CASCADE,    -- Relaciona com Animal
  FOREIGN KEY (id_adotante) REFERENCES Adotante(id_adotante) ON DELETE CASCADE -- Relaciona com Adotante
);

DROP DATABASE TheAnimalHome;

CREATE DATABASE IF NOT EXISTS TheAnimalHome;
USE TheAnimalHome;

CREATE TABLE IF NOT EXISTS Animal (
  id_animal INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  especie VARCHAR(100) NOT NULL,
  idade INT NOT NULL,
  sexo CHAR(1) NOT NULL,
  porte VARCHAR(20),
  imagem_url VARCHAR(255), -- Coluna da imagem incluída corretamente
  data_chegada DATE,
  status VARCHAR(20) DEFAULT 'Disponível'
);

CREATE TABLE IF NOT EXISTS Adotante (
  id_adotante INT PRIMARY KEY AUTO_INCREMENT,
  nome VARCHAR(100) NOT NULL,
  email VARCHAR(100) NOT NULL UNIQUE,
  telefone VARCHAR(20) NOT NULL,
  endereco VARCHAR(200)
);

CREATE TABLE IF NOT EXISTS Adocao (
  id_adocao INT PRIMARY KEY AUTO_INCREMENT,
  id_animal INT NOT NULL,
  id_adotante INT NOT NULL,
  data_adocao DATE NOT NULL,
  FOREIGN KEY (id_animal) REFERENCES Animal(id_animal) ON DELETE CASCADE,
  FOREIGN KEY (id_adotante) REFERENCES Adotante(id_adotante) ON DELETE CASCADE
);