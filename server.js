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

// Working Successfully
function viewAllEmployees(){
    connection.query('select * from employees;', (err, res) => {
        if(err){
            throw new Error(err)
        }
        console.table(res);
        init();
    })
};

// Working Successfully
function viewAllEmployeesByDepartment(){
    let allDepartmentNames = [];
    connection.query('select * from departments;', async (err, res) => {
        res.forEach((department) => {
            allDepartmentNames.push(department.name);
        });

        let response = await inquirer.prompt({
            name: 'selectedDepartment',
            type: 'list',
            message: 'From what department would you like to view the employees of?',
            choices: allDepartmentNames
        })

        connection.query('select first_name, last_name from employees e join roles r on e.role_id = r.id join departments d on r.department_id = d.id where d.name = ?', [response.selectedDepartment], (err, res) => {
            if(err){
                throw new Error(err)
            }
            console.table(res);
            init();
        })
    });
};

// Working Successfully
function viewAllEmployeesByManager(){
    // Get all employees 
        // If they have no manager_id, push into some array; if an employee has a manager_id, save that id to a separate array
    let allManagerNames = [];
    let managerID;
    connection.query('select * from employees where manager_id is null or manager_id = ""', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((manager) => {
            allManagerNames.push(`${manager.first_name} ${manager.last_name}`);
        })

        let response = await inquirer.prompt([
            {
                name: 'managedBy',
                type: 'list',
                message: 'Which manager would you like to see the employees of?',
                choices: allManagerNames
            }
        ])

        res.forEach((manager) => {
            if(`${manager.first_name} ${manager.last_name}` === response.managedBy){
                managerID = manager.id;
            }
        })

        connection.query('select * from employees where ?', {manager_id: managerID}, (err, res) => {
            if(err){
                throw new Error(err)
            } 
            console.table(res);
            init();
        })
    });
};

// Working Successfully
function addEmployee(){
    // Get list of all managers in the DB, push them to an array with their names displayed, use this array in inquirer below
    let allManagerNames = [];
    let allRoles;
    let allRoleTitles = [];
    let roleID;
    let managerID;
    connection.query('select * from roles', (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((role) => {
            allRoleTitles.push(role.title)
        })
        allRoles = res;
    })
    connection.query('select * from employees where manager_id is null or manager_id = ""', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((manager) => {
            allManagerNames.push(`${manager.first_name} ${manager.last_name}`);
        })
        allManagerNames.push('This person is a manager')

        let response = await inquirer.prompt([
            {
                name: 'firstName',
                type: 'input',
                message: 'What is the new employees first name?'
            },
            {
                name: 'lastName',
                type: 'input',
                message: 'What is the employees last name?'
            },
            {
                name: 'managedBy',
                type: 'list',
                message: 'Is this person managed by anyone in the following?',
                choices: allManagerNames
            },
            {
                name: 'employeeRole',
                type: 'list',
                message: 'What is this employees role?',
                choices: allRoleTitles
            }
        ])

        allRoles.forEach((role) => {
            if(role.title === response.employeeRole){
                roleID = role.id
            }
        })

        response.firstName = response.firstName.charAt(0).toUpperCase() + response.firstName.slice(1);
        response.lastName = response.lastName.charAt(0).toUpperCase() + response.lastName.slice(1);

        if(response.managedBy === 'This person is a manager'){
            connection.query('insert into employees set ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: roleID
            }, (err, res) => {
                if(err){
                    throw new Error(err)
                }
                console.log(`Successfully added ${response.firstName} ${response.lastName} to the roster!`)
            })
        } else {
            res.forEach((manager) => {
                if(`${manager.first_name} ${manager.last_name}` === response.managedBy){
                    managerID = manager.id;
                }
            })
            connection.query('insert into employees set ?', {
                first_name: response.firstName,
                last_name: response.lastName,
                role_id: roleID,
                manager_id: managerID
            }, (err, res) => {
                if(err){
                    throw new Error(err)
                }
                console.log(`Successfully added ${response.firstName} ${response.lastName} to the roster!`)
            })
        }
        init();
    })

};

