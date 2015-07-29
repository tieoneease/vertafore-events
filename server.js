var port = 8080;
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var _ = require('lodash');


var url = 'mongodb://localhost:27017/test';
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
var events = [];


var insertEvent = function(db, event, callback) {
    db.collection('events').insertOne( {
        "title" : event.title,
        "description" : event.desc,
        "location" : event.location,
        "type" : event.type,
        "from" : event.from,
        "to" : event.to
    }, function(err, result) {
        assert.equal(err, null);
        callback(result);
    });
};

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

app.get("/", function(req, res) {
    res.status(200);
    res.sendfile(__dirname + '/index.html');
});


app.post("/login", function (req, res) {
    var user = req.body;

    console.log("logged in");
    if (!user || !user.username || !user.password) {
        res.status(422).send();
    }

    var usernameMatch = _.find(users, function (u) {
        return u.username === user.username;
    });

    if (!usernameMatch || usernameMatch.password !== user.password) {
        res.status(401).send();
    } else {
        authenticatedUser = _.omit(usernameMatch, 'password');
        res.status(200).send(authenticatedUser);

    }
});


app.post("/logout", function (req, res) {
    authenticatedUser = null;

    res.status(200).send();
});

app.post("/createEvent", function (req, res) {
    var event = req.body;
    console.log("THE OBJECT SHOULD BE: " + req.body.title);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertEvent(db, event, function() {
            db.close();
        });
    });
    res.status(200).send();
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

app.get("/users/current", function (req, res) {
    if (authenticatedUser) {
        res.status(200).send(authenticatedUser);
    } else {
        res.status(404).send();
    }
});


app.listen(port);
console.log('Listening on port ' + port);