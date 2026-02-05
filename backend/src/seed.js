const fs = require('fs');
const path = require('path');
const db = require('./db');

const sqlPath = path.join(__dirname, 'sql', 'init.sql');
const sql = fs.readFileSync(sqlPath, 'utf-8');

db.exec(sql);
console.log('Database initialized and seeded successfully.');
