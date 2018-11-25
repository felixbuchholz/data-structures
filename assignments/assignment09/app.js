require('dotenv').config()
var moment = require('moment-timezone');
var request = require('request');
var async = require('async');
const { Client } = require('pg');

// PARTICLE PHOTON
var device_id = process.env.PHOTON_ID;
var access_token = process.env.PHOTON_TOKEN;
var particle_variable = 'q1';
var device_url = 'https://api.particle.io/v1/devices/' + device_id + '/' + particle_variable + '?access_token=' + access_token;

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'felixbuchholz';
db_credentials.host = process.env.AWSRDS_EP;
db_credentials.database = 'meetings';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

var getAndWriteData = function() {
    
    // Make request to the Particle API to get sensor values
    request(device_url, function(error, response, body) {
        
        // Store sensor value(s) in a variable
        var sv = JSON.parse(body).result;
        console.log(response);
        // Convert 1/0 to TRUE/FALSE for the Postgres INSERT INTO statement
        // var sv_mod; 
        // console.log('––––')
        // console.log(sv);
        // console.log('––––')
        
        
        const minArr = sv.split(',');
        // console.log(minArr);
        let minObjArr = [];
        minArr.forEach((min, i) => {
            let minObj = {};
            const timeAndValues = min.split(' ');
            let date = new Date(timeAndValues[0]*1000);
            date = moment.tz(date, "America/New_York").format();
            const dateAndTime = date.split('T');
            const dateArr = dateAndTime[0].split('-'); // 2018-11-23
            const timeArr = dateAndTime[1].split('-')[0].split(':'); // 22:13:04
            minObj['date']  = date;
            minObj['year']  = dateArr[0];
            minObj['month'] = dateArr[1];
            minObj['day']   = dateArr[2];
            minObj['hour']  = timeArr[0];
            minObj['min']   = timeArr[1];
            minObj['xmin']  = timeAndValues[1];
            minObj['xmax']  = timeAndValues[2];
            minObj['ymin']  = timeAndValues[3];
            minObj['ymax']  = timeAndValues[4];
            minObj['zmin']  = timeAndValues[5];
            minObj['zmax']  = timeAndValues[6];
            minObjArr.push(minObj);
        });
        
        /*
        // Connect to the AWS RDS Postgres database
        const client = new Client(db_credentials);
        client.connect();

        // Construct a SQL statement to insert sensor values into a table
        
        var thisQuery = "INSERT INTO sensorData VALUES (E'" + sv + "');";
        console.log(thisQuery); // for debugging

        // Connect to the AWS RDS Postgres database and insert a new row of sensor values
        client.query(thisQuery, (err, res) => {
            console.log(err, res);
            client.end();
        });
        */
        
        async.eachSeries(minObjArr, function(min, callback) {
            const client = new Client(db_credentials);
            client.connect();
            var thisQuery = "INSERT INTO sensorData VALUES (" + min.year + ", " + min.month + ", " + min.day + ", " + min.hour + ", " + min.min + ", " + min.xmin + ", " + min.xmax + ", " + min.ymin + ", " + min.ymax + ", " + min.zmin + ", " + min.zmax + ");";
            client.query(thisQuery, (err, res) => {
                console.log(err, res);
                client.end();
            });
            setTimeout(callback, 500); 
        }); 
    });
};

// write a new row of sensor data every fourteen minutes
setInterval(getAndWriteData, 840000); //840000

/*
async.eachSeries(addressesForDb, function(value, callback) {
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = "INSERT INTO aalocations VALUES (E'" + value.address + "', " + value.latLong.lat + ", " + value.latLong.lng + ");";
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 1000); 
}); 
*/