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

// Sample SQL statement to create a table:
var thisQuery = "CREATE TABLE dates (pk smallint, day varchar(20), starting varchar(20), ending varchar(20), meetingType varchar(10), specialInterest varchar(100));";
// Sample SQL statement to delete a table:
// var thisQuery = "DROP TABLE dates;";
// Sample SQL statement to query the entire contents of a table:
// var thisQuery = "SELECT * FROM dates;";

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});
