const express = require('express');
const router = express.Router();
const db = require('./db'); 



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
                CREATE TABLE IF NOT EXISTS permissions (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    permissionName VARCHAR(255) NOT NULL,
                    permissionDescription TEXT NOT NULL
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
    db.query('SELECT * FROM permissions', (err, results) => {
        if (err) {
            console.error('Error fetching permissions:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});


router.post('/', (req, res) => {
    const { permissionName, permissionDescription } = req.body;
    db.query('INSERT INTO permissions (permissionName, permissionDescription) VALUES (?, ?)', 
        [permissionName, permissionDescription], 
        (err, results) => {
            if (err) {
                console.error('Error adding permission:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Permission added successfully', id: results.insertId });
            }
        });
});


router.delete('/:id', (req, res) => {
    const permissionId = req.params.id;
    db.query('DELETE FROM permissions WHERE id = ?', [permissionId], (err, results) => {
        if (err) {
            console.error('Error deleting permission:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Permission deleted successfully' });
        }
    });
});


router.put('/:id', (req, res) => {
    const permissionId = req.params.id;
    const { permissionName, permissionDescription } = req.body;

    db.query('UPDATE permissions SET permissionName = ?, permissionDescription = ? WHERE id = ?', 
        [permissionName, permissionDescription, permissionId], 
        (err, results) => {
            if (err) {
                console.error('Error updating permission:', err);
                res.status(500).json({ error: 'Database error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Permission not found.' });
            } else {
                res.json({ message: 'Permission updated successfully' });
            }
        });
});

module.exports = router;