const mysql = require("mysql");
const config = require("../config.json");


function connect(){
  var conn = mysql.createConnection({
    host : config.mysql.connection.host,
    user : config.mysql.connection.user,
    database : config.mysql.connection.db,
    password : config.mysql.connection.password
  });

  return conn;
}

module.exports = connect;
