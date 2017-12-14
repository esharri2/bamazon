DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10 , 2 ),
    stock_quantity INT(5),
    PRIMARY KEY (item_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("War and Peace","Books",19.99,25), ("Anna Kareinina","Books",17.00,5), ("Paper towels","Home goods",3.99,700), 
("Slippers","Footwear",10,68), ("Sandals","Footwear",15,43), ("Basketball","Sports",29.99,42), ("Medicine ball","Sports",12,2), ("The Leftovers","DVD",20,1),
("Cheerios","Food",3.99,22),("Frosted Flakes","Food",3.99,45);

SELECT * FROM products;