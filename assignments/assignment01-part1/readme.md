---
title: "Assignment 1"
author: Felix Buchholz
---

Felix Buchholz
MS Data Visualization @ Parsons NYC, Fall 2018, Data Structures, Aaron Hill

[TOC]

# Assignment 1

## Assignment description
> 1. Using Node.js (in Cloud 9), make a request for each of the ten "Meeting List Agenda" pages for Manhattan. Important: show the code for all ten requests.

    > https://parsons.nyc/aa/m01.html
    > https://parsons.nyc/aa/m02.html
    > https://parsons.nyc/aa/m03.html
    > https://parsons.nyc/aa/m04.html
    > https://parsons.nyc/aa/m05.html
    > https://parsons.nyc/aa/m06.html
    > https://parsons.nyc/aa/m07.html
    > https://parsons.nyc/aa/m08.html
    > https://parsons.nyc/aa/m09.html
    > https://parsons.nyc/aa/m10.html

> 2. Using Node.js: For each of the ten files you requested, save the body as a text file to your "local" environment (either on your own laptop or in AWS Cloud9).

> 3. Study the HTML structure and tags and begin to think about how you might parse these files to extract relevant data for these AA meetings.

> 4. Update your GitHub repository with the relevant files: your js file and ten txt files. In Canvas, submit the URL of the specific location of this work within your data-structures GitHub repository.

### Starter code

```javascript
// npm install request
// mkdir data

var request = require('request');
var fs = require('fs');

request('https://parsons.nyc/thesis-2018/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
```

## My approach

### 1. Prerequisites

Looking at the starter code there’s a hint on the first line already suggesting to work with a node.js:

```js
// npm install request
```

npm is the node.js package manager. Since I’m working on my local envrionment, I make sure I have node.js installed.

```console
$ node --version
v10.9.0
```

The comment on the second line suggests that the ten text files resulting from the request should be saved into a seperate directory named “data”. I change into the assignment directory with the “cd” command and create a new directory with the “mkdir” command.

```console
$ pwd
$ cd path/to/assignment-directory
$ mkdir data
```

Line 4 and 5 assign a variable to the _require_ function of node.js loading two modules: request and fs (short for file system). To have them available for our program, I install both of them in the root directory of my assignment directory:

```console
$ npm install request
$ npm install fs
```

###### Short introduction to node.js & npm

In my very own words I would describe node.js as an environment that replaces the Browser environment for JavaScript code to run independently of a website. With the node package manager _npm_ you can install additional packages, like _request_ and _fs_ to expand it’s core funcionality. After installing packages via

```console
$ npm install packagename
```

make sure to reference them in your code. Usually this is done by assigning a variable to the require method:

```javascript
var package = require('package');
```

### 2. Trying to understand the request

This is the first time for me programming a http request. Looking at the request code I try to identify what the code does and how I can adjust it for my purpose.

```javascript
request('https://parsons.nyc/thesis-2018/', function(error, response, body){
    if (!error && response.statusCode == 200) {
        fs.writeFileSync('/home/ec2-user/environment/data/thesis.txt', body);
    }
    else {console.log("Request failed!")}
});
```

##### Here request takes two parameters:

1. **A string holding the url information,** _**that’s obviously the place where I want to include the links to the AA meeting pages later.** (A)_
2. A callback function taking another three parameters:
    1. error, is boolean variable testing if an error in the request occurs
    2. response, is the object returned by the http request
        - response.statusCode = 200, indicates a successful http request
    3. body, is the DOM object that I want to retrieve

##### In the function definition there is an if-else-statment

This is simply checking if no error is returned (!error) **and** (indicated by **\&\&**) if the statusCode of the response object indicates a successful request (response.statusCode = 200).

- If this test returns **false** the program skips to the else statement and receive a console log that the request failed.
- If it tests **true** the writeFileSync method of the fs package is executed with two parameters:
  1. **A string holding the file path and file name to write** _**that I can adjust for my own request** (B)_ and
  2. The parameter body which is the DOM object the program requests from the site.

### 3. My first attempt

Now that I have the two strings to modify I want to change these according to the assignment. If I change (A) to _'https://parsons.nyc/aa/m01.html'_ and (B) to _'data/aa01.txt';_ I already have a working solution for the first request. As suggested in class a simple but tedious way to solve the whole ten requests would be to copy the request ten times and modify (A) and (B) each time accordingly.

**But** I could also write code that modifies the strings for me. For example by using a for-loop that iterates from 1 to 10 and defines the variables _myRequestString_ and _myFilePath_:

```javascript
for (var i = 1; i <= 10; i++) {
  if (i < 10) {
      var myRequestString = 'https://parsons.nyc/aa/m0' + i + '.html';
  } else {
      var myRequestString = 'https://parsons.nyc/aa/m' + i + '.html';
  }
  var myFilePath = 'data/aa' + i + '.txt';
};
```
Here the if-else-statement is necessary because of the leading zero in the first nine request urls.
If I want a direct correlation between the request path and the file name and want to be a bit more concise I can also rewrite this to:

