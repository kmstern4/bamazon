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
    buildTable(purchase);
};

function buildTable(callback) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            var addProduct = new Product(res[i].id, res[i].product, res[i].department, res[i].price, res[i].stock);
            productArr.push(addProduct);
            productNameArr.push(res[i].product);
        }
        console.table(productArr);
        callback();
    })
};

function purchase() {
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
        connection.query("SELECT * FROM products WHERE product = ?", [answer.product], function(err, res) {
            if (err) throw err;
            if (parseInt(answer.amount) > parseInt(res[0].stock)) {
                console.log("Insufficient Stock!");
                return purchase();
            }
            var total = res[0].price * parseInt(answer.amount);
            var remain = res[0].stock - parseInt(answer.amount);
            var newSales = res[0].sales + total;
            console.log(newSales);
            console.log(`Your total comes to $${total.toFixed(2)}. Thank you for your purchase!`);
            connection.query("UPDATE products SET stock = ?, sales = ? WHERE product = ?", [remain, newSales, answer.product], function(err, res) {
                if (err) throw err;
            });
            purchaseAgain();
        });
    })
};

function purchaseAgain() {
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to make another purchase?",
            default: true,
            name: "confirm"
        }
    ]).then(function(answer) {
        if (answer.confirm) {
            productArr = [];
            buildTable(purchase);
        } else {
            connection.end();
        }
    })
};