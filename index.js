//dependencies
const mysql = require("mysql2");
const inquirer = require("inquirer");
require("console.table");

//connection
const connection = mysql.createConnection({
  host: "Localhost",
  port: 3306,
  user: "root",
  password: "password1",
  database: "employeesDB",
});

connection.connect(function (err) {
  if (err) throw err;
  console.log("Connected" + connection.threadId);
  firstConnect();
});

function firstConnect() {
  inquirer
    .prompt({
      tpye: "list",
      name: "task",
      message: "Would you like to...",
      choices: [
        "View Employees",
        "Search Employees by Department",
        "Add Employee",
        "Remove Employee",
        "Update Employee",
        "Add Role",
        "Close",
      ],
    })
    .then(function ({ task }) {
      switch (task) {
        case "View Employees":
          viewEmployee();
          break;
        case "Search Employees by Department":
          searchEmployeesByDepartment();
          break;
        case "Add Employee":
          addEmployee();
          break;
        case "Remove Employee":
          removeEmployee();
          break;
        case "updateEmployee":
          updateEmployee();
          break;
        case "Add Role":
          addRole();
          break;
        case "Close":
          connection.end();
          break;
      }
    });
}
// View employees
function viewEmployee() {
  console.log("Viewing employees\n");

  var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
    FROM employee e
    LEFT JOIN role r
	ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    LEFT JOIN employee m
	ON m.id = e.manager_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    console.table(res);
    console.log("Employees viewed\n");

    firstConnect();
  });
}

function searchEmployeesByDepartment() {
  console.log("Searching employees by department\n");

  var query = `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    LEFT JOIN role r
    ON e.role_id = r.id
    LEFT JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map((data) => ({
      value: data.id,
      name: data.name,
    }));

    console.table(res);
    console.log("Now viewing department\n");

    promptDepartment(departmentChoices);
  });
}

function promptDepartment(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "departmentId",
        message: "What department do you wish to view?",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      console.log("answer ", answer.departmentId);

      var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department 
    FROM employee e
    JOIN role r
	ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    WHERE d.id = ?`;
      connection.query(query, answer.departmentId, function (err, res) {
        if (err) throw err;

        console.table("response ", res);
        console.log(res.affectedRows + "Viewed!\n");
        firstConnect();
      });
    });
}