```javascript
for (var i = 1; i <= 10; i++) {
  i = (i < 10) ? i = '0' + i : i;
  var myRequestString = `https://parsons.nyc/aa/m${i}.html`;
  var myFilePath = `data/aa${i}.txt`;
};
```

Now I can replace the strings in the request with my variables.

```javascript
request(myRequestString, …{ //<- the url string is now a my variable
    if (…) {
        fs.writeFileSync(myFilePath, body); // <- the file path is now my variable
    }
    else {…}
});
```

###### Pitfall: Synchronous and asynchronous execution of code

It is tempting to include this request into the for loop and of course that’s what I did, too. It gave me a small headache why my code would only output one single text file every time I executed it. I logged my variables on different lines of the code over and over again and slowly realized, that the string was already modified ten times, when the request was only executed once. Fortunately we have been talking about synchronous and asynchronous execution of code in class so I concluded that my request was too slow to keep up with asynchronous JavaScript that doesn’t wait until the request is fulfilled and instead keeps on iterating over the loop.

I was lucky that my first attempt to solve this problem was already successful even though I didn’t understand completely why at first. Instead of including the request directly in the for loop I defined a function _requestAndStore_ taking my two variables as parameters:

```javascript
function requestAndStore (myRequestString, myFilePath) { //<- my variables are defined as parameters of that function
  request(myRequestString, …{
      if (…) {
          fs.writeFileSync(myFilePath, body);
      }
      else {…}
  });
  });
```

Now I can add a function call in my for-loop.

```javascript
for (var i = 1; i <= 10; i++) {
  i = (i < 10) ? i = '0' + i : i;
  var myRequestString = `https://parsons.nyc/aa/m${i}.html`;
  var myFilePath = `data/aa${i}.txt`;
  requestAndStore(myRequestString, myFilePath);
};
```

And without being an expert on what happens exactly while this code is executed, I think I can explain why this version works instead of the previous one: Now on every iteration of the loop the two variables are created and one call of the _requestAndStore_ function is added to let’s say the ToDo-list of JavaScript. Even if this ToDo takes some time it’s still on the list until it’s resolved. In the meantime JavaScript continues iterating over the loop, adding more requests to the list while simultaneously working on the requests already on the list. The program is only finished after all it iterated over the whole loop and resolving all the requests.

The whole code now looks like this:

```javascript
var request = require('request');
var fs = require('fs');

for (var i = 1; i <= 10; i++) {
  i = (i < 10) ? i = '0' + i : i;
  var myRequestString = `https://parsons.nyc/aa/m${i}.html`;
  var myFilePath = `data/aa${i}.txt`;
  requestAndStore(myRequestString, myFilePath);
};

function requestAndStore (myRequestString, myFilePath) {
  request(myRequestString, function(error, response, body){
      if (!error && response.statusCode == 200) {
          fs.writeFileSync(myFilePath, body);
      }
      else {console.log("Request failed!")}
  });
}
```

### 4. One step further: callbacks and promises

If I add one level of abstraction and refactor the for loop as a function, it might be more obvious that what happens is essentially a callback: I could define the requestAndStore as a callback function to this function and prepare the program to handle for example more than 10 requests:

```javascript
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
```

A callback is one way to structure the asynchronous execution of code, but there are several ways to handle requests like this: **callbacks**, **promises** and packages like **async**. For practice I later would like to refactor the program according to these different approaches. As a good source for later reference for myself I want to leave this article here:  [Nwamba (2017)](https://scotch.io/courses/10-need-to-know-javascript-concepts/callbacks-promises-and-async)

### 5. How to continue working with the retrieved files

Without knowing yet which would be the best programmatic tool to parse the html file, I would try to describe the process as follows:

1. In the text files **the event descriptions are surrounded by \<tr>\</tr> tags**, these are the parent elements holding the information I might want to use, all other elements are quite irrelevant
2. Inside there are **three \<td> child elements**
    1. **The first \<td> cild contains:**
        1. A \<h4> tag with the _location’s name_
        2. A \<b> tag with the _title of the event_
        3. A \<div> tag containing _further information on the location_
        4. \<br /> tags are used for formatting
    2. **The second \<td> cild contains** one or more sequences as follows (here the order is more important):
        1. First \<b> tag surrounding _the day of the week_ of the meeting + the string 'From'
        2. The _starting time_, untagged
        3. Second \<b> tag surrounding the string 'to'
        4. The _ending time_, untagged
        5. A \<br /> tag
        6. Third \<b> tag surrounding the string 'Meeting Type'
        7. The _type of meeting_, untagged
        8. **Two \<br />** tags, which can be used as a _separator identifier_. When I separate the data at this double break, I could then loop over the sequences, since there can be more then one meeting for each event.
    3. **The third \<td> child contains** a _meeting id_ that might be helpful so I would do a regex search in this child element to get the four numbers following the string 'meetingid=', probably 'id=' would be sufficient.


## References

Nwamba, C. (2017, October 9). Callbacks, Promises, and Async. Retrieved September 9, 2018, from https://scotch.io/courses/10-need-to-know-javascript-concepts/callbacks-promises-and-async
