function closeConnection(connection) {
  connection.end(err => {
    if (err) throw err;
  });
}

module.exports = closeConnection;
