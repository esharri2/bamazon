const connection = require("./db_connection.js");
require("console.table");

function getInventory(callback) {
  connection.query("SELECT item_id, product_name, department_name, price, stock_quantity FROM products", (err, res) => {
    if (err) throw err;
    validIDs = [];
    res.forEach(item => {
      validIDs.push(item.item_id);
    });
    console.table(res);
    if (callback) {
      callback();
    }
  });
}

module.exports = getInventory;
