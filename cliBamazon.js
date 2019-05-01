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
    listSale();
});

function listSale() {
    inquirer
        .prompt({
            name: "action",
            type: "list",
            message: "What would you like to do?",
            choices: [
                "Display all Bamazon sales?",
                "Purchase a specific Bamazon product?",
                "exit"
            ]
        })
        .then(function (answer) {
            switch (answer.action) {
                case "Display all Bamazon sales?":
                    displayBamazon();
                    break;

                case "Purchase a specific Bamazon product?":
                    buyBamazon();
                    break;

                case "exit":
                    connection.end();
                    break;
            }
        });
}

function displayBamazon() {
    inquirer
        .prompt({
            name: "sales",
            type: "input",
            message: "What product would you like to search for?"
        })
        .then(function () {
            var query = "SELECT * FROM products";
            connection.query(query, function (err, res) {
                for (var i = 0; i < res.length; i++) {
                    console.log("\n--------------------------\n" + res[i].id + " || " + res[i].product_name + " || " + "$" + res[i].price + "\n--------------------------\n");
                }
                listSale();
            });
        });
}

function buyBamazon() {
    inquirer
        .prompt({
            name: "buying",
            type: "input",
            message: "What number would you like to buy?",
            validate: function (value) {
                if (isNaN(value) === false) {
                    return true;
                }
                return false;
                
            }
        },{
            name: "buyQunt",
            type: "input", 
            message: "How many would you like to buy?",
            validate: function(value) {
                if (isNaN(value) === false) {
                  return true;
                }
                return false;
              }
        })
        .then(function (answer) {
            console.log(answer.buying);
            var query = "SELECT id, product_name, price FROM products WHERE ?";
            connection.query(query, { id: answer.buying }, function (err, res) {

                console.log(res);
                for (var i = 0; i < res.length; i++) {
                    //console.log(res[i]);
                    console.log('Product ID:' + res[i].id + ' ||  Product:' + res[i].product_name + " ||  Price: $" + res[i].price);
                }
            })
            listSale();
        })

}