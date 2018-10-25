const request = require('request'),
fs = require('fs');

function getAllMeetings (n, callback) {
  for (var i = 1; i <= n; i++) {
    i = (i < 10) ? i = '0' + i : i;
    var myRequestString = `https://parsons.nyc/aa/m${i}.html`;
    var myFilePath = `data/text/aa-meetings${i}.txt`;
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
