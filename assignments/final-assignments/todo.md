# Dear Judith

- Restructure the diary, to match the easier implementation // don’t need that anymore 
- fill in the other entries
- tags, headlines, use the .html method instead of .text


## Documentation
- Request the whole series instead of just one entry: More robust error handling! – just one variable series (without sequence)
- Be aware of reloads: 

``` javascript 

```

- scrolling back to the right position

- All the control works with data.length
-

# AA MAP

Beautiful popups SORTED BY TIME!!

``` javascript
for (var i=0; i<data.length; i++) {
  
    var myPopUp = [`<div class='address'>${data[i].meetings[0].address}</div>`];
    
    // DOCUMENT THIS
    var sortedArray = data[i].meetings.sort(function (a, b) {
        if (a.shour < b.shour) {
          return -1;
        }
        if (a.shour > b.shour) {
          return 1;
        }
        // a must be equal to b
        return 0;
      })
    
    data[i].meetings.forEach((e,i) => {
      myPopUp.push(`
      <div class='meeting'>
        <div class='name'>
          Group name: <span class='em'>${e.name}</span>
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
    console.log(myPopUp)
    
    
    L.marker( [data[i].lat, data[i].lon] ).bindPopup(myPopUp).addTo(mymap);
}
```