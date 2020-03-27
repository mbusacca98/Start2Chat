var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require("md5");

function login(username, password){

  var response = new Promise(async function(resolve, reject){

    var conn = connect();

    if (username != '' && password != '') {

        conn.connect(function(err){
          if(!err){
            //query ricerca utente nel db
            password = md5(password); //cifro la password
            conn.query("SELECT * FROM user WHERE username=? AND password=?",[username, password] ,function(err, result){
              if(!err){
                if(result.length == 1 && username == result[0].username && password == result[0].password){
                    //Invio segnale di logged-in al client
                    conn.end();
                    resolve(["logged-in", result[0].id]);
                }
                else{
                  conn.end();
                  resolve(["error-login"]);
                }
              }
            })
          }
          else{
            conn.end();
            resolve(['error-db']);
          }
        })
    }
    else{
      resolve(['campi-mancanti']);
    }
});

return response;
}

function online(id){

  var response = new Promise(function(resolve, reject){

    var conn = connect();

      conn.connect(function(err){
        if(!err){
          //query ricerca utente nel db
          conn.query("SELECT * FROM user WHERE id=?",[id] ,function(err, result){
            if(!err){
              if(result.length == 1){
                //Invio segnale di logged-in al client
                conn.end();
                resolve(result[0]);
              }
            }
          })
        }
      })

})

return response;
}

exports.login = login;
exports.online = online;
