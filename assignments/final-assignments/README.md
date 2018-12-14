Felix Buchholz  
MS Data Visualization @ Parsons NYC, Fall 2018   
Data Structures, Aaron Hill

# Final Assignments 1 – 3

### [**Link to the landing page**](http://34.200.243.17:8080/)

_Styling is a bit peculiar – I like things a bit off, sorry._  
_And I get a bit disoriented when writing on a lot of different projects at the same time, I hope this is readable enough_

## Preparing the Server Environment

Between the two approaches to make the final endpoints and projects available over the internet, I opt for the first one and basically followed the [AWS Guide to _Share a Running Application over the Internet_](https://docs.aws.amazon.com/cloud9/latest/user-guide/app-preview.html?icmpid=docs_ac9_ide#app-preview-share). I think it’s easier to develop and maintain the code for these projects when I can see the results immediately and check the IP-address to check if everything works properly. 

I had a very brief glance at Elastic Beanstalk and I can imagine, if I had a bigger project, that I needed to deploy for a limited amount of time, I would give it a try – it seems like a fast and convenient option. For longterm projects it’s probably better to think about and research the appropriate structure more than just uploading the source code. [Find the current description of Beanstalk features](https://aws.amazon.com/elasticbeanstalk/details/) 



### File Structure and and server.js – Small Walkthrough

Here’s a tree of my file structure

``` shell
.
├── public
│   ├── assets
│   │   ├── icon.png
│   │   └── icon_shadow.png
│   ├── css
│   │   ├── diary.css
│   │   ├── landing.css
│   │   ├── map.css
│   │   └── sensor.css
│   ├── index.html
│   └── script
│       ├── aamap.js
│       ├── diary.js
│       ├── my3d.js
│       ├── OrbitControls.js
│       ├── sensorInterface.js
│       └── three.js
├── README.md
├── server.js
└── todo.md
```
_(Just here for later reference, if I need this in another cloud9 IDE – To make you feel like a macOS user in cloud9 there’s a fork of the very convenient package manager Homebrew, [Linuxbrew](http://linuxbrew.sh/), which I used to install [tree](http://mama.indstate.edu/users/ice/tree/) to make this beautiful tree view)_

I use a **one overall folder structure for all three projects.** The amount of files needed and the amount of code within each of those was still manageable enough, though the simplicity is almost stretched to its limits – I’m using four .js-files for the sensor data: The three.js library, it’s OrbitControls plugin, my3d.js to create a scene with my model of the sensor data and one to create the interface, using d3.js.  
If the projects get bigger I’d use a separate folder and subfolders for each project.

To avoid writing CSS and JavaScript and needing to restart the server on every little change I **outsourced the .css and .js** files and linked them in **the server.js file which holds the HTML structure in string variables.** The process follows the same principle for all final projects. The HTML-structure is split in two halves, the first one inside a script tag ending in:

``` javascript
var myHTMLFirstHalf = `
  <html> 
    (…)
    <script>
      var data =`;
```

The second half looks something like this:

``` javascript
var myHTMLSecondHalf = `;
    </script>
  (…)
  </html>
```

Both are joined with the result of the request in between: 

``` javascript
 client.query(thisQuery, (qerr, qres) => {
        if (qerr) { throw qerr }

        else {
            // *** The magic happens here ***
            var resp = myHTMLFirstHalf + JSON.stringify(qres.rows) + myHTMLSecondHalf; 
            // *** The magic ends here ***
            res.send(resp);
            client.end();
            console.log('2) responded to request for aa meeting data');
        }
    });
```

As Aaron mentioned in class, **this is not best practice**, not even a fairly good one, but one to show very directly what is happening and a good way to learn the process. In the future I guess it’s best to use a templating engine. A quick search suggested to look into [this guide](https://expressjs.com/en/guide/using-template-engines.html).

### The index.html

Please excuse the styling of the landing page – when styling is optional I always use the opportunity to make the design a playground and I kind of like weird designs and breaking some of the rules for readability for example (white typography on a very light background – sorry). 

The only other thing I added to the original code example are query extensions to the _Dear Judith_ and the _Laptop Wanderlust_ project url to start with the parameters I wanted to be passed to the queries first:

``` html
(…)
  <li><a href="/dd?ser=0">Dear Judith</a></li>
  <li><a href="/ss?off=1">Laptop Wanderlust</a></li>
(…)
```


## 1 – Alcoholics Anonymous: Your next meeting in Manhattan

![Screenshot AA Map Friday, December 14th, 9:54 AM](doc-assets/aamap.jpg)

### Level of Implementation 
**On Fridays (maybe on other days, too), a couple of my meetings unfortunately landed in Brooklyn.**
_I’m not sure why exactly that happened, because in my request to the TAMU Geo API I even included the zip code of the address._ 

``` javascript
(…)
    apiRequest += 'streetAddress=' + value.street.replace('58-66', '58').replace('206-208', '206').replace('’', '').split(' ').join('%20');
    apiRequest += '&city=New%20York&state=NY&zip=' + value.zipcode + '&apikey=' + apiKey;
(…)
```
Query: [Link to original assignment ](https://github.com/felixbuchholz/data-structures/blob/master/assignments/assignment07/03-geolocate.js)

_I’m sorry I won’t be able time-wise to get back to this and correct it before the deadline. The only approach that comes to mind right now to fix this would be to test the API with these adresses manually and write manual exceptions in the code._

Apart from that I’m quite happy with the the structure, amount of information and typography inside the markers, even though I have more detailed information on the meetings, I think that information would be better suited to be linked and displayed on a separate info page to each group. One small improvement would be a small wheelchair icon in the marker popup to indicate wheelchair access. (I might do that before the deadline, if I find the time)

Compared to my design intention it’s obvious that the user interface is missing. That would be the first step to take this further. 

Here’s the planned layout for comparison: 

![My design intention](https://raw.githubusercontent.com/felixbuchholz/data-structures/master/assignments/assignment11/jpg/final-assignments-designs2.jpg)
[Link to a small write-up of all my design approaches for the final projects](https://github.com/felixbuchholz/data-structures/blob/master/assignments/assignment11/final-assignments-designs.pdf)


### My final query

As promised in the documentation for assignment ten, here’s my final query:

``` SQL
  SELECT addlat as lat, addlong as lon, json_agg(json_build_object('loc', locname, 'address', addstreet, 'time', datstart, 'name', groupname, 'day', datday, 'types', dattype, 'shour', dathour)) as meetings
  FROM dates
    JOIN meetings ON dates.datpk=meetings.meetdatefk
    JOIN locations ON meetings.meetlocationfk=locations.locpk
    JOIN groups ON meetings.meetgroupfk=groups.grouppk
    JOIN addresses ON locations.locaddressfk=addresses.addpk
    WHERE datday = '` + dayy + `' AND dathour >= ` + hourr +
   `GROUP BY addlat, addlong;
```

I’m using moment.tz to get the correct time for the _dayy_ and _hourr_ variables:

``` javascript
var now = moment.tz(Date.now(), "America/New_York").format('dddd,HH');

    var dayTimeArr = now.split(',');
    var dayy = dayTimeArr[0];
    var hourr = dayTimeArr[1]*100 // my dathour is in HHMM (2400) format 
    console.log(dayy);
    console.log(hourr);
```

### Code features

The **custom icon** is referenced like this in Leaflet: 

``` javascript
var myIcon = L.icon({
    iconUrl: 'assets/icon.png',
    shadowUrl: 'assets/icon_shadow.png',

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [50, 50], // size of the shadow
    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
    shadowAnchor: [25, 50],  // the same for the shadow
    popupAnchor:  [0, -45] // point from which the popup should open relative to the iconAnchor
});
``` 

And must be passed as a parameter object to the marker: 

``` javascript
L.marker( [data[i].lat, data[i].lon], {icon: myIcon} /* here we go */)
  .bindPopup(myPopUp)
  .addTo(mymap);
```

**To structure the marker popup for each location** I’m using this code inside the original loop, that assigned the aggregated json object to locations, to **sort meetings by time** and **separate them in logical divs** that I then style in CSS. I only need the address once on top, that’s why I’m starting to build the html-string with that outside the forEach-loop:

``` javascript
    var sortedArray = data[i].meetings.sort(function (a, b) {
        if (a.shour < b.shour) {
          return -1;
        }
        if (a.shour > b.shour) {
          return 1;
        }
        return 0;
      })
    
    var myPopUp = [`<div class='address'>${data[i].meetings[0].address}</div>`];
    
    data[i].meetings.forEach((e,i) => {
      myPopUp.push(`
      <div class='meeting'>
        <div class='name'>
          Group: <span class='em'>${e.name}</span>
        </div>
        <div class='loc'>
          Location: <span class='em'>${e.loc == ''? '–' : e.loc}</span>
        </div>
        <div class='time'>
          Time: <span class='em'>${e.time}</span>
        </div>
        <div class='types'>
          Type: <span class='em'>${e.types}</span>
        </div>
      </div>
      `)
    })
    myPopUp = myPopUp.join('');
```

## 2 – Dear ~Diary~ Judith,

