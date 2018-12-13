DROP DATABASE IF EXISTS bamazon_db;
CREATE DATABASE bamazon_db;
USE bamazon_db;

CREATE TABLE products (
	item_id INT NOT NULL AUTO_INCREMENT PRIMARY KEY,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(6, 2),
    stock_quantity INT
);

INSERT INTO products (product_name, department_name, price, stock_quantity) 
VALUES ("Christmas Tree", "Decorations", 199.99, 2), ("Stocking", "Decorations", 24.99, 26), ("50ft String Lights", "Decorations", 30.99, 10), ("Big Inflatable Santa", "Decorations", 99.99, 100), ("Santa Hat", "Clothing", 14.50, 17), ("Ugly Sweater", "Clothing", 44.99, 74), ("Gingerbread House", "Food", 17.99, 45), ("12pc Candy Canes", "Food", 5.99, 24), ("75ft Wrapping Paper", "Miscellaneous", 8.99, 250), ("Mariah Carey Christmas Album", "Miscellaneous", 19.99, 1000);

SELECT * FROM products