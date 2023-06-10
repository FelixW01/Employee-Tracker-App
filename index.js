const inquirer = require('inquirer');
const db = require('./connection.js');

db.connect(err => {
    if (err) throw err;
    console.log('DB connected.');
    options();
})













