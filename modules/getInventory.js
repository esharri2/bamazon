const connection = require("./db_connection.js");
require("console.table");

let getInventory = function(callback) {
  connection.query("SELECT * FROM products", function(err, response) {
    if (err) throw err;
    validIDs = [];    
    response.forEach(function(item) {
      validIDs.push(item.item_id);
    });
    console.table(response);
    if (callback) {
      callback();
    }
  });
};

module.exports = getInventory;
