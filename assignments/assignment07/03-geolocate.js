// Installed the dotenv package to permanently store my API key in a .env file.
// Then made sure that git ignores that file by using a .gitignore file
require('dotenv').config()
// The content of the .env file is accessible through "process" (is this an object?)
var apiKey = process.env.TAMU_KEY;

// Other require definitions
var request = require('request'); // npm install request
var async = require('async'); // npm install async
var fs = require('fs');



// I’m just using the addresses array this point, because I wanted to keep the data I grabbed from the parsing my text file and add the tamuGeo data to that.
let addresses = fs.readFileSync('data/parsed/parsed-addressTable.json');
// let addresses = fs.readFileSync('../data/test.json');
addresses = JSON.parse(addresses);
// addresses = [addresses[196], addresses[197]];
// console.log(addresses);


// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {
  // console.log(value);

/*
//previous console.log to check if the request strings are correct
  if (value.street == '') {
    console.log('streetAddress=' + value.junction[0].split(' ').join('%20') + '%20and%20' + value.junction[1].split(' ').join('%20'));
  } else {
    console.log('streetAddress=' + value.number + '%20' + value.street.split(' ').join('%20'));
  }
*/
    // First part of the request string
    var apiRequest = 'https://geoservices.tamu.edu/Services/Geocode/WebService/GeocoderWebServiceHttpNonParsed_V04_01.aspx?';

    // Small adjustment according to my json object structure
    apiRequest += 'streetAddress=' + value.street.replace('58-66', '58').replace('206-208', '206').replace('’', '').split(' ').join('%20');


    apiRequest += '&city=New%20York&state=NY&zip=' + value.zipcode + '&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            // Log if the request was successful
            console.log(tamuGeo['FeatureMatchingResultType']);
            // adding only the data, I want from the request result, OutputGeocodes is an array, the result is in the first element, I store Latitude and Longitude.
            value['tamuAddress'] = tamuGeo.InputAddress['StreetAddress'].trim();
            value['lat'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Latitude'];
            value['long'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Longitude'];
            console.log(value.long, value.lat, value.tamuAddress);
        }
    });
    setTimeout(callback, 250);

}, function() {
    // Changed the line below, because I’m only working with my JSON array "addresses"
    fs.writeFileSync('data/parsed/parsed-geolocated-addressTable.json', JSON.stringify(addresses, null, 2));
    //Addresses.length wouldn’t change it’s length throughout the program so I would have to implement a new control structure, I’m fine with a "the job is done" message for now.
    console.log('*** *** *** *** ***');
    console.log('Finished');
});
