require('dotenv').config()
var express = require('express'), // npm install express
    app = express();
const { Pool } = require('pg');
var AWS = require('aws-sdk');
const moment = require('moment-timezone'); // moment-timezone --save

// AWS RDS credentials
var db_credentials = new Object();
db_credentials.user = 'felixbuchholz';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'meetings';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;


// respond to requests for /aameetings
app.get('/aameetings', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var thisQuery = `SELECT addstreet as mtgaddress, locname as location,
                        json_agg(json_build_object('day', datday, 'time', dathour)) as meetings
                          FROM dates
                            JOIN meetings ON dates.datpk=meetings.meetdatefk
                            JOIN locations ON meetings.meetlocationfk=locations.locpk
                            JOIN groups ON meetings.meetgroupfk=groups.grouppk
                            JOIN addresses ON locations.locaddressfk=addresses.addpk
                          WHERE datday = 'Tuesday' AND dathour >= 1900
                          GROUP BY addstreet, locname
                      ;`;

// locpk, locname, locdetails, locwheelchair, locaddressfk
// addpk, addlat, addlong, addstreet, addcity, addzipcode, addzone, addapiaddress
// grouppk, groupname, groupdesc, groupsched,
// meetpk, meetgroupfk, meetdatefk, meetlocationfk
// datpk, datday, dathour, datstart, datend, dattype, datspecial

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});

// create templates
var hx = `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <title>Alcoholics Anonymous: Your next meeting in Manhattan</title>
  <meta name="description" content="Meetings of AA in Manhattan">
  <meta name="author" content="AA">
  <link href="https://fonts.googleapis.com/css?family=Raleway:400,400i,700,700i" rel="stylesheet">
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.3.4/dist/leaflet.css"
   integrity="sha512-puBpdR0798OZvTTbP4A8Ix/l+A4dHDD0DGqYW6RQ+9jxkRFclaxxQb/SJAWZfWAkuyeQUytO7+7N4QKrDh+drA=="
   crossorigin=""/>
  <link rel="stylesheet" href="css/map.css">
</head>
<body>
<h1>Alcoholics Anonymous: Your next meeting in Manhattan</h1>
<div id="mapid"></div>
<div id="note">Currently showing all meetings for the rest of the day</div>
<div id='reference'>Icon: Community by Wawan Hermawan</div>
  <script src="https://unpkg.com/leaflet@1.3.4/dist/leaflet.js"
   integrity="sha512-nMMmRyTVoLYqjP9hrbed9S+FzjZHW5gY1TWCHA5ckwXZBadntCNs8kEqAWdrb9O7rxbCaA4lKTIWjDXZxflOcA=="
   crossorigin=""></script>
  <script>
  var data =
  `;

var jx = `;
    </script>
    <script type="text/javascript" charset="utf-8" src="script/aamap.js"></script>
    </body>
    </html>`;

// respond to requests for /aameetings
app.get('/aa', function(req, res) {

    var now = moment.tz(Date.now(), "America/New_York").format('dddd,HH');
    // var now = new Date(Date.now());
    // console.log(now);
    // var week = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
    // var dayy = week[now.getDay()].toString();
    // var hourr = (now.getHours()*100);
    var dayTimeArr = now.split(',');
    var dayy = dayTimeArr[0];
    var hourr = dayTimeArr[1]*100
    console.log(dayy);
    console.log(hourr);

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);

    // SQL query
    var thisQuery = `SELECT addlat as lat, addlong as lon, json_agg(json_build_object('loc', locname, 'address', addstreet, 'time', datstart, 'name', groupname, 'day', datday, 'types', dattype, 'shour', dathour)) as meetings
                FROM dates
                  JOIN meetings ON dates.datpk=meetings.meetdatefk
                  JOIN locations ON meetings.meetlocationfk=locations.locpk
                  JOIN groups ON meetings.meetgroupfk=groups.grouppk
                  JOIN addresses ON locations.locaddressfk=addresses.addpk
                  WHERE datday = '` + dayy + `' AND dathour >= ` + hourr +
                 `GROUP BY addlat, addlong
                 ;`;

    client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            var resp = hx + JSON.stringify(qres.rows) + jx;
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
});



