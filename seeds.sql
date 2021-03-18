Insert into department(name)
values ("Management");
Insert into department(name)
values ("Development");

Insert into role(title, salary, department_id)
values ("Front-End Dev",35,2);
Insert into role(title, salary, department_id)
values ("Back-End Dev",42,2);
Insert into role(title, salary, department_id)
values ("Dev Manager",50,1);

Insert into employee(first_name, last_name, role_id)
values ("Manage","Er",3);
Insert into employee(first_name, last_name, role_id, manager_id)
values ("Employ","Ee",2,1);
Insert into employee(first_name, last_name, role_id, manager_id)
values ("Fronty","Devash",1,1);
