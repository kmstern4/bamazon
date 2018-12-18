# bamazon

### Customer Level
In the customer level, users can see a table displaying all items available for purchase, including name, price, and quantity in stock. This data is pulled from a MySQL database. When a user selects a product using Inquirer, they are then prompted to enter the amount they would like to purchase. If the item is in stock at that amount, they will "purchase" the item and the total of their purcase will be shown. The table will update in the database using MySQL. If the quantity is not available, they will see "Insufficient Stock" and be asked to try their purchase again.

![Customer Bamazon Gif](assets/customer.gif)

### Manager Level
The manager level uses the same table of information from the MySQL database as the customer level. The user can choose to view the table, which displays all products available for purchase including name, price, and quantity in stock. The user can also view the "low inventory" items which will create a table of only items with less than 5 stock. The user can add to an items stock, which updates the database table through MySQL. The user can also choose to add a brand new item to the database. Through Inquirer, they will be prompted to specify the product's name, price, and quantity. These values are added to the database, which you can see from choosing to view products for sale.

![Manager Bamazon Gif](assets/manager.gif)

### Supervisor Level
The supervisor level uses the same Products table from the same MySQL database used in the previous levels, and also uses a table called Departments, containing 3 columns: department ID, department name, and overhead. Choosing to view sales by department will bring up a table created from joining the Departments table and the Products table. The total sales column is calculated by adding up the total sales from items in the same department on the Products table. The total profit column is calculated by subtracting the overhead column from the total sales column.
(Note: There is a "sales" column on the Products table that is not visible in the tables created in Bash for the customer or manager levels. This is the column used to create the total sales column on the joined table.)

![Supervisor Bamazon Gif](assets/supervisor.gif)
