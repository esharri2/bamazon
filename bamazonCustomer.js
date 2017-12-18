const inquirer = require("inquirer");
const connection = require("./modules/db_connection.js");
const getInventory = require("./modules/getInventory.js");
const closeConnection = require("./modules/closeConnection.js");
const validateNumber = require("./modules/validateNumber.js");

// order constructor
let Order = function(id, quantity) {
  this.id = parseFloat(id);
  this.quantity = parseFloat(quantity);
  this.price = null;
};

function processOrder() {
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
        validate: input => validateNumber(input)
      }
    ])
    .then(answers => {
      //Create order instance
      let order = new Order(answers.id, answers.quantity);
      //Get item quantity
      connection.query(
        "SELECT stock_quantity, department_name, product_sales, price FROM products WHERE item_id=?",
        [order.id],
        (err, res) => {
          if (err) throw err;
          let startQuantity = res[0].stock_quantity;
          //Print insufficient quantity message
          if (startQuantity - order.quantity < 0) {
            console.log(
              `Insufficient quantity! There are only ${startQuantity} left. Make another selection.`
            );
            return shop();
            //Decrement quantity and tell user full price; exit app.
          } else {
            let currentProductSales = parseFloat(res[0].product_sales);
            order.price = res[0].price;
            let total = parseFloat(
              parseFloat(order.price * order.quantity).toFixed(2)
            );
            connection.query(
              "UPDATE products SET stock_quantity=?, product_sales=? WHERE ?",
              [
                startQuantity - order.quantity,
                currentProductSales + total,
                { item_id: order.id }
              ],
              err => {
                if (err) throw err;
                console.log(`Thank you for the order. Your total is ${total}`);
                closeConnection(connection);
              }
            );
          }
        }
      );
    });
}

function shop() {
  getInventory(processOrder);
}

// connect to the mysql server and sql database
connection.connect(err => {
  if (err) throw err;
  shop();
});
