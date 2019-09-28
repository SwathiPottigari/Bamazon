require("dotenv").config();
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

// This connects to the DB and calls the function to display the items
connection.connect(function (err) {
    if (err) throw err;
    disPlayItemsForSale();
});

// Thsi displays the data from the DB
function disPlayItemsForSale() {
    connection.query("call displayItems", function (error, response) {
        if (error) throw error;
        console.table(response[0]);
        askTheCustomer();
    });
};

// This function asks the customer the details of the product to be bought
function askTheCustomer() {
    inquirer.prompt([
        {
            type: "number",
            message: "Enter the ID of the product you would like to buy",
            name: "productID"
        },
        {
            type: "number",
            message: "Enter the quantity needed",
            name: "productQuantity"
        }
    ]).then(function (inqResponse) {
        connection.query("call checkQuantity(?)", [inqResponse.productID], function (error, resDB) {
            if (error) throw error;
            if (resDB[0][0].quantity < inqResponse.productQuantity) {
                console.log("Insufficient quantity!");
                closeConnection();
            }
            else {
                var quantityReamining = resDB[0][0].quantity - inqResponse.productQuantity;
                var cost = resDB[0][0].price * inqResponse.productQuantity;
                sellItems(inqResponse.productID, quantityReamining, cost);
            }
        });
    });
};

// This function updates as the products are sold
function sellItems(id, quantity, cost) {
    connection.query("call updateQuantity(?,?)", [id, quantity], function (error, resDB) {
        if (error) throw error;
        console.log("Total cost = " + cost);
        closeConnection();
    });
};



