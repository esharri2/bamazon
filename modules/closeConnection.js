
let closeConnection = function(connection) {
    connection.end(function(err) {
      if (err) throw err;
    });
  };

  module.exports = closeConnection;