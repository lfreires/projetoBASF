const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors'); // Importa o pacote 'cors'
const path = require('path'); // Para trabalhar com diretorios
const app = express();
const port = 3003;

// Configuração para servir arquivos estáticos
app.use(express.static(path.join(__dirname, 'src')));

const sqlite3 = require('sqlite3').verbose();
const db = new sqlite3.Database('banco.db');

db.run(`CREATE TABLE IF NOT EXISTS usuarios 
(
    id INT, nome TEXT, sobrenome TEXT, email TEXT, telefone TEXT, cidade TEXT,
    volume INT, descricao TEXT, produtos TEXT
)`);

app.use(cors());
app.use(bodyParser.json());

let id = 0;

// Rota para lidar com a solicitação POST para "/teste"
app.post('/bd', async (req, res) => {

    const data = req.body;
    db.run(`INSERT INTO usuarios 
    (
        id, nome, sobrenome, email, telefone, cidade, volume, descricao, produtos) 
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?
    )`, 
        [
        id,
        data.nome,
        data.sobrenome,
        data.email,
        data.telefone,
        data.cidade,
        data.volume,
        data.descricao,
        JSON.stringify(data.produtos)
        ]
    );

    res.json({
        code: 200
    });

    id = id + 1;

});

// Rota para servir o arquivo HTML quando o servidor for acessado
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, './src/html/index.html'));
});

// Inicia o servidor na porta especificada
app.listen(port, () => {
    console.log(`Servidor rodando em http://localhost:${port}/`);
});
