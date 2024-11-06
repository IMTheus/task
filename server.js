// const express = require('express');
// const db = require('./database');
// const app = express();
// const PORT = 3000;

// app.use(express.json());
// app.use(express.static(__dirname)); // Serve os arquivos estáticos como HTML, CSS, JS

// // Rota para obter todas as tarefas, ordenadas pela ordem de apresentação
// app.get('/tarefas', (req, res) => {
//     db.all("SELECT * FROM tarefas ORDER BY ordem", (err, rows) => {
//         if (err) return res.status(500).json({ error: err.message });
//         res.json(rows);
//     });
// });

// // Rota para adicionar uma nova tarefa
// app.post('/tarefas', (req, res) => {
//     const { nome, custo, data_limite } = req.body;

//     // Insere a nova tarefa no final da ordem
//     db.run(`INSERT INTO tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, (SELECT COALESCE(MAX(ordem), 0) + 1 FROM tarefas))`,
//         [nome, custo, data_limite],
//         function (err) {
//             if (err) return res.status(400).json({ error: "Erro ao adicionar tarefa ou nome já existe" });
//             res.json({ id: this.lastID });
//         }
//     );
// });

// // Rota para atualizar uma tarefa existente
// app.put('/tarefas/:id', (req, res) => {
//     const { id } = req.params;
//     const { nome, custo, data_limite } = req.body;

//     // Atualiza a tarefa no banco de dados
//     db.run(`UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ? AND NOT EXISTS (SELECT 1 FROM tarefas WHERE nome = ? AND id != ?)`,
//         [nome, custo, data_limite, id, nome, id],
//         function (err) {
//             if (err || this.changes === 0) return res.status(400).json({ error: "Erro ao atualizar ou nome duplicado" });
//             res.json({ updated: this.changes });
//         }
//     );
// });

// // Rota para excluir uma tarefa
// app.delete('/tarefas/:id', (req, res) => {
//     const { id } = req.params;
    
//     db.run(`DELETE FROM tarefas WHERE id = ?`, id, function (err) {
//         if (err || this.changes === 0) return res.status(400).json({ error: "Erro ao excluir tarefa" });
//         res.json({ deleted: this.changes });
//     });
// });

// app.listen(PORT, () => {
//     console.log(`Servidor rodando na porta ${PORT}`);
// });

const express = require('express');
const db = require('./database');
const app = express();
const PORT = 3000;

app.use(express.json());
app.use(express.static(__dirname));

// Confirma que o servidor está rodando
console.log("Iniciando o servidor...");

// Rota para obter todas as tarefas
app.get('/tarefas', (req, res) => {
    console.log("Recebida requisição GET em /tarefas");
    db.all("SELECT * FROM tarefas ORDER BY ordem", (err, rows) => {
        if (err) {
            console.error("Erro ao obter tarefas:", err.message);
            return res.status(500).json({ error: err.message });
        }
        res.json(rows);
    });
});

// Rota para adicionar uma nova tarefa
app.post('/tarefas', (req, res) => {
    console.log("Recebida requisição POST em /tarefas com dados:", req.body);
    const { nome, custo, data_limite } = req.body;

    db.run(
        `INSERT INTO tarefas (nome, custo, data_limite, ordem) VALUES (?, ?, ?, (SELECT COALESCE(MAX(ordem), 0) + 1 FROM tarefas))`,
        [nome, custo, data_limite],
        function (err) {
            if (err) {
                console.error("Erro ao adicionar tarefa:", err.message);
                return res.status(400).json({ error: "Erro ao adicionar tarefa ou nome já existe" });
            }
            res.json({ id: this.lastID });
        }
    );
});

// Rota para atualizar uma tarefa existente
app.put('/tarefas/:id', (req, res) => {
    console.log(`Recebida requisição PUT em /tarefas/${req.params.id}`);
    const { id } = req.params;
    const { nome, custo, data_limite } = req.body;

    db.run(
        `UPDATE tarefas SET nome = ?, custo = ?, data_limite = ? WHERE id = ? AND NOT EXISTS (SELECT 1 FROM tarefas WHERE nome = ? AND id != ?)`,
        [nome, custo, data_limite, id, nome, id],
        function (err) {
            if (err || this.changes === 0) {
                console.error("Erro ao atualizar tarefa ou nome duplicado:", err ? err.message : "Nenhuma alteração");
                return res.status(400).json({ error: "Erro ao atualizar ou nome duplicado" });
            }
            res.json({ updated: this.changes });
        }
    );
});

// Rota para excluir uma tarefa
app.delete('/tarefas/:id', (req, res) => {
    console.log(`Recebida requisição DELETE em /tarefas/${req.params.id}`);
    const { id } = req.params;

    db.run(`DELETE FROM tarefas WHERE id = ?`, id, function (err) {
        if (err || this.changes === 0) {
            console.error("Erro ao excluir tarefa:", err ? err.message : "Nenhuma alteração");
            return res.status(400).json({ error: "Erro ao excluir tarefa" });
        }
        res.json({ deleted: this.changes });
    });
});

app.listen(PORT, () => {
    console.log(`Servidor rodando na porta ${PORT}`);
});



