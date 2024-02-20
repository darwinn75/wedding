const express = require('express');
const bodyParser = require('body-parser');
const sqlite3 = require('sqlite3').verbose();

const app = express();
const port = 3000;
const db = new sqlite3.Database('wedding.db');



// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));


// Create table
db.run('CREATE TABLE IF NOT EXISTS guests (id INTEGER PRIMARY KEY AUTOINCREMENT, guestName TEXT, nbPersons INTEGER)');

// Routes
app.get('/', (req, res) => {
    res.sendFile(__dirname + '/Site mariage des + Bo/index.html');
});

app.post('/submit-form', (req, res) => {
    const { guestName, nbPersons } = req.body;
    db.run('INSERT INTO guests (guestName, nbPersons) VALUES (?, ?)', [guestName, nbPersons], (err) => {
        if (err) {
            return console.error(err.message);
        }
        // Redirect to the confirmation page instead of sending text
        res.sendFile(__dirname + '/Site mariage des + Bo/confirmation.html');
    });
});

// Developer route to see all submissions
app.get('/view-submissions', (req, res) => {
    db.all('SELECT * FROM guests', [], (err, rows) => {
        if (err) {
            throw err;
        }
        res.json(rows); // Sending back a JSON response with all guest submissions
    });
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});