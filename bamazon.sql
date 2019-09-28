DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE  bamazon;

CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price float NOT NULL,
stock_quantity INT NOT NULL,
primary key(item_id));

INSERT INTO products(product_name,department_name,price,stock_quantity) values("Pen","Stationary",23.50,10);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Eraser","Stationary",10,15);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Water Colors","Stationary",50,20);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Sandals","Footwear",20,5);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Wedges","Footwear",30,10);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Heels","Footwear",32,6);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Laptop","Electronics",200,10);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Mobile","Electronics",40,10);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("Computers","Electronics",23.50,10);
INSERT INTO products(product_name,department_name,price,stock_quantity) values("HeadPhones","Electronics",10,20);
