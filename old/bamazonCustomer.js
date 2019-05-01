var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",
    port: 3306,
    user: "root",
    password: "@2TOOto101",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
    queryPrice();
});



function start() {
    // connection.query("SELECT * FROM products", function (err, res) {
    //     for (var i = 0; i < res.length; i++) {
    //         console.log("\n--------------------------\n" + res[i].id + "|" + res[i].product_name + "|" + res[i].price + "\n--------------------------\n");
    //     }
    // });
    
    connection.query("SELECT * FROM products", function (err, results) {
        if (err) throw err;

        inquirer
            .prompt([
                {
                    name: "choice",
                    type: "rawlist",
                    choices: function () {
                        var choiceArray = [];
                        for (var i = 0; i < results.length; i++) {
                            choiceArray.push(results[i].product_name + "  $:" + results[i].price);
                        }
                        return choiceArray;
                    },

                    message: "What item would you like to purchase?"
                },
                {
                    name: "purchase",
                    type: "input",
                    message: "How many would you like to purchase?",
                    validate: function(value) {
                        if (isNaN(value) === false) {
                          return true;
                        }
                        return false;
                      }
                }
            ])
            .then(function (answer) {
                var chosenItem;
                for (var i = 0; i < results.length; i++) {
                    if (results[i].product_name === answer.choice) {
                        chosenItem = results[i];
                    }
                }
                if (chosenItem.id) {
                    connection.query(
                        "SELECT * FROM products WHERE ?",
                        [
                            {
                                id: chosenItem.id
                            }
                        ],
                        function (error) {
                            if (error) throw err;
                            console.log("You just Purchased " + chosenItem);
                            start();
                        }
                    )
                }
            });
    });

}


// used to query the songs
function queryDanceSongs() {
    var query = connection.query("SELECT * FROM songs WHERE genre=?", ["Dance"], function(err, res) {
      for (var i = 0; i < res.length; i++) {
        console.log(res[i].id + " | " + res[i].title + " | " + res[i].artist + " | " + res[i].genre);
      }
    });
  
    // logs the actual query being run
    console.log(query.sql);
  }
