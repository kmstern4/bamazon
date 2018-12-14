DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product VARCHAR(50),
    department VARCHAR(50),
    price DECIMAL(6, 2),
    stock INT,
    sales DECIMAL(10, 2) DEFAULT 0
);

INSERT INTO products (product, department, price, stock, sales) 
VALUES ("Christmas Tree", "Decorations", 199.99, 2, 9799.51), ("Stocking", "Decorations", 24.99, 26, 7848.43), ("50ft String Lights", "Decorations", 30.99, 10, 1549.50), ("Big Inflatable Santa", "Decorations", 99.99, 100, 99.99), ("Santa Hat", "Clothing", 14.50, 17, 2900), ("Ugly Sweater", "Clothing", 44.99, 74, 11697.40), ("Gingerbread House", "Food", 17.99, 45, 251.86), ("12pc Candy Canes", "Food", 5.99, 24, 5990), ("75ft Wrapping Paper", "Miscellaneous", 8.99, 250, 5394), ("Mariah Carey Christmas Album", "Miscellaneous", 19.99, 1000, 19630.18);

CREATE TABLE departments (
	dep_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    dep_name VARCHAR(30),
    overhead INT
);

INSERT INTO departments (dep_name, overhead) 
VALUES ("Clothing", 6000), ("Decorations", 10000), ("Food", 5000), ("Miscellaneous", 8500);

SELECT * FROM departments;
SELECT * FROM products;

SELECT dep_id, dep_name, overhead,
SUM(sales) AS total_sales, SUM(sales) - overhead AS total_profit
FROM products
RIGHT JOIN departments ON departments.dep_name = products.department
GROUP BY dep_name, dep_id, overhead
ORDER BY dep_id;