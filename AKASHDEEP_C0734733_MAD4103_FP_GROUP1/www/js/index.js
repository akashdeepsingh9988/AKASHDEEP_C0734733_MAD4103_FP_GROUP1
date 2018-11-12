var db = null;
var userEmail = "";
var userPassword = "";
var storage = window.localStorage;

var city = "";



// add event listeners
document.addEventListener("deviceReady", connectToDatabase);
document.addEventListener("deviceReady", saveButtonPressed);
document.getElementById("login-button").addEventListener("click", userLogin);
document.getElementById("signup-button").addEventListener("click", userSignUp);
document.getElementById("profile-header").addEventListener("click", profile);
document.getElementById("logout").addEventListener("click", logout);
document.getElementById("searchButton").addEventListener("click", search);
var value = storage.getItem("login");
          //  var latlng = plugin.google.maps.LatLng();

 function GetAddress() {
          //  var lat = parseFloat(document.getElementById("txtLatitude").value);
           // var lng = parseFloat(document.getElementById("txtLongitude").value);
            var latlng = new google.maps.LatLng(18.92488028662047,72.8232192993164);
            var geocoder = geocoder = new google.maps.Geocoder();
            geocoder.geocode({ 'latLng': latlng }, function (results, status) {
                if (status == google.maps.GeocoderStatus.OK) {
                    if (results[1]) {
                        alert("Location: " + results[1].address_components[5].long_name);
                    }
                }
            });
        }
 
 
if (value == "true")
{
    //document.getElementById("profile-card").style.display = "block";
    document.getElementById("login-form").style.display = "none";
    document.getElementById("signup-form").style.display = "none";


} else
{
    document.getElementById("nav-bar").style.display = "none";


}


function logout() {
    localStorage.removeItem("login");
    localStorage.removeItem("userEmail");
    alert("Logged Out");
    document.getElementById("profile-card").style.display = "none";
    document.getElementById("logout").style.display = "none";
    document.getElementById("profile-header").style.display = "none";
    document.getElementById("login-form").style.display = "block";


}
function vibration() {
    navigator.vibrate(3000);
}

function profile() {
   // showAllPrecmd
   // ssed();
   GetAddress(18.9300, 72.8200);
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
                        document.getElementById("profile-card").style.display = "block";
                        document.getElementById("login-form").style.display = "none";

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
    var st = localStorage.getItem("inserted");

    if (st == "true")
    {

    } else
    {
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

                localStorage.setItem("inserted", "true");
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
}

function showAllPressed() {
    // clear the user interface
    document.getElementById("dbItems").innerHTML = "";

    db.transaction(function (transaction) {
        var userMail = storage.getItem("userEmail");
        transaction.executeSql("SELECT * FROM users where email not in (?)", [userMail],
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


function search()
{
    var searchKey = document.getElementById("searchBox").value;
    //alert(searchKey);
    var name  = "";
    var email  = "";
    var location  = "";
    var age  = "";
    var gender  = "";
    

    db.transaction(function (transaction) {
        transaction.executeSql("SELECT * FROM users where name=? or location = ?", [searchKey, searchKey],
                function (tx, results) {
                    var numRows = results.rows.length;
                    alert(numRows);

                    for (var i = 0; i < numRows; i++) {

                        // to get individual items:
                        var item = results.rows.item(i);
                        console.log(item);
                        console.log(item.name);
                        name = item.name;
                        email = item.email;
                        location = item.location;
                        age = item.age;
                        gender = item.gender;
alert(name);


                    }

                }, function (error) {
        });
    });
}
// https://stackoverflow.com/questions/44910126/loading-external-javascript-file


// https://www.aspsnippets.com/Articles/Reverse-Geocoding-Get-address-from-Latitude-and-Longitude-using-Google-Maps-Geocoding-API.aspx

//https://mindfiremobile.wordpress.com/2013/11/28/getting-address-from-latitudelongitude-value-using-google-api-and-phonegap/