var connect = require("../my_modules/connectDB");
var mysql = require("mysql");
var bodyParser = require("body-parser");
var md5 = require("md5");

function loadAdCat(id){

      var conn = connect();

      var response = new Promise(function(resolve, reject){
        if (id != '') {
          conn.connect(function(err){
            if(!err){
              conn.query("SELECT * FROM rooms WHERE admin_id=? AND private_flag=1", [id], function(err, res){
                if(!err){
                  conn.end();
                  resolve(res);
                }
              })
            }
            else{
              conn.end();
            }
          })
        }
      })

      return response;

}

function loadMyCat(id){

      var conn = connect();

      var response = new Promise(function(resolve, reject){
        if (id != '') {
          conn.connect(function(err){
            if(!err){
              conn.query("SELECT auth.*, rooms.* FROM auth INNER JOIN rooms WHERE auth.id_room=rooms.id AND auth.id_user=?", [id], function(err, res){
                if(!err){
                  resolve(res);
                }
              })
            }
            conn.end();

          })
        }
      })

      return response;

}

exports.loadAdCat = loadAdCat;
exports.loadMyCat = loadMyCat;
