const inquirer = require('inquirer');
const mysql = require('mysql');
const sequelize = require('./config/connection');
const cTable = require('console.table');

// sequelize.sync().then(() => {
//     console.log('Now listening')
//     inquirerSearch()
//   });

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
              'View all employees by department'
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
                default:
                    console.log(`Invalid action: ${answer.action}`);
                    break;
            }
        })
}

const employeeIDsearch = () => {
    console.log("employee id search")
    const query = 'SELECT * FROM employee';
      connection.query(query, (err, res) => {
        console.table(res)
        });
}

const roleIDsearch = () => {
    inquirer
        .prompt({
            name: 'role',
            type: 'input',
            message: 'What role would you like to search for?',
        })
        .then((answer) => {
            console.log("role id search")
            const query = 'SELECT * FROM employee WHERE ?';
            connection.query(query, { role_id: answer.role }, (err, res) => {
            console.table(res)
        });
    })
}

const departmentIDsearch = () => {
    inquirer
        .prompt({
            name: 'department',
            type: 'input',
            message: 'What department would you like to search for?',
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
                    }
                })

            }
            });
        })
}