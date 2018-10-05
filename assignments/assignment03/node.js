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
let addresses = fs.readFileSync('../data/aa06AddressesGeo.json');
// let addresses = fs.readFileSync('../data/test.json');
addresses = JSON.parse(addresses);
// console.log(addresses);

// eachSeries in the async module iterates over an array and operates on each item in the array in series
async.eachSeries(addresses, function(value, callback) {

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
    //Correction for assignment 4: fill in the address after look up on google maps
    // Test if the address is only a junction, if yes, add the zip code to increase specificity of the request.
    if (value.street == '') {
      value.number = 4;
      value.street = 'West 76th Street';
    }
    /*
    if (value.street == '') {
      apiRequest += 'streetAddress=' + value.junction[0].split(' ').join('%20') + '%20and%20' + value.junction[1].split(' ').join('%20') + '&zip=' + value.zip;
    }
    */
    // Small adjustment according to my json object structure
    apiRequest += 'streetAddress=' + value.number + '%20' + value.street.split(' ').join('%20');


    apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
    apiRequest += '&format=json&version=4.01';

    request(apiRequest, function(err, resp, body) {
        if (err) {throw err;}
        else {
            var tamuGeo = JSON.parse(body);
            // Log if the request was successful
            // console.log(tamuGeo['FeatureMatchingResultType']);
            // adding only the data, I want from the request result, OutputGeocodes is an array, the result is in the first element, I store Latitude and Longitude.
            value['tamuAddress'] = tamuGeo.InputAddress['StreetAddress'];
            value['latitude'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Latitude'];
            value['longitude'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Longitude'];
            console.log(value.longitude, value.latitude);
        }
    });
    setTimeout(callback, 700);

}, function() {
    // Changed the line below, because I’m only working with my JSON array "addresses"
    fs.writeFileSync('aa06AddressesGeo.json', JSON.stringify(addresses));
    //Addresses.length wouldn’t change it’s length throughout the program so I would have to implement a new control structure, I’m fine with a "the job is done" message for now.
    console.log('*** *** *** *** ***');
    console.log('Finished');
});