// Working Successfully
function removeEmployee(){
    // Select which department the employee works
    let allDepartments;
    let allDepartmentNames = [];
    connection.query('select * from departments;', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((department) => {allDepartmentNames.push(department.name)})

        let response = await inquirer.prompt([
            {
                name: 'selectedDepartment',
                type: 'list',
                message: 'What department does the employee work in?',
                choices: allDepartmentNames
            }
        ])

        connection.query('select first_name, last_name from employees e join roles r on e.role_id = r.id join departments d on r.department_id = d.id where d.name = ?', [response.selectedDepartment], async (err, res) => {
            if(err){
                throw new Error(err)
            }
            let allEmployees = [];
            res.forEach((employee) => {
                allEmployees.push(`${employee.first_name} ${employee.last_name}`)
            });
            console.log(allEmployees);

            let deleteEmployee = await inquirer.prompt([
                {
                    name: 'employeeToDelete',
                    type: 'list',
                    message: 'Please select the employee you wish to remove.',
                    choices: allEmployees
                }
            ])

            let selectedEmployee = deleteEmployee.employeeToDelete.split(" ");
            console.log(selectedEmployee);
            connection.query('delete from employees where first_name = ? and last_name = ?', [
                selectedEmployee[0],
                selectedEmployee[1]
            ], (err, res) => {
                if(err){
                    throw new Error(err)
                }
                console.log('Successfully removed employee.');
                init();
            })
        })
    })
};

// Working Successfully
function updateEmployeeRole(){
    let allRoles; 
    let allRoleTitles =[];
    let roleID;
    let allEmployeeNames = [];
    let allEmployees;

    connection.query('select * from roles', (err, res) => {
        if(err){
            throw new Error(err);
        }
        res.forEach((role) => {allRoleTitles.push(role.title)})
        allRoles = res;
    })

    connection.query('select * from employees', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((employee) => {allEmployeeNames.push(`${employee.first_name} ${employee.last_name}`)})
        allEmployees = res;

        let response = await inquirer.prompt([
            {
                name: 'employeeToChange',
                type: 'list',
                message: 'Please select the employee whose role will be changed.',
                choices: allEmployeeNames
            },
            {
                name: 'newRole',
                type: 'list',
                message: 'What will be the newly assigned role?',
                choices: allRoleTitles
            }
        ])

        allRoles.forEach((role) => {
            if(role.title === response.newRole){
                roleID = role.id;
            }
        })

        let employeeFullName = response.employeeToChange.split(" ");
        connection.query('update employees set ? where first_name = ? and last_name = ?', [
            {
                role_id: roleID
            },
            [
                employeeFullName[0]
            ],
            [
                employeeFullName[1]
            ]
        ],(err, res) => {
            if(err){
                throw new Error(err)
            }
            console.log(`Successfully updated role for ${response.employeetoChange}, ${response.newRole}.`);
            init();
        })
    })
};

// Working Successfully
function updateEmployeeManager(){
    let allManagerNames = [];
    let managerID;
    let allEmployeeNames = [];
    let allEmployees;
    connection.query('select * from employees where manager_id is not null', (err, res) => {
        allEmployees = res;
        res.forEach((employee) => {allEmployeeNames.push(`${employee.first_name} ${employee.last_name}`)});
    })

    connection.query('select * from employees where manager_id is null or manager_id = ""', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((manager) => {
            allManagerNames.push(`${manager.first_name} ${manager.last_name}`);
        })

        let response = await inquirer.prompt([
            {
                name: 'changeManagerFor',
                type: 'list',
                message: 'Which employee will be under new management?',
                choices: allEmployeeNames
            },
            {
                name: 'newManager',
                type: 'list',
                message: 'Who will be their new manager?',
                choices: allManagerNames
            }
        ])

        let employeeName = response.changeManagerFor.split(" ");
        res.forEach((manager) => {
            if(`${manager.first_name} ${manager.last_name}` === response.newManager){
                managerID = manager.id;
            }
        })

        connection.query('update employees set ? where first_name = ? and last_name = ?', [
            {
                manager_id: managerID
            }, 
            [
                employeeName[0]
            ],
            [
                employeeName[1]
            ]
        ], (err, res) => {
            if(err){
                throw new Error(err)
            } 
            console.log('Successfully changed manager!');
            init();
        })
    });
};
//--------------------------------------------------------------------------------
// The following functions pertain to viewing/creating/deleting information specifically about existing and new roles

