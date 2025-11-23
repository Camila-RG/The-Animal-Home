<div align="center">

  <img src="frontend/images/logo.png" alt="Logo The Animal Home" width="120"/>

  <h2>🏠💜 The Animal Home</h2>

</div>

> ⚠️ **Nota de Migração (SQL → NoSQL):** Este projeto passou por uma evolução arquitetural. Anteriormente baseado em banco relacional (MySQL), a versão atual utiliza **MongoDB** para maior flexibilidade e escalabilidade.
>
> *Se você precisa rodar uma versão antiga deste projeto (commits anteriores), consulte a seção **"Versões Legadas"** no final deste documento.*

## 📖 Sobre o Projeto

The Animal Home é uma plataforma web completa dedicada à adoção responsável de animais, construída com uma arquitetura cliente-servidor.

Com um design acolhedor e funcional, o sistema permite que visitantes conheçam os animais disponíveis, filtrem por preferências e finalizem uma adoção de forma simples e interativa. A área administrativa oferece aos funcionários ferramentas robustas para gerenciar os animais, acompanhar o histórico e extrair dados importantes do sistema.

-----

## ✨ Funcionalidades (Versão Atual)

### 👩‍💻 Para Visitantes (Público Geral)

  - 🔍 **Filtro de Animais:** Encontre o pet ideal filtrando por espécie, idade e porte.
  - 🐶 **Visualização Completa:** Veja informações e fotos de cada animal.
  - 💜 **Carrinho de Adoção:** Adicione um ou mais animais ao carrinho com uma animação interativa.
  - 📋 **Formulário de Adoção:** Finalize o processo de adoção preenchendo um formulário completo.

### 🧑‍🏭 Para Funcionários (Portal Administrativo)

  - 🔐 **Acesso Restrito:** Área administrativa protegida por login.
  - 🐾 **Gerenciamento de Animais (CRUD):** Cadastre, edite e remova animais do sistema.
  - 📜 **Histórico de Adoções:** Consulte o histórico completo em tempo real.
  - 🗑️ **Limpeza de Histórico:** Funcionalidade segura para resetar registros de adoção.
  - 📊 **Consultas Avançadas (NoSQL):** Execute 5 consultas estratégicas utilizando o *Aggregation Framework* do MongoDB (ex: contagem por espécie, identificar animais nunca adotados, etc).

-----

## 🛠️ Tecnologias Utilizadas

  - **Backend:**
      - **Node.js & Express.js:** API RESTful robusta.
      - **Mongoose:** ODM (Object Data Modeling) para modelagem de dados no MongoDB.
      - **CORS:** Segurança na comunicação entre rotas.
  - **Banco de Dados:**
      - **MongoDB:** Banco de dados NoSQL orientado a documentos.
  - **Frontend:**
      - **HTML5, CSS3, JavaScript (ES6+):** Interface dinâmica sem frameworks pesados.

-----

## 🧭 Como Executar o Projeto (Versão MongoDB)

Para a versão atual, você precisa ter o **Node.js** e o **MongoDB** instalados.

**1. Clone o Repositório**

```bash
git clone [https://github.com/Camila-RG/The-Animal-Home.git](https://github.com/Camila-RG/The-Animal-Home.git)
cd The-Animal-Home
````

**2. Configure o Backend**

  - Entre na pasta do servidor:
    ```bash
    cd backend
    ```
  - Instale as dependências:
    ```bash
    npm install
    ```
  - **Configuração de Ambiente:** Crie um arquivo `.env` na pasta `backend` com a URI do seu MongoDB:
    ```env
    MONGO_URI=mongodb://localhost:27017/TheAnimalHome
    PORT=3000
    ```
  - Inicie o servidor:
    ```bash
    npm start
    ```
  - *O terminal deve exibir: "Conectado ao MongoDB com sucesso\!"*

**3. Execute o Frontend**

  - A maneira mais fácil é usando a extensão **Live Server** do VS Code.
  - Abra a pasta `frontend` no VS Code.
  - Clique com o botão direito no arquivo `index.html`.
  - Selecione **"Open with Live Server"**.

-----

### 🏛️ Instruções para Commits Anteriores (SQL)

Estas instruções aplicam-se apenas se você estiver rodando uma versão antiga do código fonte que utilizava MySQL.

**Tecnologias Antigas:**

  * MySQL2 (Driver)
  * Consultas SQL puras

**Como Executar (Legacy):**

1.  **Configure o Banco de Dados:**

      - Conecte-se ao seu MySQL e crie o banco de dados `TheAnimalHome`.
      - Execute o script do arquivo `backend/db/create_tables.sql`.

2.  **Configure o Backend:**

      - No arquivo `.env`, use as credenciais antigas:
        ```
        DB_HOST=localhost
        DB_USER=root
        DB_PASS=sua_senha_aqui
        DB_NAME=TheAnimalHome
        PORT=3000
        ```
      - Rode `npm run dev`.

3.  **Frontend:**

      - Use o "Live Server" do VS Code no arquivo `index.html`.
