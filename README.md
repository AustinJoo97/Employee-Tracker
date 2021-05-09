# Employee Tracker ![License](https://img.shields.io/badge/License-ISC-blue.svg)
Command-line application allowing users to manage teams including, managers and employees, that are saved in a sql database

## Deployed Site Link 

N/a

## Table of Contents

- [Description, Setup, and Installation](#description-setup-and-installation)
- [Usage](#usage)
- [Technologies Used](#technologies-used)
- [Full License Information](#license-information)
- [Conrtibutors](#contributors)
- [Testing Performed](#testing-performed)
- [Questions](#questions)


## Description, Setup, and Installation

This program is a command-line application that allows users to create, store, and update information regarding a company/establishment in a sql database. The program itself will use multiple npm packages, including inquirer and mysql, to gather user information from a series of questions to generate multiple queries to send to the database. The program itself interacts with three separate tables exist within the database involved; these tables are departments, roles, and employees. These tables are all linked through foreign keys, some of which will reference other values within the same table, indicating information such as managerial roles, roles belonging to certain departments, and which roles certain employees belong to.

As for setup and installation, there is a package.json that comes with the application itself. To user the application, simply run "npm i" to install all the required dependencies as well as running "mysql -u root (-p if a password is required) < schema.sql" to generate the database and tables necessary for this program to function. Finally, at the server.js file, input the required credentials to access the database and then this application can and will function as shown in the demo below.

## Usage

As stated, this program is good for managing crucial role information regarding a team/company. It will allow users to enter new departments, roles, and employee information as well updating and deleting previously existing information. The setup and installation process is described above and will provide a simple and intuitive way to access the data that has been stored. Finally, all information shown to the user will be organized through the use of the npm package "console.table," which will organize returned data as a table.

## Technologies Used
- JavaScript
- Node.JS
- Express.JS

NPM
- mysql
- inquirer
- console.table
- dotenv

## License Information
![License](https://img.shields.io/badge/License-ISC-blue.svg)

[License Link](https://opensource.org/licenses/ISC)

## Contributors
- Austin Joo

## Questions
Please contact me with any questions, comments, or concerns regarding this repo or if you would like to be a fellow contributor to this project!
- GitHub: AustinJoo97 
- Email: austinjoo1997@gmail.com
## Demonstration
https://vimeo.com/546939923
