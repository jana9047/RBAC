const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Jana@9047',
    database: 'Student' 
});

db.connect(err => {
    if (err) console.error('Error connecting to MySQL:', err);
    else console.log('Shared DB connection established.');
});

module.exports = db;
