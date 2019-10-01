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
        if (response.continue === true) {
            displayListOptions();
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

// This function displays the departments sale table
function displayProductsByDep() {
    connection.query("call displayDepartments()", function (err, respDB) {
        console.table(respDB[0]);
        askIfContinuing();
    });
};

// This function creates the new department
function createDepartment(){
    inquirer.prompt([
        {
            type: "input",
            message: "Which department do you want to create?",
            name: "department"
        },
        {
            type: "number",
            message: "What is the overhead cost?",
            name: "overHeadCost"
        }
    ]).then(function(inqRes){
        connection.query("insert into departments set ?",{
            department_name:inqRes.department,
            over_head_costs:inqRes.overHeadCost
        },function(err,respDB){
            if(err) throw err;
            console.log("Successfully created a department");
            askIfContinuing();
        });
    });
};