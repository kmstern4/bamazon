var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
var Product = require("./products");

var productArr = [];
var productNameArr = [];

var connection = mysql.createConnection({
    host: "localhost",
    port: 8889,
    user: "root",
    password: "root",
    database: "bamazon_db"
});

connection.connect(function(err) {
    if (err) throw err;
    start();
});

function viewProducts(callback) {
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

function startAgain() {
    productArr = [];
    productNameArr = [];
    inquirer.prompt([
        {
            type: "confirm",
            message: "Would you like to do something else?",
            default: true,
            name: "confirm"
        }
    ]).then(function(answer) {
        if (answer.confirm) {
            start();
        } else {
            connection.end();
        }
    })
}

function start() {
    inquirer.prompt([
        {
            type: "list",
            message: "What would you like to do?",
            choices: ["View products for sale", "View low inventory", "Add to inventory", "Add new product", "Exit"],
            name: "choice"
        }
    ]).then(function(answer) {
        switch(answer.choice) {
            case "View products for sale":
                viewProducts(startAgain);
                break;
            case "View low inventory":
                lowInventory();
                break;
            case "Add to inventory":
                addInventory();
                break;
            case "Add new product":
                addProduct();
                break;
            case "Exit":
                exit();
                break;
            default:
                return console.log("Something went wrong");
        }
    })
}