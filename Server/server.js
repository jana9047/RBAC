const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const bodyParser = require('body-parser');


const userController = require('./userController.js');
const roleController = require('./roleController.js');
const dynamicController = require('./dynamicController.js');

const app = express();
const port = 9092;


app.use(cors());
app.use(bodyParser.json());
app.use(express.static('Public'));


const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jana@9047'
});

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
    });
});


app.use('/api/properties', userController);       
app.use('/api/roles', roleController);      
app.use('/api/permissions', dynamicController); 


app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
