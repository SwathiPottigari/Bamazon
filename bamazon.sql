DROP DATABASE IF EXISTS bamazon;

CREATE DATABASE bamazon;

USE  bamazon;

-- Creates a products table
CREATE TABLE products(
    item_id INT NOT NULL AUTO_INCREMENT,
    product_name VARCHAR(50) NOT NULL,
    department_name VARCHAR(50),
    price float NOT NULL,
stock_quantity INT NOT NULL,
primary key(item_id));

-- Inserts the data into products table
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

-- This SP displays all the data in the DB
 DELIMITER //
 CREATE PROCEDURE  readData()
    BEGIN
	SELECT name from items;
END//
delimiter ;

-- This SP selects the quantity on depending the ID of the product
 DELIMITER //
 CREATE PROCEDURE checkQuantity(IN id INT)
 BEGIN
  select stock_quantity from products where item_id=id;
 END // 
 DELIMITER ;

-- This SP updates the quantity once the products are sold
  DELIMITER //
 CREATE PROCEDURE updateQuantity(IN id INT,IN quantity INT,IN productCost float)
 BEGIN
  update products set stock_quantity=quantity ,product_sales=product_sales+productCost where item_id=id;
 END // 
 DELIMITER ;


-- This SP displays the items with stock quantity less than 5
 DELIMITER //
Create procedure displayLowStock()
begin
select item_id as ID,product_name as Product,stock_quantity as Quantity from bamazon.products where stock_quantity<5;
end //
delimiter ;

-- Creats a department table
CREATE TABLE departments(
    department_id INT NOT NULL AUTO_INCREMENT,
    department_name VARCHAR(50),
    over_head_costs float,
    primary key (department_id)
);

-- This adds the new column to the existing table
alter table products add column product_sales float not null ;

insert into departments(department_name,over_head_costs) values("Stationary",30);
insert into departments(department_name,over_head_costs) values("Footwear",35);
insert into departments(department_name,over_head_costs) values("Electronics",80);


-- This SP displays the department details and calculates the profits
delimiter //
create procedure displayDepartments()
begin
 select d.department_id,d.department_name,d.over_head_costs,sum(p.product_sales),sum(p.product_sales)-d.over_head_costs as profit from  bamazon.departments as d left join bamazon.products as p on d.department_name=p.department_name
 group by d.department_name;
 end //
 delimiter ;