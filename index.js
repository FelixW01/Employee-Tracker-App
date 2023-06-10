const inquirer = require('inquirer');
const db = require('./connection.js');

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
                case 'View All Employees';
                    viewEmployees();
                    break;
                case 'Add Employee';
                    //add employee func
                    break;
                case 'Update Employee Role';
                    //update employee role func
                    break;
                case 'View All Roles';
                    //view all roles func
                    break;
                case 'Add Role';
                    //add role func
                    break;
                case 'View All departments';
                    //View all Dept func
                    break;
                case 'Add Department';
                    //Add dept func
                    break;
                case 'Quit';
                    //Quit func
                    break;
                case 'View All Employees';
                    //View all Employees func
                    break;
            }
        }).catch((err) => {
            if(err)throw err;
        });
}

function viewEmployees() {
    let query =`SELECT 
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
    
    connection.query(query, (err, res) => {
        if(err) throw err;
        console.table(res)
    })
}
//switch statement for the different screnarios










