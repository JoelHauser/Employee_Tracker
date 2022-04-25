USE employeesDB
INSERT INTO
  department (name)
VALUES
  ("Sales");

INSERT INTO
  department (name)
VALUES
  ("Engineering");

INSERT INTO
  department (name)
VALUES
  ("Legal");

INSERT INTO
  department (name)
VALUES
  ("Finance");

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Head of Sales", 100000, 1);

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Head Engineer", 130000, 1);

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Lead Legal Advisor", 180000, 1);

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Head Software Engineer", 160000, 1);

INSERT INTO
  role (title, salary, department_id)
VALUES
  ("Head Accountant", 120000, 1);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Timmy", "John", 1, 2);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("J", "Thomas", 2, 1);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Kimmy", "Ron", 3, 1);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Ronny", "Johnny", 1, NULL);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Sammy", "Blammy", 4, 1);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Felp", "Jane", 3, NULL);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("Can", "Blu", 5, NULL);

INSERT INTO
  employee (first_name, last_name, role_id, manager_id)
VALUES
  ("John", "Jimmy", 1, 2);
