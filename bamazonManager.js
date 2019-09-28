require('dotenv').config();
var mysql = require("mysql");
var inquirer = require("inquirer");

// This creates a connection to the Database
var connection = mysql.createConnection(
    {
        host: "localhost",
        port: 3306,
        user: "root",
        password: process.env.password,
        database: "bamazon"
    }
);

// This closes the connection to the Database
function closeConnection() {
    connection.end();
};

// This connects to the DB and calls the function to display the list options
connection.connect(function (err) {
    if (err) throw err;
    displayListOptions();
});

// This function displays the list of menu options to the manager
function displayListOptions() {
    inquirer.prompt([
        {
            type: "rawlist",
            message: "Please select any one of the following options",
            choices: ["View Products for Sale", "View Low Inventory", "Add to Inventory", "Add New Product"],
            name: "selectedOption"
        }
    ]).then(function (inqRes) {
        selectedAction(inqRes.selectedOption);
    });
};

// This methods decides the action to be performed based on teh selection
function selectedAction(action) {
    switch (action) {
        case "View Products for Sale":
            displayProducts();
            break;
        case "View Low Inventory":
            displayLowStock();
            break;
    };
};

// This function displays the products
function displayProducts() {
    connection.query("select item_id as ID,product_name as Product,price as Price,stock_quantity as Quantity from products; ", function (error, respDB) {
        if (error) throw error;
        console.table(respDB);
        closeConnection();
    });
}

// This function displays the stocks with low quantity
function displayLowStock(){

};