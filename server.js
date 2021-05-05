const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');
const { connect } = require('http2');
require('dotenv').config()
const allChoices = ['View all employees', 'View all employees by department', 'View all employees by manager', 'Add employee', 'Remove employee', 'Update employee role', 'Update employee manager', 'View all roles', 'Add role', 'Remove role', 'View all departments', 'Add department', 'Remove department', 'Exit'];

const connection = mysql.createConnection({
    host: 'localhost',
    port: process.env.db_PORT,
    user: process.env.db_USER,
    password: process.env.db_PASSWORD,
    database: process.env.db_DATABASE
})

// open a connection
connection.connect((err) => {
    if(err){
        throw new Error(err)
    }
    console.log(`Successfully connected at ${connection.threadId}!`);
    init();
})

// first inquirer function(){
    // What would you like to do?
        // Inquirer list with allOption as choices
    // Based on require response, run a different function ()
    // If exit is selected, use connection.end()
// }
init = async () => {
    let response = await inquirer.prompt({
        name: 'whatToDo',
        type: 'list',
        message: 'What would you like to do?',
        choices: allChoices
    })
    
    switch(response.whatToDo){
        case 'View all employees':
            viewAllEmployees();
            break;
        case 'View all employees by department':
            viewAllEmployeesByDepartment();
            break;
        case 'View all employees by manager':
            viewAllEmployeesByManager();
            break;
        case 'Add employee':
            addEmployee();
            break;
        case 'Remove employee':
            removeEmployee();
            break;
        case 'Update employee role':
            updateEmployeeRole();
            break;
        case 'Update employee manager':
            updateEmployeeManager();
            break;
        case 'View all roles':
            viewAllRoles();
            break;
        case 'Add role':
            addRole();
            break;
        case 'Remove role':
            removeRole();
            break;
        case 'View all departments':
            viewAllDepartments();
            break;
        case 'Add department':
            addDepartment();
            break;
        case 'Remove department':
            removeDepartment()
            break;
        default:
            connection.end();
    }
}

//--------------------------------------------------------------------------------
// The following functions pertain specifically to employees and interaction with employee-relevant data

// View all employees
function viewAllEmployees(){
    connection.query('select * from employees;', (err, res) => {
        if(err){
            throw new Error(err)
        }
        console.table(res);
        init();
    })

};

// View all employees by department
    // Which department would you like to see employees for?
        // List
viewAllEmployeesByDepartment= async () => {
    // Get list of all departments and have user select from list which department they want to see all employees
    let allDepartmentNames = [];
    connection.query('select * from departments;', (err, res) => {
        res.forEach((department) => {
            allDepartmentNames.push(department.name);
        });

        let response = await inquirer.prompt({
            name: 'selectedDepartment',
            type: 'list',
            message: 'From what department would you like to view the employees of?',
            choices: allDepartmentNames
        })
            // Connection query to select all employees where employees.roleID > roles.departmentID > res.id = department.id
            
        connection.query('select first_name, last_name from employees e join roles r on e.role_id = r.id join departments d on r.department_id = d.id where d.name = ?', [response.selectedDepartment], (err, res) => {
            //  select first_name, last_name from employees e join roles r on e.role_id = r.id 
            // join departments d on r.department_id = d.id where d.name = ?
            if(err){
                throw new Error(err)
            }
            console.table(res);
            // init();
        })
    });
};

// View all employees by manager
    // Which manager's employees would you like to view?
        // List
function viewAllEmployeesByManager(){
    // Get all employees 
        // If they have no manager_id, push into some array; if an employee has a manager_id, save that id to a separate array

        // select * from employees e where e.manager_id is null
            // should only return list of managers
        
        // select first_name, last_name from employees e where e.manager_id = res.id;
};

// Add employee
    // Employee's first name?
    // Employee's last name?
    // Employee's manager?
        // List
function addEmployee(){
    // Get list of all managers in the DB, push them to an array with their names displayed, use this array in inquirer below

    // inquirer.prompt({
    //     name: 'firstName',
    //     type: 'input',
    //     message: 'What is the new employees first name?'
    // },
    // {
    //     name: 'lastName',
    //     type: 'input',
    //     message: 'What is the employees last name?'
    // },
    // {
    //     name: 'managedBy',
    //     // 
    // }
    // )
};

// Remove employee
    // Employee's first name?
    // Employee's last name?
    // Employee's manager?
        // List
function removeEmployee(){
    // Select which department the employee works
        // Select the employee roles
            // Select the employee
};

// Update employee role
function updateEmployeeRole(){

};

// Update employee manager
function updateEmployeeManager(){

};
//--------------------------------------------------------------------------------
// The following functions pertain to viewing/creating/deleting information specifically about existing and new roles

// View all roles
function viewAllRoles(){
    connection.query('select * from roles;', (err, res) => {
        if(err){
            throw new Error(err);
        }
        console.table(response);
        init();
    });
};

// Add role
    // What is the role's name?
    // What is the yearly salary for his role?
function addRole(){

};

// Remove role
    // What is the role's name?
        // List
function removeRole(){

};
//--------------------------------------------------------------------------------
// The following functions pertain to departments and the viewing/creation/deletion of them

// View all departments
function viewAllDepartments(){
    connection.query('select * from departments;', (err, res) => {
        if(err){
            throw new Error(err)
        }
        console.table(res);
        init();
    })
};

// Add department
    // What is the new department's name?
addDepartment = async () => {
    let response = await inquirer.prompt({
        name: 'addDepartment',
        type: 'input',
        message: 'What department are you adding?'
    })
    response.addDepartment = response.addDepartment.charAt(0).toUpperCase() + response.addDepartment.slice(1);
    connection.query('insert into departments set ?', {name: response.addDepartment}, (err, res) => {
        if(err){
            throw new Error(err)
        }
        console.log(`${response.addDepartment} successfully added to departments!`)
        init();
    })
};

// Remove department
    // What is the department's name?
function removeDepartment(){

};
