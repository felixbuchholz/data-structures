Felix Buchholz
MS Data Visualization @ Parsons NYC, Fall 2018, Data Structures, Aaron Hill

# Assignment 9

[Link](https://github.com/visualizedata/data-structures/tree/master/assignments/weekly_assignment_10) to the assignment description.

For this assignment I set up a express/node server application. In this case the structure consists of two files: a server.js file that uses node and the package express to serve requests over http and a index.html file that provides the html frame to navigate the three different projects / paths.

```
.
+-- public
|   +-- index.html
+-- server.js
```

I used the same structure as in the assignment description. I think this convention is useful to keep everything that should be accessible to the end user in one folder and keep everything else from them. 

The server.js file uses the same method to handle aws rds and dynamo db credentials and to make requests. 

What’s new is the express part: 

``` javascript
var express = require('express'), // npm install express
    app = express();
```

It’s _required_ in the beginning and conventionally defined as **app**. 

Then I can define which directory should be served by express and on which port:

``` javascript
// serve static files in /public
app.use(express.static('public'));
// listen on port 8080
app.listen(8080, function() {
    console.log('Server listening...'); // Make sure the "server" has started
```

For every project there will be a subdirectory to the root this is defined in express with: 

``` javascript
app.get('/aameetings', function(req, res) { // aameetings is the subdirectory
    
    // (…) client connection and queries go here and if there is no error
    // the result will be send to the subdirextory
    res.send(qres.rows);
    
})
```

And a link in the index.html file ensures that we can reach that subdirectory (without the need to typeing the url manually)

``` html
    <!-- (…) -->
    <li><a href="/aameetings">AA Meetings</a></li>
    <!-- (…) -->
```

## The queries to structure the data

### AA Data

I obviously refined this query for the final assignment, but the basic structure maybe more visible here. 

``` SQL
SELECT addstreet as mtgaddress, locname as location,
    json_agg(json_build_object('day', datday, 'time', dathour)) as meetings
      FROM dates
        JOIN meetings ON dates.datpk=meetings.meetdatefk
        JOIN locations ON meetings.meetlocationfk=locations.locpk
        JOIN groups ON meetings.meetgroupfk=groups.grouppk
        JOIN addresses ON locations.locaddressfk=addresses.addpk
      WHERE datday = 'Tuesday' AND dathour >= 1900
      GROUP BY addstreet, locname;
```

I had to join my dates table with my meetings table with the primary & foreign key pair and I could join locations and groups form there. The addresses where joined through the locations table, hierarchically speaking they were _nested_ in locations.
The jsonagg(json_build_object) methods aggregate and nest the rows as meeting objects. 

### Dear Diary

For my dear diary project the query is quite simple, because I modeled the data structure in this easy way to facilitate the user interaction I have in mind. I’ll iterate over series of entries and there’s a sequence in each series. These are the query parameters to request the first entry. 

``` javascript
var params = {
        TableName : "deardiary",
        KeyConditionExpression: "series = :series and #sq = :sequence", // the query expression
        ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
            "#sq" : "sequence"
        },
        ExpressionAttributeValues: { // the query values
            ":series": {N: "0"},
            ":sequence": {N: "0"}
        }
    };
```

The syntax for dynamodb is just a little bit different, but the principle is the same:

```javascript
dynamodb.query(params, function(err, data) {
       // (...) when no error occurs
            res.send(data.Items);
```

### Sensor Data

For the sensor data I already made use of the moment library and it’s time-zone and conversion capabilities. I find this [cheatsheet](https://devhints.io/moment) helpful. I’m basically requesting all rows and all columns of today (for me to check if the sensor data makes sense, I’ll might change that to the day before, if the results are not that interesting throughout the day). I need all data first to reduce it procedually to draw a gently smoothed path with three.js.

``` javascript
// Connect to the AWS RDS Postgres database
    const client = new Pool(db_credentials);
    
    var ydd = moment.tz(Date.now(), "America/New_York").format('D');
    var ydm = moment.tz(Date.now(), "America/New_York").format('M');
    console.log(ydd, ydm);
    // SQL query
    var q = `SELECT * FROM sensorData                       //
              WHERE day ='${ydd}' AND month ='${ydm}';`;    // 

    client.connect();
    client.query(q, (qerr, qres) => {
        if (qerr) { throw qerr }
        else {
            res.send(qres.rows);
```

## Notes

I started to work on assignment 10 and on the final assignments in parallel, so my code is already a bit beyond the original assignment and includes prototypes for the final assignment, that I needed to check if my my queries and especially my sensor data made sense. But I’ll explain the way I treated the data after the request in the documentation for the final assignments then.

### Link to work in progress

Here’s the current state of my work on the final assignments that also includes the data endpoints: [Link](http://34.200.243.17:8080/)

### Dear Diary / AWS Credentials Expiring

Unfortunately after running a certain amount of time the AWS credentials for dynamo db expire and the endpoint and final project link won’t be acceccible. Here’s the result of retrieving the endpoint link (_prettified_):

``` javascript
[
  {
    "series": {
      "N": "0"
    },
    "finishedWriting": {
      "S": "Fri Oct 12 2018"
    },
    "importance": {
      "N": "6"
    },
    "urgency": {
      "N": "5"
    },
    "subhead": {
      "S": "An Attempt to Collect and Map"
    },
    "entry": {
      "S": "I want this to be a tool to collect the ideas, anecdotes, stories, we share maybe a map of our “Brieffreundschaft” or even – hopefully – it can be a tool to collaborate as well, if it’s not too technical or indirect and then at least document its failure. Then it may only be a place for me to collect my ideas. I feel uncomfortable writing to you in English, so I might soon switch to German and offer a English translation, comment or summary instead.\n\n    I think in the end I want this to be a website with just one page wich is scrollable vertically and horizontally and which shows all the entries positioned according to the time they were written and proximity by relations, this is where the tags will come in handy. The typography should reflect the tags (which can include moods) and very different topics could be juxtaposed. There might also be a filtering or sorting option to generate different outcomes of this map"
    },
    "sequence": {
      "N": "0"
    },
    "startedWriting": {
      "S": "Fri Oct 12 2018"
    },
    "headline": {
      "S": "Dear ~Diary~ Judith Milz,"
    },
    "uploaded": {
      "S": "Sat Oct 27 2018"
    },
    "tags": {
      "SS": [
        "English",
        "introduction",
        "mainIntroduction",
        "thisConcept"
      ]
    },
    "author": {
      "S": "Felix Buchholz"
    }
  }
]
```