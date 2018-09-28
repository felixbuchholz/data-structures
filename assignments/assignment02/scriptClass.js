var fs = require('fs');
var cheerio = require('cheerio');

// load the thesis text file into a variable, `content`
// this is the file that we created in the starter code from last week
var content = fs.readFileSync('data/aa06.txt');

// load `content` into a cheerio object
var $ = cheerio.load(content);

// print (to the console) names of thesis students
$('td').each(function(i, elem) {
    if ($(elem).attr("style" == 'border-bottom:1px solid #e3e3e3; width:260px')) {

    }
    console.log($(elem).html().split("<br>")[2].);
});


// write the project titles to a text file
// var thesisTitles = ''; // this variable will hold the lines of text
//
// $('.project .title').each(function(i, elem) {
//     thesisTitles += ($(elem).text()) + '\n';
// });
//
// fs.writeFileSync('data/thesisTitles.txt', thesisTitles);
