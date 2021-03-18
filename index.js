const inquirer = require('inquirer');
const mysql = require('mysql');
const sequelize = require('./config/connection');

sequelize.sync().then(() => {
    console.log('Now listening')
    inquirerSearch()
  });

const inquirerSearch = () => {
    inquirer
        .prompt({
            name: 'action',
            type: 'rawlist',
            message: 'What would you like to do?',
            choices: [
              'Find employee by id',
              'Find role by id'
            ],
        })
        .then((answer) => {
            switch (answer.action){
                case 'Find employee by id':
                    employeeIDsearch()
                    break;
                case 'Find role by id':
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
}

const roleIDsearch = () => {
    console.log("role id search")
}