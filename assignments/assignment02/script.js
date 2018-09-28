const fs = require('fs');
const cheerio = require('cheerio');
const util = require('util')

// this is the file that we created in the starter code from last week
const content = fs.readFileSync('data/aa06.txt');

// load `content` into a cheerio object
const $ = cheerio.load(content);

// Class Address
  // House number (first word)
  // Street (everything else)
  // Junction in parantheses seperated by &amp; or 'and', Betw., Betw, Between, Btw. (maybe just first word)
  // entrance @
  // zipcode regex five numbers

class Address {
  constructor(number, street, junction, detail, zipcode) {
  this.number = 0;
  this.street = '';
  this.junction = [];
  this.detail = [];
  this.zipcode = 99999;
  }
}

let aa06Adresses = []; // this variable will hold the address objects

$('td').each(function(i, elem) {
  let myAddress = new Address;

  if ($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px') {

    //zip, just by regex
    let rZip = /[0-9]{5}/g;
    let mySearch = $(elem).html()
    myAddress.zipcode = mySearch.match(rZip);

    //"Enter" detail information, just by regex
    rZip = /(Enter.*)/gi;
    let patt = /\)|NY|<|@/i;
    if (mySearch.match(rZip)) {
      let tRes = mySearch.match(rZip)[0].split(patt)[0].trim();
      if (tRes.length > 5) {
        myAddress.detail.push(tRes);
      }
    };

    //"@" detail information, just by regex
    rZip = /(@.*)/gi;
    patt = /\)|NY|</i;
    if (mySearch.match(rZip)) {
      let tRes = mySearch.match(rZip)[0].split(patt)[0].replace("&amp;", "and").trim();
      if (tRes.length > 9) {
        // console.log(tRes);
        myAddress.detail.push(tRes);
      }
    };

    //House number and street, and catch junctions on this line too
    mySearch = $(elem).html().split("<br>")[2].trim().split(',')[0].replace("&amp;", "AND");

    // console.log(mySearch);

    // Test if first element of split by whitespace is number, if yes, this is the building number
    if (!isNaN(Number(mySearch.split(' ')[0]))) {
      myAddress.number = Number(mySearch.split(' ')[0]);
    }

    // Filter for additional information on this line by regex pattern
    patt = /[.,\/;:\-_]/g;

    if (patt.test(mySearch)) {
      myAddress.detail.push(mySearch.split(patt)[1]);
      if (mySearch.split(patt)[0].search("AND") != -1) {
        myAddress.junction.push(mySearch.split(patt)[0].split("AND")[0]);
        myAddress.junction.push(mySearch.split(patt)[0].split("AND")[1]);
      } else {
        let tStrArr = mySearch.split(patt)[0].split(' ')
        for (var i = 1; i < tStrArr.length; i++) {
          myAddress.street += tStrArr[i] + " ";
        }
        myAddress.street = myAddress.street.trim();
      }
    }
    else {
      tStrArr = mySearch.split(' ');
      for (var i = 1; i < tStrArr.length; i++) {
        myAddress.street += tStrArr[i] + " ";
      }
      myAddress.street = myAddress.street.trim();
    }


    // Junctions at line 4
    mySearch = $(elem).html().split("<br>")[3].trim();

    //Use regex to find the signifiers "Between" (and alternatives) and "and", "&amp;" and split the string at the right postions
    tStrArr = mySearch.split('NY')
    patt = /Between|Betw.|Betw|Btw.|Btw/i
    let par = /\(|\)|\./g;
    let and = /and|\&amp\;/g;

    // Find the junction street names, catch the detail information if there is any
    tJunctArr = tStrArr[0].replace(patt, "(").replace(par, '').replace("Bway", 'Broadway').replace("AAvenue", '').trim().split(and)
    if (tJunctArr.length > 1) {
      if (tJunctArr[1].search(",") != -1) {
        myAddress.detail.push(tJunctArr[1].split(",")[1].trim());
        myAddress.junction.push(tJunctArr[0].trim())
        myAddress.junction.push(tJunctArr[1].split(",")[0].trim())
      } else {
        myAddress.junction.push(tJunctArr[0].trim());
        myAddress.junction.push(tJunctArr[1].trim());
      }
    } else {
      // myAddress.detail = tJunctArr[0];
      // console.log(typeof myAddress.detail);
      if (myAddress.detail.indexOf(tJunctArr[0]) == -1) {
        myAddress.detail.push(tJunctArr[0]);
      }

    }

    // Find details in the street line, after the first comma
    for (var i = 1; i < 4; i++) {
      mySearch = $(elem).html().split("<br>")[2].trim().split(',')[i];

      rZip = /[0-9]{5}/g;
      if (mySearch) {
        if (!rZip.test(mySearch)){
          myAddress.detail.push(mySearch.trim());
          // console.log(mySearch.trim());
        }
      }
    }


    // Remove empty entries from the detail array
    for (var i = 0; i < myAddress.detail.length; i++) {
      if (myAddress.detail[i].length == 0) {
        myAddress.detail.splice(i,1);
      }
    }

    // console.log(myAddress);
    aa06Adresses.push(myAddress);
  }
});

fs.writeFileSync('data/aa06Adresses.json', JSON.stringify(aa06Adresses));
