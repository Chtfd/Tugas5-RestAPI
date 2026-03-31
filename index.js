const express = require('express');
const app = express();
const pool = require('./db');

app.use(express.json());

app.get('/', (req, res) => {
  res.send('API Hotel aktif 🚀');
});

// GET ALL
app.get('/hotels', async (req, res) => {
  const result = await pool.query('SELECT * FROM hotels ORDER BY id');
  res.json(result.rows);
});

// GET BY ID
app.get('/hotels/:id', async (req, res) => {
  const { id } = req.params;
  const result = await pool.query('SELECT * FROM hotels WHERE id=$1', [id]);

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  res.json(result.rows[0]);
});

// POST
app.post('/hotels', async (req, res) => {
  const { name, location, price, rating } = req.body;

  const result = await pool.query(
    'INSERT INTO hotels (name, location, price, rating) VALUES ($1,$2,$3,$4) RETURNING *',
    [name, location, price, rating]
  );

  res.json(result.rows[0]);
});

// PUT
app.put('/hotels/:id', async (req, res) => {
  const { id } = req.params;
  const { name, location, price, rating } = req.body;

  const result = await pool.query(
    'UPDATE hotels SET name=$1, location=$2, price=$3, rating=$4 WHERE id=$5 RETURNING *',
    [name, location, price, rating, id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  res.json(result.rows[0]);
});

// DELETE
app.delete('/hotels/:id', async (req, res) => {
  const { id } = req.params;

  const result = await pool.query(
    'DELETE FROM hotels WHERE id=$1 RETURNING *',
    [id]
  );

  if (result.rows.length === 0) {
    return res.status(404).json({ message: 'Data tidak ditemukan' });
  }

  res.json({ message: 'Data berhasil dihapus' });
});

app.listen(process.env.PORT, () => {
  console.log(`Server jalan di http://localhost:${process.env.PORT}`);
});