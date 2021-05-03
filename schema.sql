drop database if exists employeeTrackerDB;

create database employeeTrackerDB;

use employeeTracker;

drop table if exists departments;
drop table if exists roles;
drop table if exists employees;
drop table if exists managers;

create table departments(
    id int identity(1, 1) primary key,
    name varchar(30) not null
);

create table roles(
    id int identity(1,1) primary key,
    title varchar(30) not null,
    salary decimal(10,2) default 0.00,
    departmentID int,
    foreign key (departmentID) references departments(id)
);
-- id, title, salary, and department
-- use "WHERE departmentID = departments.id"  ???

create table employees(
    id int identity(1,1) primary key,
    firstName varchar(30) not null,
    lastName varchar(30) not null,
    managerID int,
    foreign key (roleID) references roles(roleID),
    foreign key (managerID) references managers(id)
);

create table managers(
    id int identity(1,2) primary key,
    firstName varchar(30) not null,
    lastName varchar(30) not null
);



insert into departments(name) values('HR');
insert into departments(name) values('Warehouse');
insert into departments(name) values('Reception');
insert into departments(name) values('Software')

insert into roles(title, salary, departmentID) values('engineer', 60000, 4);
insert into roles(title, salary, departmentID) values('project manager', 150000, 4);
insert into roles(title, salary, departmentID) values('engineer', 60000, 4);
