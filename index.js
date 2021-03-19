const inquirer = require('inquirer');
const mysql = require('mysql');
const cTable = require('console.table');


const connection = mysql.createConnection({
    host: 'localhost',
  
    // Your port; if not 3306
    port: 3306,
  
    // Your username
    user: 'root',
  
    // Be sure to update with your own MySQL password!
    password: '',
    database: 'employees_db',
  });

connection.connect((err) => {
if (err) throw err;
inquirerSearch();
});
  

const inquirerSearch = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
              'View all employees',
              'View all employees by role',
              'View all employees by department',
              'Add a new department',
              'Add a new role',
              'Add new employee',
              'Update Employee Role',
              'Delete an employee',
              'End Program'
            ],
        })
        .then((answer) => {
            switch (answer.action){
                case 'View all employees':
                    employeeIDsearch()
                    break;
                case 'View all employees by role':
                    roleIDsearch()
                    break
                case 'View all employees by department':
                    departmentIDsearch()
                    break
                case 'Add a new department':
                    addDepartment()
                    break
                case 'Add a new role':
                    addRole()
                    break
                case 'Add new employee':
                    addEmployee()
                    break
                case 'Update Employee Role':
                    updateRole()
                    break
                case 'Delete an employee':
                    deleteEmployee()
                    break
                case 'End Program':
                    connectionEnd()
                    break
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        })
}

const connectionEnd = () =>{
    console.log("Thank you for using the program")
    connection.end();
}

const employeeIDsearch = () => {
    const query = 'SELECT * FROM employee';
      connection.query(query, (err, res) => {
        console.table(res)
        inquirerSearch()
        });
}
const employeeNameSearch = (callback) => {
    const query = 'SELECT * FROM employee';
      connection.query(query, (err, res) => {
        callback(res)
        });
}

const roleSearch = (callback) => {
    const query = 'SELECT * FROM role';
      connection.query(query, (err, res) => {
        callback(res)
        });
}

const roleIDsearch = () => {
    inquirer
        .prompt({
            name: 'role',
            type: 'input',
            message: 'What role would you like to search for? (enter role id number)',
        })
        .then((answer) => {
            console.log("role id search")
            const query = 'SELECT * FROM employee WHERE ?';
            connection.query(query, { role_id: answer.role }, (err, res) => {
            console.table(res)
            inquirerSearch()
        });
    })
}

const departmentIDsearch = () => {
    inquirer
        .prompt({
            name: 'department',
            type: 'input',
            message: 'What department would you like to search for? (enter department id number)',
        })
        .then((answer) => {
            console.log("department id search")
            // empty array to be filled with all possible role Id's in the department
            const roles = []
            // begin running department query to find roles
            const query1 = 'SELECT * FROM role WHERE ?';
            connection.query(query1, { department_id: answer.department }, (err, res) => {
                // pulls all role_ids from the department chosen
                for(i=0;i<res.length;i++){
                    roles.push(res[i].role_id)
                }
                // begin running query for selecting all employees
                const query2 = 'SELECT * FROM employee WHERE ?';
                const depEmployee = []
                var count = 0
                for(i=0;i<roles.length;i++){
                    connection.query(query2, { role_id: roles[i] }, (err, res) => {
                    // pulls all employees from the roles found
                    depEmployee.push(res[0])
                    count++
                    if(count==roles.length){
                        console.table(depEmployee)
                        inquirerSearch()
                    }
                })

            }
            });
        })
}

const addDepartment = () => {
    inquirer
        .prompt(
            {
            name: 'depName',
            type: 'input',
            message: 'What is the name of the department you would like to add?',
            },
        )
        .then((answer) => {
            connection.query('INSERT INTO department SET ?',
                {
                name: answer.depName,
                },
                (err) => {
                    if (err) throw err;
                    console.log('Your department was created successfully!');
                    inquirerSearch()
                  }
            )
        })
}

const addRole = () => {
    inquirer
    .prompt([
        {
        name: 'roleName',
        type: 'input',
        message: 'What is the title of the Role you would like to add?'
        },
        {
        name: 'salary',
        type: 'input',
        message: 'What is the salary ($/hr) of the Role you would like to add?'
        },
        {
        name: 'departmentID',
        type: 'input',
        message: 'What is the ID of the department the role is under?'
        }
    ]
    )
    .then((answer) => {
        connection.query('INSERT INTO role SET ?',
            {
            title: answer.roleName,
            salary: answer.salary,
            department_id: answer.departmentID
            },
            (err) => {
                if (err) throw err;
                console.log('Your role was created successfully!');
                inquirerSearch()
              }
        )
    })
}

const addEmployee = () => {
    inquirer
    .prompt([
        {
        name: 'firstName',
        type: 'input',
        message: 'What is the first name of the Employee you would like to add?'
        },
        {
        name: 'lastName',
        type: 'input',
        message: 'What is the last name of the Employee you would like to add?'
        },
        {
        name: 'roleID',
        type: 'input',
        message: 'What is the ID of the role the employee will be?'
        }
    ]
    )
    .then((answer) => {
        connection.query('INSERT INTO employee SET ?',
            {
            first_name: answer.firstName,
            last_name: answer.lastName,
            role_id: answer.roleID,
            },
            (err) => {
                if (err) throw err;
                console.log('Your role was created successfully!');
                inquirerSearch()
              }
        )
    })
}

function deleteEmployeeQuery(search)
{
    const query = `DELETE FROM employee WHERE ?`
    connection.query(query, {employee_id: search}, (err, res) =>
    {
        console.log(`The chosen employee has been removed.`);
        inquirerSearch()
    });
}

async function deletePrompt(employees)
{
    let answers = await inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee do you wish to remove?",
            choices: employees
        }
    ]);
    return answers;
}
function deleteEmployee()
{
    employeeNameSearch(async result =>
    {
        let chosenEmployee = await deletePrompt(result.map(data => `${data.first_name} ${data.last_name}`));
        result.forEach(data =>
        {
            let splitName = chosenEmployee.employee.split(" ");
            if (data.first_name == splitName[0] && data.last_name == splitName[1])
                search=data.employee_id
        });
        deleteEmployeeQuery(search);
    });
}
    
function updateRoleQuery(employee_id, role_id)
{
    const query = `UPDATE employee
    SET role_id = ?
    WHERE employee_id = ?;`
    connection.query(query, [role_id, employee_id], (err, res) =>
    {
        console.log(`The chosen employee role has been updated.`);
        inquirerSearch()
    });
}

async function updatePrompt(employees, role)
    {
        let answers = await inquirer.prompt([
            {
                type: "list",
                name: "employee",
                message: "Which employee do you wish to update their role?",
                choices: employees
            },
            {
                type: "list",
                name: "role",
                message: "Enter the role_id you wish to change the employee to",
                choices: role
            }
        ]);
        return answers;
    }

function updateRole()
{
    employeeNameSearch(async employees =>
    {
        roleSearch(async role =>
        {
            let answers = await updatePrompt(employees.map(data => `${data.first_name} ${data.last_name}`), role.map(data => data.title));
            let role_id = role.find(data => data.title === answers.role).role_id
            let employee_id;
            employees.forEach(data =>
            {
                let names = answers.employee.split(" ");
                if (data.first_name == names[0] && data.last_name == names[1])
                    employee_id = data.employee_id;
            });
            updateRoleQuery(employee_id, role_id);
        });
    });
}