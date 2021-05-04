drop database if exists employee_tracker_db;

create database employee_tracker_db;

use employee_tracker_db;

drop table if exists departments;
drop table if exists roles;
drop table if exists employees;
drop table if exists managers;

create table departments(
    id int auto_increment,
    name varchar(30) not null,
    primary key(id)
);

create table roles(
    id int auto_increment,
    title varchar(30) not null,
    salary decimal(10,2) default 0.00,
    department_id int,
    primary key (id),
    foreign key (department_id) references departments(id)
);
-- id, title, salary, and department
-- use "WHERE departmentID = departments.id"  ???

create table employees(
    id int auto_increment,
    first_name varchar(30) not null,
    last_name varchar(30) not null,
    role_id int,
    manager_id int,
    primary key(id),
    foreign key (role_id) references roles(id),
    foreign key (manager_id) references employees(id)
);

-- if an employee has a manager, assign the manager's id to employee manager
-- if they do not have a manager, they will have a manager_id value of null

