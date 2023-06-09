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
  "None",
];

const userPrompt = () => {
  inquirer
    .prompt({
      type: "list",
      name: "userPrompt",
      message: "What would you like to do?",
      choices: promptChoices,
    })
    .then(async (answer) => {
      const getRoles = () => {
        return new Promise((resolve, reject) => {
          db.query("SELECT * FROM role", (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const rolesMap = result.map((obj) => obj.title);
              resolve(rolesMap);
            }
          });
        });
      };

      const getEmployees = () => {
        return new Promise((resolve, reject) => {
          db.query("SELECT * FROM employee", (err, result) => {
            if (err) {
              console.log(err);
              reject(err);
            } else {
              const employeesMap = result.map(
                (employee) => `${employee.first_name} ${employee.last_name}`
              );
              resolve(employeesMap);
            }
          });
        });
      };

      const roles = await getRoles();
      const employees = await getEmployees();

      switch (answer.userPrompt) {
        // View all Departments
        case promptChoices[0]:
          console.log("View All Departments");

          db.query(`SELECT * FROM department`, (err, result) => {
            if (err) {
              console.log(err);
            }
            console.table(result);
            userPrompt();
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
              userPrompt();
            }
          );
          break;

        //View all employees
        case promptChoices[2]:
          console.log("View All Employees");

          db.query(
            `SELECT 
            employee.id AS EmployeeID,
            employee.first_name AS FirstName,
            employee.last_name AS LastName,
            role.title AS Title,
            department.name AS Department,
            CONCAT(manager.first_name, ' ', manager.last_name) AS Manager
        FROM 
            employee
            INNER JOIN role ON employee.role_id = role.id
            INNER JOIN department ON role.department_id = department.id
            LEFT JOIN employee AS manager ON employee.manager_id = manager.id; `,
            (err, result) => {
              if (err) {
                console.log(err);
              }
              console.table(result);
              userPrompt();
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
              db.query(
                `INSERT INTO department (name) VALUES("${answer.name}")`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }

                  console.log(
                    `${answer.name} has been added to the department lists!`
                  );
                  userPrompt();
                }
              );
            });
          break;

        // Add a role
        case promptChoices[4]:
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

                    console.log(`Added ${answer.name} to the database`);
                    userPrompt();
                  }
                );
              });
          });

          break;

        //Add an employee
        case promptChoices[5]:
          console.log("Add an employee");

          employees.push("None");

          inquirer
            .prompt([
              {
                type: "input",
                name: "firstName",
                message: "What is the employee's first name?",
              },
              {
                type: "input",
                name: "lastName",
                message: "What is the employee's last name?",
              },
              {
                type: "list",
                name: "role",
                message: "What is the employee's role?",
                choices: roles,
              },
              {
                type: "list",
                name: "manager",
                message: "Who is the employee's manager?",
                choices: employees,
              },
            ])
            .then((answer) => {
              const roleID = roles.findIndex((obj) => obj == answer.role) + 1;

              let employeeID = null;

              if (answer.manager !== "None") {
                employeeID =
                  employees.findIndex((obj) => obj == answer.manager) + 1;
              }

              db.query(
                `INSERT INTO employee(first_name, last_name, role_id, manager_id) VALUES ("${answer.firstName}", "${answer.lastName}", ${roleID}, ${employeeID})`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }

                  console.log(
                    `Added ${answer.firstName} ${answer.lastName} to the database`
                  );
                  userPrompt();
                }
              );
            });

          break;

        // Update an employee role
        case promptChoices[6]:
          console.log("Update an employee role");

          inquirer
            .prompt([
              {
                type: "list",
                name: "employee",
                message: "Which employee would you like to update?",
                choices: employees,
              },
              {
                type: "list",
                name: "role",
                message: "Which role would you like to assign to the employee?",
                choices: roles,
              },
            ])
            .then((answer) => {
              const roleID = roles.findIndex((obj) => obj == answer.role) + 1;

              const employeeID =
                employees.findIndex((obj) => obj == answer.employee) + 1;

              db.query(
                `UPDATE employee
                SET role_id = ${roleID} WHERE id = ${employeeID}`,
                (err, result) => {
                  if (err) {
                    console.log(err);
                  }

                  console.log(
                    `Updated ${answer.employee}'s role in the database`
                  );
                  userPrompt();
                }
              );
            });

          break;

        // None
        case promptChoices[7]:
          process.exit();

        default:
          userPrompt();
          break;
      }
    });
};

userPrompt();
