require('dotenv').config()
const { Client } = require('pg');

// AWS RDS POSTGRESQL INSTANCE
var db_credentials = new Object();
db_credentials.user = 'felixbuchholz';
db_credentials.host = 'my-postgresql.cpkdennqaxcs.us-east-1.rds.amazonaws.com';
db_credentials.database = 'meetings';
db_credentials.password = process.env.AWSRDS_PW;
db_credentials.port = 5432;

// Connect to the AWS RDS Postgres database
const client = new Client(db_credentials);
client.connect();

// Sample SQL statement to create a table: 
// var thisQuery = "DROP TABLE sensorData";
// var thisQuery = "CREATE TABLE sensorData (q varchar(622));";
// var thisQuery = "CREATE TABLE sensorData (year smallint, month smallint, day smallint, hour smallint, min smallint, xmini smallint, xmaxi smallint, ymini smallint, ymaxi smallint, zmini smallint, zmaxi smallint);";

// var thisQuery = "SELECT * FROM sensorData;"; // print all values
// var thisQuery = "SELECT COUNT (*) FROM sensorData;"; // print the number of rows
 var thisQuery = "SELECT day, COUNT (*) FROM sensorData GROUP BY sensorData.day;"; // print the number of rows for each sensorValue

client.query(thisQuery, (err, res) => {
    console.log(err, res);
    client.end();
});

/*
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
*/