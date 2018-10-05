// Require
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

// *** FUNCTIONS ***

// Load Data
let loadDataset = () => {
  addressesForDb = JSON.parse(fs.readFileSync('../data/aa06AddressesGeo.json'))
};

// QUERIES
let queryTable = (queryString) => {
  client.connect();
  client.query(queryString, (err, res) => {
      console.log(err, res);
      client.end();
  });
}
  // Frequent queries shortcut
let findQuery = (myOp, myTable) => {
  if (myOp == 'create') {
    return `CREATE TABLE ${myTable} (address varchar(100), num smallint, street varchar(90), junctiona varchar(70), junctionb varchar(70), detail varchar(100), zipcode varchar(10), lat double precision, long double precision);`;
  } else if (myOp == 'all') {
    return `SELECT * FROM ${myTable};`
  } else if (myOp == 'delete') {
    return `DROP TABLE ${myTable};`
  } else if (myOp == 'count') {
    return `SELECT COUNT(*) FROM ${myTable};`
  }
}
    // Delete AA table shortcut
let deleteAATable = () => {
  queryTable(findQuery('delete', 'aageoaddresses'));
}

// Populate Table with data
let populateTable = (myTable) => {
  async.eachSeries(addressesForDb, function(value, callback) {
      client.connect();
      var thisQuery = `INSERT INTO ${myTable} (address, num, street, junctiona, junctionb, detail, zipcode, lat, long) VALUES ('${value.tamuAddress.trim()}', '${value.number}', '${value.street}', '${value.junction[0]}', '${value.junction[1]}', '${value.detail.join(' ')}', '${value.zipcode}', '${value.latitude}', '${value.longitude}');`;
      client.query(thisQuery, (err, res) => {
          console.log(err, res);
          client.end();
      });
      console.log("*** *** *** ***");
      setTimeout(callback, myPopTimer);
  });
}

//Check row count on Table by comparison to the original data
let checkTable = (myTable) => {
  console.log('\n\n-------important!--------- \nTable check:\n\nThe length of the loaded data was was: ' + addressesForDb.length);
  console.log('The number of rows in the table is: ');
  queryTable(findQuery('count', myTable));
}

// Async series

let myAsync = () => {

  async.series({
      // 1
      loadData: (callback) => {
        setTimeout(function(){
              loadDataset()
              callback(null, 1); // See control flow example: https://github.com/caolan/async/blob/v1.5.2/README.md#control-flow-1
          }, 500);
      },
      // 2
      createTable: (callback) => {
        setTimeout(function(){
              console.log('\n*** Data loaded ***\n');
              queryTable(findQuery('create', 'aageoaddresses'));
              callback(null, 2);
          }, 1500);
      },
      // 3
      populateTable: (callback) => {
        setTimeout(function(){
            console.log('\n*** Table created ***\n');
              populateTable('aageoaddresses');
              callback(null, 3);
            }, 2500);
      },
      // 4
      checkTable: (callback) => {
        setTimeout(function(){
              console.log('\n*** Table populated ***\n');
              checkTable('aageoaddresses');
              callback(null, 4);
          }, myPopTimer*addressesForDb.length+(myPopTimer*2)); // Time for all inserts, according to the dataset length
      }

  },
  function(err, results) {
  });
}

// Finally execute this to run the whole show
myAsync();


/* Functions to uncomment for trouble-shooting: */

// setTimeout(function(){
//       loadDataset()
//       // console.log('Data loaded');
//       populateTable('aageoaddresses');
//   }, 1000);
// checkTable('aageoaddresses');
// deleteAATable();
// queryTable(findQuery('all', 'aageoaddresses'));
// queryTable("SELECT COUNT(*) FROM aageoaddresses")
