INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role (title, department_id, salary)
VALUES 
("Sales Lead", 1, 100000),
("Salesperson", 1, 80000),
("Lead Engineer", 2, 150000),
("Software Engineer", 2, 120000),
("Account Manager", 3, 160000),
("Accountant", 3, 125000),
("Legal Team Lead", 4, 250000),
("Lawyer", 4, 190000);

INSERT INTO employee(first_name, last_name, role_id)
VALUES
("John", "Doe", 1),
("Mike", "Chan", 2),
("Ashley", "Rodriguez", 3),
("Kevin", "Tupik", 4),
("Kunal", "Singh", 5),
("Malia", "Brown", 6),
("Sarah", "Lourd", 7),
("Tom", "Allen", 8);
       
