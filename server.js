const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME
});

db.connect(err => {
    if (err) {
        console.error('Database connection failed:', err);
        return;
    }
    console.log('Connected to MySQL database');
});

// Create: Store weather data
app.post('/weather', (req, res) => {
    const { location, temperature, description, humidity, wind, date } = req.body;
    const query = 'INSERT INTO weather (location, temperature, description, humidity, wind, date) VALUES (?, ?, ?, ?, ?, ?)';
    db.query(query, [location, temperature, description, humidity, wind, date], (err, result) => {
        if (err) return res.status(500).json({ error: err.message });
        res.status(201).json({ message: 'Weather data saved', id: result.insertId });
    });
});

// Read: Get weather data by location
app.get('/weather/:location', (req, res) => {
    const query = 'SELECT * FROM weather WHERE location = ?';
    db.query(query, [req.params.location], (err, results) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json(results);
    });
});

// Update: Modify weather data
app.put('/weather/:id', (req, res) => {
    const { temperature, description, humidity, wind } = req.body;
    const query = 'UPDATE weather SET temperature = ?, description = ?, humidity = ?, wind = ? WHERE id = ?';
    db.query(query, [temperature, description, humidity, wind, req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Weather data updated' });
    });
});

// Delete: Remove weather record
app.delete('/weather/:id', (req, res) => {
    const query = 'DELETE FROM weather WHERE id = ?';
    db.query(query, [req.params.id], (err) => {
        if (err) return res.status(500).json({ error: err.message });
        res.json({ message: 'Weather data deleted' });
    });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
