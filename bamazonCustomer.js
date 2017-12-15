const inquirer = require("inquirer");
const connection = require("./db_connection.js");
require("console.table");

let closeConnection = function() {
  connection.end(function(err) {
    if (err) throw err;
    // The connection is terminated now
  });
};

// order constructor
let Order = function(id, quantity) {
  this.id = parseFloat(id);
  this.quantity = parseFloat(quantity);
  this.price = null;
};

// connect to the mysql server and sql database
connection.connect(function(err) {
  if (err) throw err;
  shop();
});

let shop = function() {
  //Print table of ALL items and create array of IDs for validation purposes
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;
    validIDs = [];
    response.forEach(function(item) {
      validIDs.push(item.item_id);
    });
    console.table(response);
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
                  console.log(
                    `Thank you for the order. Your total is ${order.price *
                      order.quantity}`
                  );
                  closeConnection();
                }
              );
            }
          }
        );
      });
  });
};
