var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
var Product = require("./products");

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

var productArr = [];
var productNameArr = [];

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function start() {
    console.log(
        `\n-_-_----------------------------------_-_-\n        Welcome to Holiday Bamazon\n-_-_----------------------------------_-_-\n`
    );
    buildTable();
    inquirer.prompt([
        {
            type: "list",
            message: "Which product would you like to purchase?",
            choices: productNameArr,
            name: "product"
        }, {
            type: "input",
            message: "How many would you like to purchase?",
            name: "amount",
            validate: function(answer) {
                if (!parseInt(answer)) {
                    return "Amount must be a number";
                }
                return true;
            }
        }
    ]).then(function(answer) {
        
    })
};

function buildTable() {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            var addProduct = new Product(res[i].id, res[i].product, res[i].department, res[i].price, res[i].stock);
            productArr.push(addProduct);
            productNameArr.push(res[i].product);
        }
        console.table(productArr);
        console.log(productNameArr);
    })
}