// Working Successfully
function viewAllRoles(){
    connection.query('select * from roles;', (err, res) => {
        if(err){
            throw new Error(err);
        }
        console.table(res);
        init();
    });
};

// Working Successfully
function addRole(){
    let allDepartmentNames = [];
    let departmentID;
    connection.query('select * from departments', async (err, res)=> {
        if(err){
            throw new Error(err)
        }
        res.forEach((department) => {
            allDepartmentNames.push(department.name);
        })

        let response = await inquirer.prompt([
            {
                name: 'roleTitle',
                type: 'input',
                message: 'What is the new role\'s title?'
            },
            {
                name: 'roleSalary',
                type: 'input',
                message: 'What is the yearly salary for this role?',
                validate(value){
                    if(isNaN(value) === false){
                        return true;
                    }
                    return false
                }
            },
            {
                name: 'rolesDepartment',
                type: 'list',
                message: 'To which department does this role belong to?',
                choices: allDepartmentNames
            }
        ])
    
        res.forEach((department) => {
            if(department.name === response.rolesDepartment){
                departmentID = department.id;
            }
        })
        response.roleTitle = response.roleTitle.charAt(0).toUpperCase() + response.roleTitle.slice(1);
    
        connection.query('insert into roles set ?', {
            title: response.roleTitle,
            salary: response.roleSalary,
            department_id: departmentID
        }, 
        (err, res) => {
            if(err){
                throw new Error(err)
            }
            console.table(res)
            init();
        })
    })
};

// Working Successfully
function removeRole(){
    let allRoleTitles = [];
    connection.query('select * from roles', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((role) => {
            allRoleTitles.push(role.title);
        })

        let response = await inquirer.prompt([
            {
                name: 'deleteRole',
                type: 'list',
                message: 'Which role would you like to remove?',
                choices: allRoleTitles
            }
        ])

        res.forEach((role) => {
            if(role.title === response.deleteRole){
                connection.query('delete from roles where ?', {
                    id: role.id
                }, 
                (err,res) => {
                    if(err){
                        throw new Error(err)
                    }
                    console.log(`Successfully removed ${response.deletedRole}.`)
                })
            }
        })
        init();
    })
};
//--------------------------------------------------------------------------------
// The following functions pertain to departments and the viewing/creation/deletion of them

// Works Successfully
function viewAllDepartments(){
    connection.query('select * from departments;', (err, res) => {
        if(err){
            throw new Error(err)
        }
        console.table(res);
        init();
    })
};

// Works Successsfully
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

// Working Successfully
    // Would return an error if attempting to delete a department if its ID was already in use as a role's deparment_id
function removeDepartment(){
    let allDepartments = [];
    connection.query('select * from departments', async (err, res) => {
        if(err){
            throw new Error(err)
        }
        res.forEach((department) => {
            allDepartments.push(department);
        })

        let response = await inquirer.prompt([
            {
                name: 'deleteDepartment',
                type: 'list',
                message: 'Which department would you like to remove?',
                choices: allDepartments
            }
        ])
        allDepartments.forEach((department) => {
            if(department.name === response.deleteDepartment){
                connection.query('delete from departments where ?', {
                    id: department.id
                }, 
                (err,res) => {
                    if(err){
                        throw new Error(err)
                    }
                    console.log(`Successfully removed ${response.deletedDepartment}.`)
                })
            }
        })
        init();
    })
};
