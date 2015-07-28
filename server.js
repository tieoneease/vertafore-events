var port = 8080;
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var _ = require('lodash');


var url = 'mongodb://localhost:27017/test3';
var app = express();

app.use(express.static(__dirname));
app.use(bodyParser.json());

var users = [
    {
        username: "mario",
        password: "mario",
    },
    {
        username: "luigi",
        password: "luigi",
    }
];

var authenticatedUser;
var events = {};
/*
Insert a new event
*/
var insertEvent = function(db, event, callback) {
    db.collection('events').insertOne( {
        "title" : event.title,
        "description" : event.desc,
        "type" : event.type,
        "date" : event.date,
        "time" : event.time
    }, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

var insertUser = function(db, user, callback) {
    db.collection('users').insertOne( {
        "email" : user.email,
        "name" : user.name,
        "password" : user.password
    },function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

/*
Load all existing events
*/
var findAllEvents = function(db, callback) {
    var cursor = db.collection('events').find();
    var count = 0;
    cursor.each(function(err, doc) {
        assert.equal(err, null);
        if(doc != null) {
            console.dir(doc);
            events[count] = doc;
            count += 1;
        }
        else {
            callback();   
        }
    });
};

var findUser = function(db, user, callback) {
    db.collection('events').findOne({email : user.email, password : user.password}, function(err, user) {
        return user;  
    });
    
}

app.get("/", function(req, res) {
    res.status(200);
    res.sendfile(__dirname + '/index.html');
});

app.get("/events", function(req, res) {
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findAllEvents(db, function() {
            db.close();
            res.status(200).send(events);
            events = {};
        });
    });
});

//TODO - Login stuff, new user works
/*app.post("/login", function (req, res) {
    var user = req.body;

    console.log("logged in");
    if (!user || !user.email || !user.password) {
        res.status(422).send();
    }
    
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        findUser(db, user, function() {
            db.close();
            res.status(200).send(user);
        });
    });
});*/


app.post("/logout", function (req, res) {
    authenticatedUser = null;

    res.status(200).send();
});

app.post("/createEvent", function (req, res) {
    var event = req.body;
    console.log("THE OBJECT SHOULD BE: " + req.body.desc);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertEvent(db, event, function() {
            db.close();
        });
    });
    res.status(200).send();
});

app.post("/createUser", function(req, res) {
    var user = req.body;
    console.log("what is this: " + user);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertUser(db, user, function() {
            db.close(); 
        });
    });
    res.status(200).send();
});


app.get("/users/current", function (req, res) {
    if (authenticatedUser) {
        res.status(200).send(authenticatedUser);
    } else {
        res.status(404).send();
    }
});


app.listen(port);
console.log('Listening on port ' + port);