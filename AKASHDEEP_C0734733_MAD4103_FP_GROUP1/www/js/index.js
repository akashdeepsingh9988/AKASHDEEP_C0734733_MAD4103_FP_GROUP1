var db = null;
var userEmail = "";
var userPassword = "";
var storage = window.localStorage;
// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.addEventListener("deviceReady", saveButtonPressed);
document.getElementById("login-button").addEventListener("click", userLogin);
document.getElementById("signup-button").addEventListener("click", userSignUp);
document.getElementById("profile-header").addEventListener("click", profile);
var value = storage.getItem("login");

if (value == "true")
{
    //document.getElementById("profile-card").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";


} else
{
    document.getElementById("nav-bar").style.display = "none";


}


function vibration() {
    navigator.vibrate(3000);
}

function profile() {
    document.getElementById("profile-card").style.display = "block";
//    alert("block");
    //window.location.href = 'http://www.google.com';
    document.getElementById("signup-form").style.display = "none";
    //window.location = "login.html";
    document.getElementById("login-form").style.display = "none";
    var userMail = storage.getItem("userEmail");
    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM users where email=?", [userMail],
                function (tx, results) {
                    var numRows = results.rows.length;

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);

                        //alert(item.name + item.email + item.location + item.phone);
                        document.getElementById("pname").innerHTML = item.name;
                        document.getElementById("pemail").innerHTML = item.email;
                        document.getElementById("pphone").innerHTML = item.phone;
                        document.getElementById("plocation").innerHTML = item.location;
                        document.getElementById("pgender").innerHTML = item.gender;
                      //  document.getElementById("page").innerHTML = item.age;
                        var imageBox = document.getElementById("photoContainer");
                        var t = localStorage.getItem("photo");
                       // alert(t);
                        imageBox.src = localStorage.getItem("photo");

//                        document.getElementById("dbItems").innerHTML +=
//                                "<p>Name: " + item.name + "</p>"
//                                + "<p>Email : " + item.email + "</p>"
//                                + "<p>=======================</p>";
                    }

                }, function (error) {
        });
    });

}

function userLogin()
{
    userEmail = document.getElementById("email").value;
    userPassword = document.getElementById("password").value;
    alert(userEmail + userPassword);

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM users where email=? and password=?", [userEmail, userPassword],
                function (tx, results) {
                    var numRows = results.rows.length;

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);
                        storage.setItem("login", "true");
                        storage.setItem("userEmail", userEmail);

//                        document.getElementById("dbItems").innerHTML +=
//                                "<p>Name: " + item.name + "</p>"
//                                + "<p>Email : " + item.email + "</p>"
//                                + "<p>=======================</p>";
                    }

                }, function (error) {
        });
    });
}



function userSignUp() {

    var semail = document.getElementById("semail").value;
    var spassword = document.getElementById("spassword").value;
    var sname = document.getElementById("sname").value;
    var sage = document.getElementById("sage").value;
    var slocation = document.getElementById("slocation").value;
    var sgender = document.getElementById("sgender").value;
    var scpassword = document.getElementById("scpassword").value;
    var sphone = document.getElementById("sphone").value;

    // alert("I am here");

    db.transaction(function (transaction) {
        // save the values to the database
        var sql = "INSERT INTO users (name, email,password, age,gender,location,phone) \n\
VALUES (?,?,?,?,?,?,?)";

        transaction.executeSql(sql, [sname, semail, spassword, sage, sgender, slocation, sphone], function (tx, result) {
            //       alert("Insert success for new signup");

//============================= CREATE CONTACTS CODE =================================
//            var myContact = navigator.contacts.create({"displayName": "The New Contact"});
//            var name = new ContactName();
//
//            // CONTACT 1
//            name.givenName = sname;
//            name.familyName = "";
//            myContact.nickname = sname;
//            myContact.name = name;
//            var phoneNumbers = [];
//            phoneNumbers[1] = new ContactField('mobile', sphone, true); // preferred number
//            myContact.phoneNumbers = phoneNumbers;
//            myContact.save(onSuccessCallBack, onErrorCallBack);
//            function onSuccessCallBack(contact) {
//                //         alert("Save Success new signup");
//            }
//            ;
//            function onErrorCallBack(contactError) {
//                //       alert("Error = " + contactError.code);
//            }
//            ;

//============================= END CONTACTS CODE =================================

            //showAllPressed()
        }, function (error) {
            // alert("Insert failed: " + error);
        });
    }

    );

}


