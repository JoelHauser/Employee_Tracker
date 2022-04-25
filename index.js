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

function addEmployee() {
  console.log("Adding employee");

  var query = `SELECT r.id, r.title, r.salary 
    FROM role r`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const roleSelect = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title}`,
      salary: `${salary}`,
    }));
    console.table(res);
    console.log("RoleToAdd");
    promptInsert(roleSelect);
  });
}

function promptInsert(roleSelect) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "first_name",
        message: "What is your employees first name?",
      },
      {
        type: "input",
        name: "last_name",
        message: "What is your employees last name?",
      },
      {
        type: "list",
        name: "roleId",
        message: "What is your employees role?",
        choices: roleSelect,
      },
    ])
    .then(function (answer) {
      console.log(answer);

      var query = `INSERT INTO employee SET ?`;
      connection.query(
        query,
        {
          first_name: answer.first_name,
          last_name: answer.last_name,
          role_id: answer.roleId,
          manager_id: answer.manager_id,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log(res.insertedRows + "Added successfully.\n");

          firstConnect();
        }
      );
    });
}

function removeEmployee() {
  console.log("Delete an employee.");

  var query = `SELECT e.id, e.first_name, e.last_name FROM employee e`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    const deleteEmployeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${id} ${first_name} ${last_name}`,
    }));
    console.table(res);
    console.log("Delete\n");

    promptDelete(deleteEmployeeChoices);
  });
}

function promptDelete(deleteEmployeeChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which do you wish to remove?",
        choices: deleteEmployeeChoices,
      },
    ])
    .then(function (answer) {
      var query = `DELETE FROM employee WHERE ?`;
      connection.query(query, { id: answer.employeeId }, function (err, res) {
        if (err) throw err;
        console.table(res);
        console.log(res.affectedRows + "deleted\n");
        firstConnect();
      });
    });
}

function updateEmployee() {
  employeeArray();
}

function employeeArray() {
  console.log("Updating employee");

  var query = `SELECT e.id, e.first_name, e.last_name, r.title, d.name AS department, r.salary, CONCAT(m.first_name, ' ', m.last_name) AS manager
  FROM employee e
  JOIN role r
	ON e.role_id = r.id
  JOIN department d
  ON d.id = r.department_id
  JOIN employee m
	ON m.id = e.manager_id`;

  connection.query(query, function (err, res) {
    if (err) throw err;
    const employeeChoices = res.map(({ id, first_name, last_name }) => ({
      value: id,
      name: `${first_name} ${last_name}`,
    }));
    console.table(res);
    console.log("Array updated\n");

    roleArray(employeeChoices);
  });
}

function roleArray(employeeChoices) {
  console.log("updating role");

  var query = `SELECT r.id, r.title, r.salary FROM role r`;
  let roleChoices;

  connection.query(query, function (err, res) {
    if (err) throw err;

    roleChoices = res.map(({ id, title, salary }) => ({
      value: id,
      title: `${title} ${salary}`,
    }));
    console.table(res);
    console.log("Array updated\n");

    promptEmployeeRole(employeeChoices, roleChoices);
  });
}

function promptEmployeeRole(employeeChoices, roleChoices) {
  inquirer
    .prompt([
      {
        type: "list",
        name: "employeeId",
        message: "Which role does this employee take?",
        choices: employeeChoices,
      },
      {
        type: "list",
        name: "roleId",
        message: "Which role needs to be updated?",
        choice: roleChoices,
      },
    ])
    .then(function (answer) {
      var query = `UPDATE employee SET role_id = ? WHERE id = ?`;
      connection.query(
        query,
        [answer.roleId, answer.employeeId],
        function (err, res) {
          if (err) throw err;
          console.table(res);
          console.log(res.affectedRows + "successfully updated");
          firstConnect();
        }
      );
    });
}

function addRole() {
  var query = `SELECT d.id, d.name, r.salary AS budget
    FROM employee e
    JOIN role r
    ON e.role_id = r.id
    JOIN department d
    ON d.id = r.department_id
    GROUP BY d.id, d.name`;

  connection.query(query, function (err, res) {
    if (err) throw err;

    const departmentChoices = res.map(({ id, name }) => ({
      value: id,
      name: `${id} ${name}`,
    }));
    console.table(res);
    console.log("Array for Department(s)");

    promptAddRole(departmentChoices);
  });
}

function promptAddRole(departmentChoices) {
  inquirer
    .prompt([
      {
        type: "input",
        name: "roleTitle",
        message: "What is the role title?",
      },
      {
        type: "input",
        name: "roleSalary",
        message: "What is the salary?",
      },
      {
        type: "list",
        name: "departmentId",
        message: "What department?",
        choices: departmentChoices,
      },
    ])
    .then(function (answer) {
      var query = `INSERT INTO role SET ?`;
      connection.query(
        query,
        {
          title: answer.title,
          salary: answer.salary,
          department_id: answer.departmentId,
        },
        function (err, res) {
          if (err) throw err;

          console.table(res);
          console.log("Role has been inserted");
          firstConnect();
        }
      );
    });
}
