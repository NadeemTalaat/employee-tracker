const inquirer = require("inquirer");

const express = require("express");
// Import and require mysql2
const mysql = require("mysql2");

const PORT = process.env.PORT || 3001;
const app = express();

const cTable = require("console.table");

// Express middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// Connect to database
const db = mysql.createConnection(
  {
    host: "127.0.0.1",
    // MySQL username,
    user: "root",
    // MySQL password
    password: "",
    database: "company_db",
  },
  console.log(`Connected to the company_db database.`)
);

// Default response for any other request (Not Found)
app.use((req, res) => {
  res.status(404).end();
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

const promptChoices = [
  "View all departments",
  "View all roles",
  "View all employees",
  "Add a department",
  "Add a role",
  "Add an employee",
  "Update an employee role",
];

const userPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "userPrompt",
      choices: promptChoices,
    })
    .then((answer) => {
      switch (answer.userPrompt) {
        // View all Departments
        case promptChoices[0]:
          console.log("View All Departments");

          db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.table(result);
          });
          break;

        // View All Roles
        case promptChoices[1]:
          db.query(
            `SELECT role.id, role.title, department.name AS department, role.salary
            FROM role
            JOIN department ON role.department_id = department.id;`,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.table(result);
            }
          );
          break;

        //View all employees
        case promptChoices[2]:
          console.log("View All Employees");

          // db.query(`SELECT * FROM employee`, (err, result) => {
          //   if (err) {
          //     console.log(err);
          //   }
          //   console.table(result);
          // });

          db.query(
            `SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary, employee.manager_id
            FROM employee
            JOIN role ON employee.role_id = role.id
            JOIN department ON role.department_id = department.id; `,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.table(result);
            }
          );

          break;

        //Add a department
        case promptChoices[3]:
          console.log("Add a department");

          inquirer
            .prompt({
              type: "input",
              message: "What is the department name?",
              name: "name",
            })
            .then((answer) => {
              console.log(answer);
              db.query(
                `INSERT INTO department (name) VALUES("${answer.name}")`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }

                  db.query(`SELECT * FROM department`, (err, result) => {
                    if (err) {
                      console.log(err);
                    }
                    console.table(result);
                  });
                }
              );
            });
          break;

        // Add a role
        case promptChoices[4]:
          console.log("Add a role");

          db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
              console.log(err);
            }

            const departmentNames = result.map((obj) => obj.name);

            inquirer
              .prompt([
                {
                  type: "input",
                  message: "What is the name of the role?",
                  name: "name",
                },
                {
                  type: "input",
                  message: "What is the salary of the role?",
                  name: "salary",
                },
                {
                  type: "list",
                  message: "What department does the role belong to?",
                  name: "department",
                  choices: departmentNames,
                },
              ])
              .then((answer) => {
                const departmentID =
                  departmentNames.findIndex((obj) => obj == answer.department) +
                  1;

                db.query(
                  `INSERT INTO role (title, department_id, salary) VALUES ("${answer.name}", ${departmentID}, ${answer.salary})`,
                  (err, result) => {
                    if (err) {
                      console.log(err);
                    }

                    db.query(`SELECT * FROM role`, (err, result) => {
                      if (err) {
                        console.log(err);
                      }
                      console.table(result);
                    });
                  }
                );
              });
          });

          break;

        //Add an employee
        case promptChoices[5]:
          console.log("Add an employee");
          break;

        // Update an employee role
        case promptChoices[6]:
          console.log("Update an employee role");
          break;

        default:
          userPrompt();
          break;
      }
    });
};

userPrompt();
