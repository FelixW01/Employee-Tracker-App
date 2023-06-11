const inquirer = require('inquirer');
const db = require('./connection.js');
const table = require('console.table');

db.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    options();
})

//user input via inquirer
function options() {
    inquirer
        .prompt({
            type: "list",
            name: "userChoice",
            message: "What would you like to do?",
            choices: [
                "View All Employees",
                "Add Employee",
                "Update Employee Role",
                "View All Roles",
                "Add Role",
                "View All Departments",
                "Add Department",
                "Quit",
                "View All Employees"
            ]
        })
        .then((res) => { 
            switch(res.userChoice) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'Add Employee':
                    //add employee func
                    break;
                case 'Update Employee Role':
                    //update employee role func
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'Add Role':
                    //add role func
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Quit':
                    db.end();
                    break;
            }
        }).catch((err) => {
            if(err)throw err;
        });
}

function viewEmployees() {
    let query = `SELECT 
        employee.id, 
        employee.first_name, 
        employee.last_name, 
        role.title, 
        department.name AS department, 
        role.salary, 
        CONCAT(manager.first_name, ' ', manager.last_name) AS manager
    FROM employee
    LEFT JOIN role
        ON employee.role_id = role.id
    LEFT JOIN department
        ON department.id = role.department_id
    LEFT JOIN employee manager
        ON manager.id = employee.manager_id`;
    
    db.query(query, (err, res) => {
        if(err) throw err;
        console.table(res)
        options();
    });
}

// function addEmployee() {

// }

// function updateEmployeeRole() {

// }

function viewAllRoles() {
    let query = `SELECT 
    role.id,
    role.title,
    role.salary,
    department.name AS department
 FROM role LEFT JOIN department 
 ON department.id = role.department_id;`
 db.query(query, (err, res) => {
    if(err) throw err;
    console.table(res)
    options();
});
}

// function addRole() {

// }

function viewAllDepartments() {
    let query = `SELECT 
    department.id,
    department.name AS department
    FROM department;`
 db.query(query, (err, res) => {
    if(err) throw err;
    console.table(res)
    options();
});
}

function addDepartment() {
    inquirer
        .prompt({
            type: 'input',
            name: 'newDepartment',
            message: 'What is the name of the department?'
        })
        .then((res) => {
            let query = `INSERT INTO department SET ?`
            db.query(query, {name: res.newDepartment}, (err, res) => {
                if(err) throw err;
                options();
            });
        });
}










