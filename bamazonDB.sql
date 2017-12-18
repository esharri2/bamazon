DROP DATABASE IF EXISTS bamazonDB;

CREATE DATABASE bamazonDB;

USE bamazonDB;

CREATE TABLE products (
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50),
    department_name VARCHAR(50),
    price DECIMAL(10 , 2 ),
    stock_quantity INT(5),
    product_sales DECIMAL(10 , 2 ) DEFAULT 0,
    PRIMARY KEY (item_id)
);

CREATE TABLE departments (
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs DECIMAL(10 , 2 ),
    PRIMARY KEY (department_id)
);


INSERT INTO products (product_name, department_name, price, stock_quantity)
VALUES ("War and Peace","Books",19.99,25), ("Anna Karenina","Books",17.00,5), ("Paper towels","Home goods",3.99,700), 
("Slippers","Footwear",10,68), ("Sandals","Footwear",15,43), ("Basketball","Sports",29.99,42), ("Medicine ball","Sports",12,2), ("The Leftovers","DVD",20,1),
("Cheerios","Food",3.99,22),("Frosted Flakes","Food",3.99,0);

INSERT INTO departments (department_name, over_head_costs)
VALUES ("Books",500), ("Home goods",1000), ("Footwear",700), ("Sports",2000), ("DVD",200),
("Food",1500);