function connectToDatabase() {
    console.log("device is ready - connecting to database");
    if (window.cordova.platformId === 'browser') {
        db = window.openDatabase("dating", "1.0", "Database for dating app", 2 * 1024 * 1024);
    } else {
        var databaseDetails = {"name": "dating.db", "location": "default"}
        db = window.sqlitePlugin.openDatabase(databaseDetails);
        console.log("done opening db");
    }

    if (!db) {
        //alert("databse connection failed!");
        return false;
    }

    // 3. create relevant tables
    db.transaction(createTables)

}

function createTables(transaction) {
    var sql = "CREATE TABLE IF NOT EXISTS users (id integer PRIMARY KEY AUTOINCREMENT,name text, email text, password text, age text,\n\
 gender text, location text, phone text)";
    transaction.executeSql(sql, [], createSuccess, createFail)
}

function createSuccess(tx, result) {

}
function createFail(error) {
    //alert("Failure while creating table: " + error);
}



function saveButtonPressed(transaction) {
    console.log("save!!!");

    db.transaction(function (transaction) {
        // save the values to the database
        var sql = "INSERT INTO users (name, email,password, age,gender,location,phone) \n\
VALUES ('Akashdeep','akashthind007@gmail.com','password','20', 'Male','Toronto','+13657780293'),\n\
('Abhishek','abbansal1995@gmail.com','password', '20', 'Male','Toronto','+19057819666'),\n\
('John Mark','markjohn@gmail.com','password', '25', 'Male','Toronto','+19057878441'),\n\
('Commilla','comilla@gmail.com','password', '28', 'Female','Brampton','+16057819220'),\n\
('Emily John','emily_john@gmail.com','password', '22', 'Female','Brampton','+16057019767')";

        transaction.executeSql(sql, [], function (tx, result) {
            alert("Insert success");
            //    showAllPressed();

//============================= CREATE CONTACTS CODE =================================
//          var myContact = navigator.contacts.create({"displayName": "The New Contact"});
//            var name = new ContactName();
//
//            // CONTACT 1
//            name.givenName = "Akashdeep";
//            name.familyName = "Singh";
//            myContact.nickname = "Akashdeep Singh";
//            myContact.name = name;
//            var phoneNumbers = [];
//            phoneNumbers[1] = new ContactField('mobile', '365-778-0293', true); // preferred number
//            myContact.phoneNumbers = phoneNumbers;
//            myContact.save(onSuccessCallBack, onErrorCallBack);
//
//            // CONTACT 2
//            name.givenName = "Abhishek";
//            name.familyName = "Bansal";
//            myContact.nickname = "Abhishek Bansal";
//
//            myContact.name = name;
//
//            var phoneNumbers = [];
//            phoneNumbers[1] = new ContactField('mobile', '905-781-9666', true); // preferred number
//            myContact.phoneNumbers = phoneNumbers;
//            myContact.save(onSuccessCallBack, onErrorCallBack);
//
//
//
//            function onSuccessCallBack(contact) {
//                alert("Save Success");
//            }
//            ;
//
//            function onErrorCallBack(contactError) {
//                alert("Error = " + contactError.code);
//            }
//            ;
//

//============================= END CONTACTS CODE =================================
            //showAllPressed()
        },
                function (error) {
                    //alert("Insert failed: " + error);
                });
    }

    );
}

function showAllPressed() {
    // clear the user interface
    document.getElementById("dbItems").innerHTML = "";

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM users", [],
                function (tx, results) {
                    var numRows = results.rows.length;

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);


                        // show it in the user interface
                        document.getElementById("dbItems").innerHTML +=
                                "<p>Name: " + item.name + "</p>"
                                + "<p>Email : " + item.email + "</p>"
                                + "<p>=======================</p>";
                        alert(item.name);
                    }

                }, function (error) {
        });
    });
}
