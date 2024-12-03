const express = require('express');
const db = require('./db');
const router = express.Router();


db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

    db.query('CREATE DATABASE IF NOT EXISTS Student', (err, result) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database ensured.');

       
        db.changeUser({ database: 'Student' }, err => {
            if (err) {
                console.error('Error selecting database:', err);
                return;
            }
            console.log('Using database Student.');

           
            const createTableQuery = `
                CREATE TABLE IF NOT EXISTS usercontroller (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    name VARCHAR(255) NOT NULL,
                    email VARCHAR(255) NOT NULL,
                    role VARCHAR(255) NOT NULL
                )
            `;
            db.query(createTableQuery, (err, result) => {
                if (err) {
                    console.error('Error creating table:', err);
                    return;
                }
                console.log('Table ensured.');
            });
        });
    });
});



router.get('/', (req, res) => {
    db.query('SELECT * FROM usercontroller', (err, results) => {
        if (err) {
            console.error('Error fetching properties:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});


router.post('/', (req, res) => {
    const { name, email, role } = req.body;
    db.query('INSERT INTO usercontroller (name, email, role) VALUES (?, ?, ?)', 
        [name, email, role], 
        (err, results) => {
            if (err) {
                console.error('Error adding property:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Property added successfully', id: results.insertId });
            }
        });
});


router.delete('/:id', (req, res) => {
    const propertyId = req.params.id;
    db.query('DELETE FROM usercontroller WHERE id = ?', [propertyId], (err, results) => {
        if (err) {
            console.error('Error deleting property:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Property deleted successfully' });
        }
    });
});

// PUT 
router.put('/:id', (req, res) => {
    const propertyId = req.params.id;
    const { name, email, role } = req.body;

    db.query('UPDATE usercontroller SET name = ?, email = ?, role = ? WHERE id = ?', 
        [name, email, role, propertyId], 
        (err, results) => {
            if (err) {
                console.error('Error updating property:', err);
                res.status(500).json({ error: 'Database error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Property not found.' });
            } else {
                res.json({ message: 'Property updated successfully' });
            }
        });
});

module.exports = router;