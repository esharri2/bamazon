const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const closeConnection = require("./modules/closeConnection.js");
const validateNumber = require("./modules/validateNumber.js");

function getLowInventory() {
  connection.query(
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5",
    (err, res) => {
      if (err) throw err;
      console.table(res);
      manage();
    }
  );
}

function addToInventory() {
  inquirer
    //Get ID and quantity of item to update + validate input
    .prompt([
      {
        type: "prompt",
        message: "Type the id of the item you want to update.",
        name: "id",
        validate: input => {
          if (validIDs.includes(parseFloat(input))) {
            return true;
          } else {
            return "That is not a valid item id number. Try again!";
          }
        }
      },
      {
        type: "prompt",
        message: "How many of the item would you like to add?",
        name: "add",
        validate: input => validateNumber(input)
        
      }
    ])
    .then(function(answers) {
      //Get current quantity of item to updated
      connection.query(
        "SELECT stock_quantity FROM products WHERE item_id=?",
        [answers.id],
        (err, res) => {
          if (err) throw err;
          let newQuantity =
            parseFloat(res[0].stock_quantity) + parseFloat(answers.add);
          //Update item with new quantity
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ stock_quantity: newQuantity }, { item_id: answers.id }],
            err => {
              if (err) throw err;
              console.log(`The quantity has been increased to ${newQuantity}`);
              manage();
            }
          );
        }
      );
    });
}

function addNewProduct() {
  inquirer
    .prompt([
      { type: "prompt", message: "Product name:", name: "product_name" },
      //Roadmap: Add function to validate that the department name exists in the departments table (or make it a choice menu)
      { type: "prompt", message: "Department:", name: "department_name" },
      {
        type: "prompt",
        message: "Price:",
        name: "price",
        validate: input => validateNumber(input)
        
      },
      {
        type: "prompt",
        message: "Intial quantity:",
        name: "stock_quantity",
        validate: input => validateNumber(input)
        
      }
    ])
    .then(answers => {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.product_name,
          department_name: answers.department_name,
          price: answers.price,
          stock_quantity: answers.stock_quantity
        },
        err => {
          if (err) throw err;
          console.log(
            `${answers.product_name} has been added to the inventory.`
          );
          manage();
        }
      );
    });
}

function manage() {
  let choices = [
    "View products for sale",
    "View low inventory",
    "Add to inventory",
    "Add new product",
    "Exit"
  ];
  inquirer
    .prompt({
      type: "list",
      message: "What would you like to do?",
      name: "manage",
      choices: choices
    })
    .then(answers => {
      switch (answers.manage) {
        case choices[0]:
          getInventory(manage);
          break;
        case choices[1]:
          getLowInventory();
          break;
        case choices[2]:
          getInventory(addToInventory);
          break;
        case choices[3]:
          addNewProduct();
          break;
        case choices[4]:
          closeConnection(connection);
          break;
      }
    });
}

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  manage();
});
