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

// Asks the user if he wants to continue
function askIfContinuing() {

    inquirer.prompt(
        {
            type: "confirm",
            message: "Do you want to continue?",
            name: "continue"
        }
    ).then(function (response) {
        if (response.continue === true) {
            displayListOptions();
        }
        else {
            closeConnection();
        }

    });
}


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
        case "Add to Inventory":
            addMore();
            break;
        default:
            addProduct();
            break;
    };
};

// This function displays the products
function displayProducts() {
    connection.query("select item_id as ID,product_name as Product,price as Price,stock_quantity as Quantity from products; ", function (error, respDB) {
        if (error) throw error;
        console.table(respDB);
        askIfContinuing();
    });
}

// This function displays the stocks with low quantity
function displayLowStock() {
    connection.query("call displayLowStock", function (error, respDB) {
        if (error) throw error;
        console.table(respDB[0]);
        askIfContinuing();
    });
};

// This adds the more quantity to the items
function addMore() {

    inquirer.prompt([
        {
            type: "number",
            message: "Enter the ID of the Product",
            name: "productID"
        },
        {
            type: "number",
            message: "Enter the quantity you want to add",
            name: "productStock"
        }
    ]).then(function (inqRes) {
        connection.query("call checkQuantity(?)", [inqRes.productID], function (error, respDB) {
            if (error) throw error;
            var quantity = inqRes.productStock + respDB[0][0].quantity;
            connection.query("call updateQuantity(?,?,?)", [inqRes.productID, quantity,0], function (err, respDB) {
                if (error) throw error;
                console.log("Successfully added more Quantity");
                askIfContinuing();
            });            
        });
    });
}

// This function allows the manager to add ew product
function addProduct() {
    inquirer.prompt([
        {
            type: "input",
            message: "In which department do you want to add the product?",
            name: "prodDepartment"
        },
        {
            type: "input",
            message: "What product do you want to add?",
            name: "prodName"
        },
        {
            type: "number",
            message: "What is the price of the product?",
            name: "prodPrice"
        },
        {
            type: "number",
            message: "Quantity of the product?",
            name: "prodQuantity"
        }
    ]).then(function (inqRes) {
        connection.query("insert into products set ?", {
            product_name: inqRes.prodName,
            department_name: inqRes.prodDepartment,
            price: inqRes.prodPrice,
            stock_quantity: inqRes.prodQuantity,
            product_sales:0            
        }, function (err, respDB) {
            if (err) throw err;
            console.log("Successfully added the product");
            askIfContinuing();
        });
    });
};