// respond to requests for /deardiary
app.get('/deardiary', function(req, res) {
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();

    var params = {
        TableName : "deardiary",
        KeyConditionExpression: "series = :series and #sq = :sequence", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#sq" : "sequence"
        },
        ExpressionAttributeValues: { // the query values
            ":series": {N: "0"},
            ":sequence": {N: "0"}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            res.send(data.Items);
            console.log('3) responded to request for dear diary data');
        }
    });

});
var myData = [];
var checkSeries = 0;
app.get('/dd', function(req, res) {
    //console.log(req.query.ser, req.query.seq);
    var series = req.query.ser;
    // var sequence = req.query.seq;
    
    if (series == 0) {
      myData = [];
      checkSeries = 0;
    }
    
    // AWS DynamoDB credentials
    AWS.config = new AWS.Config();
    AWS.config.accessKeyId = process.env.AWS_ID;
    AWS.config.secretAccessKey = process.env.AWS_KEY;
    AWS.config.region = "us-east-1";

    // Connect to the AWS DynamoDB database
    var dynamodb = new AWS.DynamoDB();
    
    var params = {
        TableName : "deardiary",
        KeyConditionExpression: "series = :series", // the query expression
        // ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            // "#sq" : "sequence"
        // },
        ExpressionAttributeValues: { // the query values
            ":series": {N: `${series}`}
            // ":sequence": {N: `${sequence}`}
        }
    };

    dynamodb.query(params, function(err, data) {
        if (err) {
            console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
        }
        else {
            if (series == checkSeries) {
              myData.push(data.Items)
              checkSeries++;
            }
            var resp = d1x + JSON.stringify(myData) + d2x;
            console.log(resp)
            res.send(resp);
            console.log('3) responded to request for dear diary data');
        }
    });

});

var d1x = `<!DOCTYPE html>
<html lang="en" dir="ltr">
  <head>
    <meta charset="utf-8">
    <link rel="stylesheet" href="css/diary.css">
    <title>Dear Judith</title>
  </head>
  <body>
    <script type="text/javascript">
      var data =`;
      
var d2x = `;
    </script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script type="text/javascript" charset="utf-8" src="script/diary.js"></script>
  </body>
</html>`;


// respond to requests for /sensor
app.get('/sensor', function(req, res) {

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    var ydd = moment.tz(Date.now(), "America/New_York").format('D');
    var ydm = moment.tz(Date.now(), "America/New_York").format('M');
    console.log(ydd, ydm);
    // SQL query
    var q = `SELECT * FROM sensorData
              WHERE day ='${ydd}' AND month ='${ydm}';`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
            client.end();
            console.log('1) responded to request for sensor data');
        }
    });
});

var s1x = `<!DOCTYPE html>
<html>
	<head>
		<meta charset=utf-8>
		<title>Laptop Wanderlust</title>
		<link href="https://fonts.googleapis.com/css?family=Lato:100,300" rel="stylesheet">
		<link rel="stylesheet" href="css/sensor.css">
	</head>
	<body>
		<script>
		var data =`;

var s2x = `;
    var date =`;

var s3x = `;
    </script>
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="script/three.js"></script>
    <script src="script/OrbitControls.js"></script>
    <script src="script/my3d.js"></script>
    <script src="script/sensorInterface.js"></script>
  </body>
</html>`;

app.get('/ss', function(req, res) {
  
    var offset = req.query.off;

    // Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    var d = new Date();
    d.setDate(d.getDate() - offset);

    var ydd = moment.tz(d, "America/New_York").format('D');
    var ydm = moment.tz(d, "America/New_York").format('M');
    var myDate = [moment.tz(d, "America/New_York").format('dddd, MMMM Do YYYY'), d];
    console.log(ydd, ydm);
    // SQL query
    var q = `SELECT * FROM sensorData
              WHERE day ='${ydd}' AND month ='${ydm}';`;

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            var resp = s1x + JSON.stringify(qres.rows) + s2x + JSON.stringify(myDate) + s3x;
            res.send(resp);
            client.end();
            console.log('1) responded to request for sensor graph');
        }
    });
});

// serve static files in /public
app.use(express.static('public'));

// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...');
});
