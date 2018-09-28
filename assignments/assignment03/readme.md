Felix Buchholz
MS Data Visualization @ Parsons NYC, Fall 2018, Data Structures, Aaron Hill

# Assignment 3

## Assignment description

> In preparation for this assignment, create a free account with Texas A&M GeoServices.
>
> Continue work on the file you parsed in Weekly Assignment 2. If you haven't already, organize your data into a JSON format so that it will be easier to access the data for your work on this assignment.
> [GIST: pushing to an array]
>
> Write a script that makes a request to the Texas A&M Geoservices Geocoding APIs for each address, using the address data you parsed in Weekly Assignment 2. You'll need to do some work on the address data (using code!) to prepare them for the API queries. For example, the parsed value 50 Perry Street, Ground Floor, should be modified to 50 Perry Street, New York, NY. The addresses are messy and may yield weird results from the API response. Don't worry too much about this right now. But, start to think about it; in a later assignment we'll have to clean these up.
>
> Your final output should be a file that contains an array that contains an object for each meeting (which may or may not nest other arrays and objects). The array should have a length equal to the number of meetings. Each object should hold the relevant data for each meeting. For now, we're focusing on the addresses and geographic coordinates. An example:
>
``` javascript

[ { address: '63 Fifth Ave, New York, NY', latLong: { lat: 40.7353041, lng: -73.99413539999999 } }, { address: '16 E 16th St, New York, NY', latLong: { lat: 40.736765, lng: -73.9919024 } }, { address: '2 W 13th St, New York, NY', latLong: { lat: 40.7353297, lng: -73.99447889999999 } } ]
```
>
> Be mindful of:
>
> API rate limits (you get 2,500 requests total before needing to pay TAMU for more)
> Asyncronous JavaScript (but don't overuse setTimeout)
> Keeping your API key(s) off of GitHub (use a Linux environment variable instead)
> Keeping only the data you need from the API response, not all the data
> Update your GitHub repository with the relevant file(s). In Canvas, submit the URL of the specific location of this work within your data-structures GitHub repository.

## My approach

### Prerequisite: making sure my API key doesn’t end up in GitHub.

The overall idea is to store the API key in my environment instead of in the code itself.

1. After I created a Texas A&M GeoServices account I use KeePass to store my credentials for my own later reference
2. For the project to avoid exporting my API key to the environment on every zsh session I install the npm package **dotenv**. [here is the link to the package](https://www.npmjs.com/package/dotenv)
3. I create and use a .env file to store my API key. It is just a one-liner:
```
TAMU_KEY={My API key} // without the curly brackets of course
```
4. To make sure my .env file itself doesn’t end up accessible in GitHub I use a .gitignore file to exclude the .env file from my repository. It looks like this:
```
# This is just a comment: Ignore the .env file that holds your API key.
.env
```
5. Now I can refer to my .env variable TAMU_KEY in my code:
``` javascript
// Installed the dotenv package to permanently store my API key in a .env file.
// Then made sure that git ignores that file by using a .gitignore file
require('dotenv').config()
// The content of the .env file is accessible through "process" (is this an object?)
var apiKey = process.env.TAMU_KEY;
/* … and then later …*/
apiRequest += '&city=New%20York&state=NY&apikey=' + apiKey;
```
### The programming part

I just needed to make a few adjustments to the code and ran into one problem I couldn’t solve.

#### Adjustments

For now I wanted to keep all the information I gathered in the previous assignment and just add latitude and longitude to the my JSON object array. I loaded the content of my JSON file, parsed it and assigned it to the variable addresses, instead of going through the intermediate step of a meetingsData as suggested by the Starter code, but I can easily change the name later and choose which keys of my object I want to keep.

``` javascript
// I’m just using the addresses array this point, because I wanted to keep the data I grabbed from the parsing my text file and add the tamuGeo data to that.
let addresses = fs.readFileSync('../data/aa06Adresses.json');
// let addresses = fs.readFileSync('../data/test.json');
addresses = JSON.parse(addresses);
// console.log(addresses);
```

- The line refering to a test.json file is still there to remind my, that I had used a smaller set of my date with two elements to save myself API requests that are limited to 2500.
- Because of this the length of my object array wouldn’t change throughout the program so I changed the last console.logs to just a "Finished" message.

```javascript
console.log('*** *** *** *** ***');
console.log('Finished');
```

My initial data structure already had the building number and the street name separated so I had to account for that:

``` javascript
apiRequest += 'streetAddress=' + value.number + '%20' + value.street.split(' ').join('%20');
```

To only store the data from the request that I want to use later, that is latitude, longitude and the normalized address TAMU returns, I stored one full result of a request in a json file and browsed through the structure in a online browser json viewer, [here is the one I used](http://jsonviewer.stack.hu/). I could easily address the structure after that like this:

``` javascript
value['tamuAddress'] = tamuGeo.InputAddress['StreetAddress'];
value['latitude'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Latitude'];
value['longitude'] = tamuGeo.OutputGeocodes[0].OutputGeocode['Longitude'];
```

#### My junction problem

One of my meetings just lists a junction as address without a building number. I tried to resolve the problem by joining the junction to one string with "and" and adding the zip code to be more precise, but the request returned "0" for latitude and longitude. I would need to fix this data element by hand at some point I suppose:

``` javascript
if (value.street == '') {
  apiRequest += 'streetAddress=' + value.junction[0].split(' ').join('%20') + '%20and%20' + value.junction[1].split(' ').join('%20') + '&zip=' + value.zip;

}
```
