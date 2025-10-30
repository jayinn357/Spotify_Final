// backennd/server.js
import express from 'express';
import cors from 'cors';
import mysql from 'mysql2';

const app = express();
app.use(cors());
app.use(express.json());

// Create MySQL connection
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'president357',
    database: 'spotify_final'
});

db.connect(err => {
    if (err) throw err;
        console.log("Connected to MySQL");
});

// example route
app.get('/api/tracks', (req, res) => {
    db.query('SELECT * FROM tracks', (err, results) => {
        if (err) throw err;
        res.json(results);
    });
});

// start server
app.listen(5000, () => console.log('Server running on port 5000'));