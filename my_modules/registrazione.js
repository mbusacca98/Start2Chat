var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require("md5");

function reg(data){
  var conn = connect();

  var response = new Promise(function(resolve, reject){
    if(data[0] != '' && data[1] != '' && data[2] != '' && data[3] != '' && data[4] != ''){
        conn.connect(function(err){ //Mi connetto al db
          if(!err){
            let password = md5(data[4]); //Cifro la password con md5
            //Eseguo la query di select per vedere se c'è già un utente registrato con la stessa mail o stesso username
            conn.query("SELECT * FROM user WHERE (mail=? AND username=?) OR mail=? OR username=?", [data[3], data[2], data[3], data[2]], function(err, result){
              if(result.length == 0){
                conn.query('INSERT INTO user (nome, cognome, username, mail, password) VALUES (?, ?, ?, ?, ?)', [data[0].toLowerCase(), data[1].toLowerCase(), data[2].toLowerCase(), data[3], password], function(err, result){
                  if(!err){
                    conn.end();
                    resolve('insert-ok');
                  }
                  else{
                    conn.end();
                    resolve('error-insert');
                  }
                })
              }
              else{
                conn.end();
                resolve('esist-user');
              }
            })
          }
          else{
            conn.end();
            resolve('db-offline');
          }
        })
    }
    else{
      resolve('campi-mancanti');
    }
  })

  return response;
}

exports.reg = reg;
