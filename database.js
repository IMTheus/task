const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Usando um banco de dados persistente em um arquivo
const db = new sqlite3.Database(path.resolve(__dirname, 'tarefas.db'));

// Cria a tabela de tarefas 
db.serialize(() => {
    db.run(`CREATE TABLE IF NOT EXISTS tarefas (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        nome TEXT NOT NULL UNIQUE,
        custo REAL NOT NULL,
        data_limite TEXT NOT NULL,
        ordem INTEGER UNIQUE NOT NULL
    )`);
});

module.exports = db;

