var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");
var Product = require("./products");

var productArr = [];
var productNameArr = [];
var lowArr = [];

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

function lowInventory(callback) {
    connection.query("SELECT * FROM products WHERE stock < 5", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            lowArr.push(res[i]);
        }
        console.table(lowArr);
        callback();
    })
};

function addInventory(callback) {
    connection.query("SELECT * FROM products", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            productNameArr.push(res[i].product);
        }
        callback();
    })
};

function addToInventory() {
    inquirer.prompt([
        {
            type: "list",
            message: "Which product would you like to add inventory to?",
            choices: productNameArr,
            name: "list"
        }, {
            type: "input",
            message: "How many are being added?",
            name: "amount",
            validate: function(answer) {
                if (!parseInt(answer)) {
                    return "Amount must be a number";
                }
                return true;
            }
        }
    ]).then(function(answer) {
        connection.query("SELECT * FROM products WHERE product = ?", [answer.list], function(err, res) {
            if (err) throw err;
            var newInv = res[0].stock + parseInt(answer.amount);
            connection.query("UPDATE products SET stock = ? WHERE product = ?", [newInv, answer.list], function(err, res) {
                if (err) throw err;
                console.log(`Inventory of ${answer.list} updated to ${newInv}.`)
            });
            setTimeout(startAgain, 800);
        })
    })

}

function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "What product would you like to add?",
            name: "product"
        }, {
            type: "input",
            message: "What department would you like to add this product to?",
            name: "department"
        }, {
            type: "input",
            message: "What is the price of this product ($)?",
            name: "price",
            validate: function(answer) {
                if (!parseInt(answer)) {
                    return "Please input a number, excluding $";
                }
                return true;
            }
        }, {
            type: "input",
            message: "How many of this product are being added?",
            name: "stock",
            validate: function(answer) {
                if (!parseInt(answer)) {
                    return "Please input a number";
                }
                return true;
            }
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO products (product, department, price, stock) VALUES (?, ?, ?, ?)", [answer.product, answer.department, answer.price, answer.stock], function(err, res) {
            if (err) throw err;
            console.log(`${answer.product} successfully added!`);
            setTimeout(startAgain, 800);
        })
    })
};

function exit() {
    connection.end();
}

function startAgain() {
    productArr = [];
    productNameArr = [];
    lowArr = [];
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
};

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
                lowInventory(startAgain);
                break;
            case "Add to inventory":
                addInventory(addToInventory);
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