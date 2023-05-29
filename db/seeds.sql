INSERT INTO department (name)
VALUES ("Sales"),
       ("Engineering"),
       ("Finance"),
       ("Legal");

INSERT INTO role(title, department_id, salary)
VALUES 
("Sales Lead", 1, 100,000),
("Salesperson", 1, 80,000),
("Lead Engineer", 2, 150,000),
("Software Engineer", 2, 120,000),
("Account Manager", 3, 160,000),
("Accountant", 3, 125,000),
("Legal Team Lead", 4, 250,000),
("Lawyer", 4, 190,000);

INSERT INTO employee(first_name, last_name, role_id, manager_id)
VALUES
("John", "Doe", 1),
("Mike", "Chan", 2, 1),
("Ashley", "Rodriguez", 3),
("Kevin", "Tupik", 4, 3),
("Kunal", "Singh", 5),
("Malia", "Brown", 6, 5),
("Sarah", "Lourd", 7),
("Tom", "Allen", 8, 7);
       
