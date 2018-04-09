"use strict";

/* jshint node: true */

/*
 * This exports the current directory via webserver listing on a hard code (3000) port.
 *
 * To start the webserver run the command:
 *    node webServer.js
 *
 * Note that anyone able to connect to localhost:portNo will be able to fetch any file accessible
 * to the current user in the current directory or any of its children.
 *
 */

/********************************************************************************************/
/***************************************    SET UP     **************************************/
/********************************************************************************************/

/*** INFO: "require" statements are Node.js's version of import statements ***/
var async = require('async');
var session = require('express-session');
var bodyParser = require('body-parser');
var multer = require('multer');
var fs = require("fs");

// Load Express
var express = require('express');
var app = express();
// Note: change the parameter based on the ID of the app to be created.
const base = require('airtable').base('appJPPQ3jrkWhIwu2');

app.use(session({secret: 'secretKey', resave: false, saveUninitialized: false}));
app.use(bodyParser.json());

// We have the express static module (http://expressjs.com/en/starter/static-files.html) do all
// the work for us. This EXPORTS your current working directory that webServer.js is in. (__dirname)
app.use(express.static(__dirname));



/************************************************************************************************/
/*******************************     REST API Back End CALLS     ********************************/
/************************************************************************************************/
/*
 * Example #1: Simple GET Request
 * When making an AJAX GET request to the path '/', the web server responds with a simple message.
 */
app.get('/', function (request, response) {
    response.send('Simple web server of files from ' + __dirname);
});


/*
 * Example #2: GET Request Querying Airtable DB
 * This request retrieves full set of info of any entry in the designer table
 */
app.get('/designer/:id', function (request, response) {
  var id = request.params.id;
  base('Designers').find(id, function(err, record) {
    if (err) { response.status(404).end(err); return; }
    response.status(200).end(JSON.stringify(record));
  });
});

/*
 * Example #3: POST Request to create new Designers entry
 * This request uses query parameters to populate a new Designers object
 */
app.post('/designer', function (request, response) {
  var name = request.query.name;
  var furniture = request.query.furniture;
  var background = request.query.background;
  base('Designers').create({
    "Name": name,
    "Furniture": furniture,
    "Background": background
  }, function(err, record) {
      if (err) { response.status(404).end(err); return; }
      response.status(200).end("Successfully created user with ID " + record.getId());
  });
});

/*
 * Example #4: POST Request to update existing Designers entry
 * This request uses query parameter to identify entry to update, and updates
 * with  to populate a new Designers object
 */
app.post('/designer/:id', function (request, response) {
  var id = request.params.id;
  base('Designers').replace(id, {
    "Name": "Frank Gallow",
    "Furniture": "Desk",
    "Background": "Frank Gallow is a prisoner"
  }, function(err, record) {
    if (err) { response.status(404).end(err); return; }
    response.status(200).end("Successfully updated user record");
  });
});

/*
 * Example #5: DELETE Request to delete existing Designers entry
 * This request uses query parameters to identify which entry to delete
 */
app.delete('/designer/:id', function (request, response) {
  var id = request.params.id;
  base('Designers').destroy(id, function(err, deletedRecord) {
    if (err) { response.status(404).end(err); return; }
    response.status(200).end("Successfully deleted record");
  });
});

// DO NOT DELETE: Opens port for loading your webserver locally
var server = app.listen(3000, function () {
    var port = server.address().port;
    console.log('Listening at http://localhost:' + port + ' exporting the directory ' + __dirname);
});
