const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const closeConnection = require("./modules/closeConnection.js");

let manage = function() {};

connection.connect(function(err) {
  let choices = [
    "View products for sale",
    "View low inventory",
    "Add to inventory",
    "Add new product",
    "Exit"
  ];

  if (err) throw err;
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "manage",
      choices: choices
    })
    .then(function(answers) {
      switch (answers.manage) {
        case choices[0]:
          getInventory();
          manage();
          break;
        case choices[1]:
          console.log(1);
          break;
        case choices[2]:
          console.log(2);
          break;
        case choices[3]:
          console.log(3);
          break;
        case choices[4]:
          closeConnection(connection);
          break;
      }
    });
});
