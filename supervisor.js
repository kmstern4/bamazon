var inquirer = require("inquirer");
var mysql = require("mysql");
var cTable = require("console.table");

var depArr = [];

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

function viewByDepartment(callback) {
    connection.query("SELECT dep_id, dep_name, overhead, SUM(sales) AS total_sales, SUM(sales) - overhead AS total_profit FROM products RIGHT JOIN departments ON departments.dep_name = products.department GROUP BY dep_name, dep_id, overhead ORDER BY dep_id", function(err, res) {
        if (err) throw err;
        for (var i=0; i < res.length; i++) {
            depArr.push(res[i]);
        }
        console.table(depArr);
        callback();
    })
};

function addDepartment() {
    inquirer.prompt([
        {
            type: "input",
            message: "What is the department name?",
            name: "department"
        }, {
            type: "input",
            message: "What is the overhead?",
            name: "overhead",
            validate: function(answer) {
                if (!parseInt(answer)) {
                    return "Overhead must be a number";
                }
                return true;
            }
        }
    ]).then(function(answer) {
        connection.query("INSERT INTO departments (dep_name, overhead) VALUES (?, ?)", [answer.department, answer.overhead], function(err, res) {
            if (err) throw err;
            console.log(`${answer.department} successfully added!`);
            setTimeout(startAgain, 800);
        })
    })
};

function exit() {
    connection.end();
};

function startAgain() {
    depArr = [];
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
            choices: ["View product sales by department", "Add new department", "Exit"],
            name: "list"
        }
    ]).then(function(answer) {
        switch(answer.list) {
            case "View product sales by department":
                viewByDepartment(startAgain);
                break;
            case "Add new department":
                addDepartment();
                break;
            case "Exit":
                exit();
                break;
            default:
                return console.log("Something went terribly wrong!");
        }
    })
};