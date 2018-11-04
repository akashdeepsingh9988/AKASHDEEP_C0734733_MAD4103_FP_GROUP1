var db = null;
var storage = window.localStorage;

// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.getElementById("insert-hero").addEventListener("click", saveButtonPressed);
document.getElementById("show-heros").addEventListener("click", showAllPressed);
document.getElementById("rescue-me").addEventListener("click", vibration);

function vibration() {
    navigator.vibrate(3000);
}
function connectToDatabase() {
    console.log("device is ready - connecting to database");
    if (window.cordova.platformId === 'browser') {
        db = window.openDatabase("superb", "1.0", "Database for super rescue agency app", 2 * 1024 * 1024);
    } else {
        var databaseDetails = {"name": "superb.db", "location": "default"}
        db = window.sqlitePlugin.openDatabase(databaseDetails);
        console.log("done opening db");
    }

    if (!db) {
        alert("databse connection failed!");
        return false;
    }

    // 3. create relevant tables
    db.transaction(createTables)

}

function createTables(transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS heroes (id integer PRIMARY KEY AUTOINCREMENT, name text, isAvailable integer)";
    transaction.executeSql(sql, [], createSuccess, createFail)
}

function createSuccess(tx, result) {

}
function createFail(error) {
    alert("Failure while creating table: " + error);
}




function saveButtonPressed(transaction) {
    console.log("save!!!");
    var str  = storage.getItem("inserted");
    if(str != "yes")
        {    
    
    db.transaction(function (transaction) {
        // save the values to the database
        var sql = "INSERT INTO heroes (name, isAvailable) VALUES ('Spiderman',1), ('Thor',1), ('Captain America',0), ('Wonder Women',0)";

        var st  =  storage.getItem("inserted");
 
        transaction.executeSql(sql, [], function (tx, result) {
            alert("Insert success");
            //showAllPressed()

            var storage = window.localStorage;
            storage.setItem("inserted", "yes"); // Pass a key name and its value to add or update that key.

        }, function (error) {
            alert("Insert failed: " + error);
        });
    }
        
    );

}

else
{
    alert("data already inserted");
}

}

function showAllPressed() {
    // clear the user interface
    document.getElementById("dbItems").innerHTML = "";

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM heroes", [],
                function (tx, results) {
                    var numRows = results.rows.length;

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);
                        var av = "";
                        if (item.isAvailable == 1)
                        {
                            av = "Yes";
                        } else
                        {
                            av = "No";

                        }

                        // show it in the user interface
                        document.getElementById("dbItems").innerHTML +=
                                "<p>Name: " + item.name + "</p>"
                                + "<p>Available  To Hire : " + av + "</p>"
                                + "<p>=======================</p>";
                    }

                }, function (error) {
        });
    });
}