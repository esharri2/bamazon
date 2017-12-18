const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const validateNumber = require("./modules/validateNumber.js");
const closeConnection = require("./modules/closeConnection.js");

function showProfits() {
  let query =
    "SELECT department_id, d.department_name, over_head_costs, product_sales " +
    "FROM departments AS d " +
    "LEFT JOIN products AS p ON d.department_name = p.department_name " +
    "GROUP BY d.department_name";
  connection.query(query, (err, res) => {
    //Calculate profit for each department and add to response object from query
    res.forEach(row => {
      if (!row.product_sales) {
        row.product_sales = 0;
      }
      row.total_profit = row.product_sales - row.over_head_costs;
    });
    //Display profit by department in table
    console.table(res);
    supervise();
  });
}

function newDepartment() {
  //Prompt for department name and overhead costs
  inquirer
    .prompt([
      { type: "prompt", message: "Department:", name: "department_name" },
      {
        type: "prompt",
        message: "Overhead costs:",
        name: "over_head_costs",
        validate: input => validateNumber(input)
        
      }
    ])
    .then(answers => {
      //Add user input to departments table and display success message
      connection.query(
        "INSERT INTO departments SET ?",
        {
          department_name: answers.department_name,
          over_head_costs: answers.over_head_costs
        },
        err => {
          if (err) throw err;
          console.log(
            `You have created the ${answers.department_name} department.`
          );
          supervise();
        }
      );
    });
}

function supervise() {
  choices = [
    "View product sales by department",
    "Create new department",
    "Exit"
  ];
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "supervise",
      choices: choices
    })
    .then(answers => {
      switch (answers.supervise) {
        case choices[0]:
          showProfits();
          break;
        case choices[1]:
          newDepartment();
          break;
        case choices[2]:
          closeConnection(connection);
          break;
      }
    });
}

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  supervise();
});
