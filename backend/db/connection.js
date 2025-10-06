const mysql = require('mysql2/promise');

// Cria um pool de conexões para o banco de dados MySQL
const pool = mysql.createPool({
  host: process.env.DB_HOST,      // Endereço do servidor MySQL
  user: process.env.DB_USER,      // Usuário do banco
  password: process.env.DB_PASS,  // Senha do banco
  database: process.env.DB_NAME,  // Nome do banco de dados
  waitForConnections: true,       // Aguarda se todas as conexões estiverem ocupadas
  connectionLimit: 10,            // Número máximo de conexões simultâneas
  queueLimit: 0                   // Sem limite para fila de conexões
});

// Testa a conexão ao iniciar a aplicação
pool.getConnection()
  .then(conn => {
    console.log('✅ Conectado ao MySQL com sucesso!');
    conn.release(); // Libera a conexão após o teste
  })
  .catch(err => {
    console.error('❌ Erro ao conectar ao MySQL:', err.message);
  });

// Exporta o pool para ser usado nas consultas em outros arquivos
module.exports = pool;