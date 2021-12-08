const express = require('express');
const mysql = require('mysql');

// create connection

const db = mysql.createConnection({
    host : 'localhost',
    user : 'root',
    password : '#',
    database : 'groupomania'
});

// connect

db.connect((err) => {
    if(err){
        throw err;
    }
    console.log('mysql Connected...');
});

const app = express();

app.listen('3000', () => {
    console.log('server started on port 3000');
});