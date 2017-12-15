const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const closeConnection = require("./modules/closeConnection.js")

// order constructor
let Order = function(id, quantity) {
  this.id = parseFloat(id);
  this.quantity = parseFloat(quantity);
  this.price = null;
};

let orderProcess = function() {
  inquirer
    .prompt([
      //Prompt user for item ID and validate
      {
        type: "prompt",
        message: "Type the id of the item you want to buy.",
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
        //Prompt user for quantity and validate input is a number
        type: "prompt",
        message: "How many would you like?",
        name: "quantity",
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
      //Create order instance
      let order = new Order(answers.id, answers.quantity);
      //Get item quantity
      connection.query(
        "SELECT stock_quantity, price FROM products WHERE item_id=?",
        [order.id],
        function(err, res) {
          if (err) throw err;
          //Add item price to order instance
          order.price = res[0].price;
          let startQuantity = res[0].stock_quantity;
          //Print insufficient quantity message
          if (startQuantity - order.quantity <= 0) {
            console.log(
              `Insufficient quantity! There are only ${startQuantity} left. Make another selection.`
            );
            return shop();
            //Decrement quantity and tell user full price; exit app.
          } else {
            connection.query(
              "UPDATE products SET ? WHERE ?",
              [
                { stock_quantity: startQuantity - order.quantity },
                { item_id: order.id }
              ],
              function(err, res) {
                if (err) throw err;
                let total = parseFloat(order.price * order.quantity).toFixed(2);
                console.log(`Thank you for the order. Your total is ${total}`);
                closeConnection(connection);
              }
            );
          }
        }
      );
    });
};

let shop = function() {
  //Print table of ALL items and create array of IDs for validation purposes
  getInventory(orderProcess);
};

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  shop();
});
