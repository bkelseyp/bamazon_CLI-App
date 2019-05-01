var mysql = require("mysql");
var inquirer = require("inquirer");

var connection = mysql.createConnection({
    host: "localhost",

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: "root",

    // Your password
    password: "@2TOOto101",
    database: "bamazon"
});

connection.connect(function (err) {
    if (err) throw err;
    console.log("connected as id " + connection.threadId);
    start();
});



function start() {
    connection.query("SELECT * FROM products", function (err, res) {
        for (var i = 0; i < res.length; i++) {
            console.log("\n--------------------------\n" + res[i].id + "|" + res[i].product_name + "|" + res[i].price + "\n--------------------------\n");
        }   
    });
  
}

function promptUser(); {

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
                            choiceArray.push(results[i].id + results[i].product_name + "  $:" + results[i].price);
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

