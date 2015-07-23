var port = 8080;
var express = require('express');
var MongoClient = require('mongodb').MongoClient;
var assert = require('assert');
var bodyParser = require("body-parser");
var _ = require('lodash');


var url = 'mongodb://localhost:27017/test2';
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
    console.log("THE OBJECT SHOULD BE: " + req.body.desc);
    MongoClient.connect(url, function(err, db) {
        assert.equal(null, err);
        insertEvent(db, event, function() {
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