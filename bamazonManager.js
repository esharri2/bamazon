const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const closeConnection = require("./modules/closeConnection.js");

let getLowInventory = function() {
  connection.query(
    "SELECT product_name, stock_quantity FROM products WHERE stock_quantity < 5",
    function(err, res) {
      if (err) throw err;
      console.table(res);
      manage();
    }
  );
}; //End getLowInventory

let addToInventory = function() {
  inquirer
    //Get ID and quantity of item to update + validate input
    .prompt([
      {
        type: "prompt",
        message: "Type the id of the item you want to update.",
        name: "id",
        validate: function(input) {
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
        validate: function(input) {
          if (typeof parseFloat(input) === "number") {
            return true;
          } else {
            return "Please enter a number.";
          }
        }
      }
    ])
    .then(function(answers) {
      //Get current quantity of item to updated
      connection.query(
        "SELECT stock_quantity FROM products WHERE item_id=?",
        [answers.id],
        function(err, res) {
          if (err) throw err;
          let newQuantity =
            parseFloat(res[0].stock_quantity) + parseFloat(answers.add);
          //Update item with new quantity
          connection.query(
            "UPDATE products SET ? WHERE ?",
            [{ stock_quantity: newQuantity }, { item_id: answers.id }],
            function(err, res) {
              if (err) throw err;
              console.log(`The quantity has been increased to ${newQuantity}`);
              manage();
            }
          );
        }
      );
    });
}; //End addToInventory

let addNewProduct = function() {
  //Used to validate user input of price and quantity
  let validateNumber = function(num) {
    if (typeof parseFloat(num) === "number") {
      return true;
    } else {
      return "Please enter a number for this field.";
    }
  };
  inquirer
    .prompt([
      { type: "prompt", message: "Product name:", name: "product_name" },
      { type: "prompt", message: "Department:", name: "department_name" },
      {
        type: "prompt",
        message: "Price:",
        name: "price",
        validate: function(input) {
          return validateNumber(input);
        }
      },
      {
        type: "prompt",
        message: "Intial quantity:",
        name: "stock_quantity",
        validate: function(input) {
          return validateNumber(input);
        }
      }
    ])
    .then(function(answers) {
      connection.query(
        "INSERT INTO products SET ?",
        {
          product_name: answers.product_name,
          department_name: answers.department_name,
          price: answers.price,
          stock_quantity: answers.stock_quantity
        },
        function(err, res) {
          console.log(
            `${answers.product_name} has been added to the inventory.`
          );
          manage();
        }
      );
    });
}; //End addNewProduct

let manage = function() {
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
    .then(function(answers) {
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
};

connection.connect(function(err) {
  if (err) throw err;
  manage();
});
