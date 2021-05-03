const mysql = require('mysql');
const inquirer = require('inquirer');
const {password} = require('./password.js')
const allOptions = ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'View all roles', 'Add role', 'Remove role', 'View all departments', 'Add department', 'Remove department'];

const connection = mysql.createConnection({
    host: 'localhost',
    port: 3306,
    user: 'root',
    password: password,
    database: 'employeeTrackerDB'
})

// open a connection(){
    // run first inquirer function
// }
connection.connect((err) => {
    if(err){
        throw new Error(err)
    }
    console.log(`Successfully connected at ${connection.threadId}!`);
    init();
})

