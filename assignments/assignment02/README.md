Felix Buchholz
MS Data Visualization @ Parsons NYC, Fall 2018, Data Structures, Aaron Hill

# Assignment 2

## Assignment description
>We will continue to work with the files you collected in Weekly Assignment 1. For this week, you will work with only one of the files; it will be determined by the last number of your New School ID. The last number of your ID corresponds with the AA Manhattan "zone" you are assigned. For example, if your ID is "N01234567", work with the Zone 7 file. If it is "N09876543", work with the Zone 3 file. If the last number of your New School ID ends with a "0", work with the Zone 10 file. (At the bottom of this markdown file, there's an image showing the map of the zones in Manhattan.)
>
> 1. Using Node.js, read the assigned AA text file that you wrote for last week's assignment. Store the contents of the file in a variable.
>
> 2. Ask yourself, "why are we reading this from a saved text file instead of making another request?"
>
> 3. Study the HTML structure of this file and began to think about how you might parse it to extract the relevant data for each meeting. Using this knowledge about its structure, write a program in Node.js that will write a new text file that contains the street address for every meeting in your assigned AA file. Make a decision about the data types and data structures you want to use to store this data in a file, knowing that you'll be working with this data again later.
>
> 4. Update your GitHub repository with the relevant file(s); this should include a .js file(s) with your code and a .txt or other format file(s) with the addresses. In Canvas, submit the URL of the specific location of this work within your data-structures GitHub repository. Note: this should be in a directory that contains only your work for this week.

## My approach

### 0.
My zone is "6"

### 1. Loading the file with fs and cheerio and store it in a variable.
I copied my aa06.txt file from the last assignment into the new folder structure for assignment 2 (instead of referencing it with "../").
As the starter code suggests I installed the npm package cheerio and used fs and cheerio to store it in a variable.

### 2. Why not making another request?
I think it is safer and faster to safe the text file form the initial request and use it to create our dataset. We don’t need to wait for a response of the original web server and we don’t have to deal with the risk that it might be down and inaccessible.

### 3.1. Basic functionality to get the street information

```javascript
//This is NOT working code, just an illustration of the main concept

// Prerequisites for JSON
class Address { // A class for the information I want to store
  constructor(number, street, junction, detail, zipcode) {
  //(…)
  this.street = '';
  // (…)
  }
}
let aa06Adresses = []; // this variable will hold the address objects

// Parsing the text file
$('td').each(function(i, elem) { // loop through all the td elements

  let myAddress = new Address;
    // create a new instance of the Address class

  if ($(elem).attr('style') == 'border-bottom:1px solid #e3e3e3; width:260px') {
    // It turned out, the container td for the location information all have the same style attribute, that I select here

    myAdress.street.push($(elem).html().split("<br>")[2].trim().split(',')[0]);
      // I modify the td element here
      // to get only the line after the second break,
      // splitting the string by ","
      // and choosing the first element of the array
      // already gives a quite satisfying result for the street
      // in my final code I tried to clean up this result
      // and also incorporate the other information about the data
  }

  aa06Adresses.push(myAddress);
    // Adding the address object to the array of addresses
    // in each iteration.
}

// Storing the result to a JSON file
fs.writeFileSync('data/aa06Adresses.json', JSON.stringify(aa06Adresses));
```

### 3.2. Short description of what I did after

I tried to parse the text for all the location information in the text (number, street, junction, detail, zipcode). I used regular expressions for the zip code and detail descriptions like "Enter on …" or "@ …". For the junctions and streets I used different combinations and delimiters to get the right strings.

The JSON file is still not perfect, but at that point I wondered if the last gaps and mistakes would not be better filled in by hand, instead of writing code for every exception.



Sorry for the short description, I spent more time on the code and I tried to also roughly comment the code.
I came across "object" logs in my console that I couldn’t unravel, neither with JSON.stringify() nor with the util package, maybe you could show us in class, what to do in this case.
