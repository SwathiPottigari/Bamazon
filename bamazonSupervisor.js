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


// Asks the user if he wants to continue
function askIfContinuing() {

    inquirer.prompt(
        {
            type: "confirm",
            message: "Do you want to continue?",
            name: "continue"
        }
    ).then(function (response) {
        console.log(response);
        if (response.continue === true) {
            disPlayItemsForSale();
        }
        else {
            closeConnection();
        }

    });
}

connection.connect(function (err) {
    if (err) throw err;
    displayListOptions();
});

// This function displays the list of menu options to the manager
function displayListOptions() {
    inquirer.prompt([
        {
            type: "list",
            message: "Please select any one of the following options",
            choices: ["View Product Sales by Department", "Create New Department"],
            name: "selectedOption"
        }
    ]).then(function (inqRes) {
        selectedAction(inqRes.selectedOption);
    });
};

// This methods decides the action to be performed based on teh selection
function selectedAction(action) {
    switch (action) {
        case "View Product Sales by Department":
            displayProductsByDep();
            break;
        default:
            createDepartment();
            break;
    };
};

function displayProductsByDep() {
    connection.query("call displayDepartments()", function (err, respDB) {
        console.table(respDB[0]);
        askIfContinuing
    });
};