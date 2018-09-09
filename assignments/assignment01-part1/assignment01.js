// Data Structures, Assignment 1, Felix Buchholz

var request = require('request');
var fs = require('fs');

function getAllMeetings (n, callback) {
  for (var i = 1; i <= n; i++) {
    i = (i < 10) ? i = '0' + i : i;
    var myRequestString = `https://parsons.nyc/aa/m${i}.html`;
    var myFilePath = `data/aa${i}.txt`;
    callback(myRequestString, myFilePath);
  };
}

function requestAndStore (myRequestString, myFilePath) {
  request(myRequestString, function(error, response, body){
      if (!error && response.statusCode == 200) {
          fs.writeFileSync(myFilePath, body);
      }
      else {console.log("Request failed!")}
  });
}

getAllMeetings(10, requestAndStore);
