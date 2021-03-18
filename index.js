const inquirer = require('inquirer');
const mysql = require('mysql');
const sequelize = require('./config/connection');

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
              'View all employees by role'
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
        console.log(res)
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
            console.log(res)
        });
        })
    }