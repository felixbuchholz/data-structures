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
const client = new Client(db_credentials);
client.connect();

// var thisQuery = "SELECT lat, long, street, zipcode FROM addresses WHERE zone>1;";

var thisQuery =
"SELECT lat, long, street, wheelchairaccess, locations.pk " +
"FROM addresses " +
"INNER JOIN locations ON locations.addressFK=addresses.pk " +
"WHERE zone=6 AND wheelchairaccess=true;";

client.query(thisQuery, (err, res) => {
    if (err) {throw err}
    else {
        console.table(res.rows);
        client.end();
    }
});
