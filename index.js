const express = require('express');

const { Pool } = require('pg');
const pug = require('pug');
const path = require('path');

const app = express();
const port = 3000;

app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'pim',
  port: 5432,
});

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.get('/produtos', async (req, res) => {
    try {
      const result = await pool.query('SELECT * FROM produtos');
      // Certifique-se de que 'produtos' é um array
      res.render('listar', { produtos: result.rows });
    } catch (err) {
      console.error(err);
      res.status(500).json({ error: 'Erro ao buscar produtos' });
    }
  });
  
app.get('/produtos/novo', (req, res) => {
    res.render('produto');
  });
app.post('/produtos', async (req, res) => {
  const { nome, preco } = req.body;
        console.log(nome)
  try {
    const result = await pool.query(
      'INSERT INTO produtos (nome, preco) VALUES ($1, $2 ) RETURNING *',
      [nome, preco ]
    );
    res.redirect('/produtos');
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Erro ao criar produto' });
  }
});

app.listen(port, () => {
  console.log(`Servidor rodando em http://localhost:${port}`);
});

