<div align="center">

  <img src="frontend/images/logo.png" alt="Logo The Animal Home" width="120"/>

  <h2>🏠💜 The Animal Home</h2>

</div>
-----

## 📖 Sobre o Projeto

The Animal Home é uma plataforma web completa dedicada à adoção responsável de animais, construída com uma arquitetura cliente-servidor.

Com um design acolhedor e funcional, o sistema permite que visitantes conheçam os animais disponíveis, filtrem por preferências e finalizem uma adoção de forma simples e interativa. A área administrativa oferece aos funcionários ferramentas robustas para gerenciar os animais, acompanhar o histórico e extrair dados importantes do sistema.

-----

## ✨ Funcionalidades

### 👩‍💻 Para Visitantes (Público Geral)

  - 🔍 **Filtro de Animais:** Encontre o pet ideal filtrando por espécie, idade e porte.
  - 🐶 **Visualização Completa:** Veja informações e fotos de cada animal.
  - 💜 **Carrinho de Adoção:** Adicione um ou mais animais ao carrinho com uma animação interativa.
  - 📋 **Formulário de Adoção:** Finalize o processo de adoção preenchendo um formulário completo, incluindo nome, contato e endereço.

### 🧑‍🏭 Para Funcionários (Portal Administrativo)

  - 🔐 **Acesso Restrito:** Área administrativa protegida por login.
  - 🐾 **Gerenciamento de Animais (CRUD):** Cadastre novos animais com foto, atualize informações e remova registros.
  - 📜 **Histórico de Adoções:** Consulte o histórico completo de todas as adoções realizadas.
  - 🗑️ **Limpeza de Histórico:** Funcionalidade para apagar todos os registros de adoção, com confirmação de segurança.
  - 📊 **Consultas SQL Interativas:** Execute 5 consultas pré-definidas diretamente da interface para extrair dados estratégicos, como a contagem de animais por espécie ou a lista de animais nunca adotados.
  - 🚪 **Logout Seguro:** Opção para sair da conta de funcionário.

-----

## 🛠️ Tecnologias Utilizadas

  - **Backend:**
      - **Node.js:** Ambiente de execução do JavaScript no servidor.
      - **Express.js:** Framework para a construção da API RESTful.
      - **MySQL2:** Driver de conexão com o banco de dados MySQL.
      - **CORS:** Middleware para permitir a comunicação segura entre o frontend e o backend.
  - **Frontend:**
      - **HTML5:** Estrutura semântica das páginas.
      - **CSS3:** Estilização e design da interface.
      - **JavaScript (ES6+):** Interatividade, manipulação do DOM e comunicação com a API via `fetch`.
  - **Banco de Dados:**
      - **MySQL:** Sistema de gerenciamento de banco de dados relacional.

-----

## 🧭 Como Executar o Projeto

Para executar este projeto localmente, você precisará ter o **Node.js** e o **MySQL** instalados. Siga os passos abaixo:

**1. Clone o Repositório**

```bash
git clone https://github.com/Camila-RG/The-Animal-Home.git
cd The-Animal-Home
```

**2. Configure o Banco de Dados**

  - Conecte-se ao seu MySQL e crie o banco de dados `TheAnimalHome`.
  - Execute o script do arquivo `backend/db/create_tables.sql` para criar todas as tabelas necessárias.

**3. Configure o Backend**

  - Navegue até a pasta do backend:
    ```bash
    cd backend
    ```
  - Instale as dependências do projeto:
    ```bash
    npm install
    ```
  - Crie um arquivo chamado `.env` na raiz da pasta `backend` e preencha com suas credenciais do MySQL:
    ```
    DB_HOST=localhost
    DB_USER=root
    DB_PASS=sua_senha_aqui
    DB_NAME=TheAnimalHome
    PORT=3000
    ```
  - Inicie o servidor do backend:
    ```bash
    npm run dev
    ```
  - O terminal deve exibir a mensagem `🚀 Servidor rodando na porta 3000`. Mantenha este terminal aberto.

**4. Execute o Frontend**

  - Abra um novo terminal.
  - Navegue até a pasta do projeto novamente.
  - A maneira mais fácil de rodar o frontend é usando a extensão Live Server do VS Code.
      - Abra a pasta do projeto no VS Code.
      - Clique com o botão direito no arquivo `frontend/index.html`.
      - Selecione "Open with Live Server".
  - O site abrirá no seu navegador, geralmente no endereço `http://127.0.0.1:5500`, e já estará conectado ao seu backend.



