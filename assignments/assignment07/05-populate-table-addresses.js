require('dotenv').config()
const async = require('async');
const fs = require('fs');
const { Client } = require('pg')

// Global
var addressesForDb;
  // Timeout setting for the SQL row insert
var myPopTimer = 300;

  // AWS RDS POSTGRESQL INSTANCE
let db_credentials = new Object();
db_credentials.user = 'felixbuchholz';
db_credentials.host = 'my-postgresql.cpkdennqaxcs.us-east-1.rds.amazonaws.com';
db_credentials.database = 'meetings';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;
// const client = new Client(db_credentials);

var addressesForDb = JSON.parse(fs.readFileSync('data/parsed/parsed-geolocated-addressTable.json'))

async.eachSeries(addressesForDb, function(value, callback) {
    console.log(parseFloat(value.long));
    const client = new Client(db_credentials);
    client.connect();
    var thisQuery = `INSERT INTO addresses VALUES ('${value.addressPK}', '${parseFloat(value.lat)}', '${parseFloat(value.long)}', '${value.street}', '${value.city}', '${value.zipcode}', '${value.zone}', '${value.tamuAddress}');`;
    client.query(thisQuery, (err, res) => {
        console.log(err, res);
        client.end();
    });
    setTimeout(callback, 150);
});
