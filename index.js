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
                "View All Roles",
                "View All Departments",
                "Add Employee",
                "Add Role",
                "Add Department",
                "Update Employee Role",
                "Total Utilized Budget",
                "Quit"
            ]
        })
        .then((res) => { 
            switch(res.userChoice) {
                case 'View All Employees':
                    viewEmployees();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Employee Role':
                    updateEmployeeRoleQuery();
                    break;
                case 'Total Utilized Budget':
                    totalUtilizedBudget();
                    break;
                case 'Quit':
                    db.end();
                    break;
            }
        }).catch((err) => {
            if(err)throw err;
        });
}

//Views all employees
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
};

//Adds a new employee
function addEmployee() {
    let query = 
    `SELECT 
    role.id, 
    role.title 
    FROM role`;
    db.query(query, (err, res) => {
        if (err) throw err;
        const roles = res.map (({ id, title }) => ({ name: title,  value: id}));
        addEmployeeRole(roles)
    })
};
function addEmployeeRole(roles) {
    inquirer
    .prompt([
        {
            type: 'input',
            name: 'fName',
            message: "What is the employee's first name?"
        },
        {
            type: 'input',
            name: 'lName',
            message: "What is the employee's last name?"
        },
        {
            type: 'list',
            name: 'role',
            message: "What is the employee's role?",
            choices: roles
        },
        {
            type: 'list',
            name: 'managerId',
            message: "What's the employee manager's id?",
            choices: [1, 3, 5, 7]
        }
    ])
    .then((res) => {
        db.query(`INSERT INTO employee SET ?`,
        {
            first_name: res.fName,
            last_name: res.lName,
            role_id: res.role,
            manager_id: res.managerId
        }, 
        (err) => {
            if(err) throw err;
            console.log('Employee added into the database!')
            options();
        });
    });
};

//Updates an employee role
function updateEmployeeRoleQuery() {
    let employeeQuery = 
    `SELECT
    employee.first_name,
    employee.last_name,
    employee.id
    FROM employee`;
    db.query(employeeQuery, (err, res) => {
        if (err) throw err;
        const employees = res.map(({first_name, last_name, id}) => 
        ({name: first_name + " " + last_name, value: id }))
    
    let roleQuery = 
    `SELECT
    role.id,
    role.title
    FROM role`;
    db.query(roleQuery, (err, res) => {
        if (err) throw err;
        const roles = res.map(({id, title}) => ({ name: title, value: id}));
        updateEmployeeRole(employees, roles)
    })
 })
};
function updateEmployeeRole(employees, roles) {
    inquirer
    .prompt([
        {
            type: 'list',
            name: 'employee',
            message: "Which employee's role do you want to update?",
            choices: employees
        },
        {
            type: 'list',
            name: 'newRole',
            message: 'Which role do you want to assign the selected employee?',
            choices: roles
        }
    ])
    .then((res) => {
        db.query(`UPDATE employee SET ? WHERE ?`, 
        [
            {
                role_id: res.newRole,
            },
            {
                id: res.employee,
            }
        ], function (err) {
            if(err) throw err;
        });
        console.log('Employee role has been updated');
        options()
    });
};

//View all roles
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
};

//Add a new role
function addRole() {
    inquirer
    .prompt([{
        type: 'input',
        name: 'newRole',
        message: 'What is the name of the role?'
    }, 
    {
        type: 'input',
        name: 'salary',
        message: 'Role Salary: '
    }
    ])
    .then((res) => {
        const params = [res.newRole, res.salary];
        let query = `SELECT name, id FROM department;`;
        
        db.query(query, (err, res) => {
            if(err) throw err
            const department = res.map(({ name, id}) => ({ name: name, value: id }));
            
            inquirer.prompt([
             {
                type: 'list',
                name: 'dept',
                message: 'What department is the role in? ',
                choices: department
             }
            ])
             .then(deptRes => {
                const dept = deptRes.dept;
                params.push(dept);

                const insertQuery = `INSERT INTO role (title, salary, department_id) VALUE (?, ?, ?)`;
                db.query(insertQuery, params, (err, result) => {
                    if (err) throw err;
                    console.log('Added new employee role!')
                    options();
                });
            });
        });
        
    });
};

//View all departments
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
};

//Add department
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
                if(err) {
                    throw err
                } else {
                    console.log(`Added new department into the database`)
                }
                options();
            });
        });
};

//Total budget utilized by each department
function totalUtilizedBudget() {
    let query = `SELECT 
    department_id AS id,
    department.name AS department,
    SUM(salary) AS budget
    FROM role
    JOIN department ON role.department_id = department.id GROUP BY department_id`;
    db.query(query, (err, res) => {
        if(err) throw err;
        console.table(res)
        options();
    });
}










