const express = require('express');
const router = express.Router();
const db = require('./db');



db.connect(err => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL');

   
    db.query('CREATE DATABASE IF NOT EXISTS Student', (err) => {
        if (err) {
            console.error('Error creating database:', err);
            return;
        }
        console.log('Database "Student" is ready or created.');

        db.changeUser({ database: 'Student' }, (err) => {
            if (err) {
                console.error('Error switching to database "Student":', err);
                return;
            }
            console.log('Switched to "Student" database.');

           
            const createRolesTableQuery = `
                CREATE TABLE IF NOT EXISTS Roles (
                    id INT AUTO_INCREMENT PRIMARY KEY,
                    role_name VARCHAR(255) NOT NULL,
                    role_description TEXT NOT NULL
                )
            `;
            db.query(createRolesTableQuery, (err) => {
                if (err) {
                    console.error('Error creating Roles table:', err);
                    return;
                }
                console.log('Roles table is ready or created.');
            });
        });
    });
});




router.get('/', (req, res) => {
    db.query('SELECT * FROM Roles', (err, results) => {
        if (err) {
            console.error('Error fetching roles:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json(results);
        }
    });
});


router.post('/', (req, res) => {
    const { role_name, role_description } = req.body;
    db.query('INSERT INTO Roles (role_name, role_description) VALUES (?, ?)', 
        [role_name, role_description], 
        (err, results) => {
            if (err) {
                console.error('Error adding role:', err);
                res.status(500).json({ error: 'Database error' });
            } else {
                res.json({ message: 'Role added successfully', id: results.insertId });
            }
        });
});


router.delete('/:id', (req, res) => {
    const roleId = req.params.id;
    db.query('DELETE FROM Roles WHERE id = ?', [roleId], (err, results) => {
        if (err) {
            console.error('Error deleting role:', err);
            res.status(500).json({ error: 'Database error' });
        } else {
            res.json({ message: 'Role deleted successfully' });
        }
    });
});


router.put('/:id', (req, res) => {
    const roleId = req.params.id;
    const { role_name, role_description } = req.body;

    if (!role_name || !role_description) {
        return res.status(400).json({ message: 'All fields are required.' });
    }

    db.query('UPDATE Roles SET role_name = ?, role_description = ? WHERE id = ?', 
        [role_name, role_description, roleId], 
        (err, results) => {
            if (err) {
                console.error('Error updating role:', err);
                res.status(500).json({ error: 'Database error' });
            } else if (results.affectedRows === 0) {
                res.status(404).json({ message: 'Role not found.' });
            } else {
                res.json({ message: 'Role updated successfully' });
            }
        });
});


module.exports = router;