DROP DATABASE IF EXISTS employees_db;
CREATE DATABASE employees_db;

use employees_db;

create table department(
department_id int not null auto_increment,
name varchar(30) not null,
primary key(department_id)
);

Create table role(
role_id int NOT NULL auto_increment,
salary decimal NOT NULL,
department_id int,
primary key(role_id),
foreign key (department_id) references department(department_id)
);

Create table employee(
employee_id int NOT NULL auto_increment,
first_name varchar(30) NOT NULL,
last_name varchar(30) NOT NULL,
role_id int,
manager_id int,
primary key (employee_id),
foreign key (role_id) references role(role_id),
foreign key (manager_id) references employee(employee_id)
);

