/* global L */
/* global data */
console.log(data);
var mymap = L.map('mapid').setView([40.766088, -73.945669], 12);

L.tileLayer('https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors, <a href="https://creativecommons.org/licenses/by-sa/2.0/">CC-BY-SA</a>, Imagery © <a href="https://www.mapbox.com/">Mapbox</a>',
    maxZoom: 18,
    id: 'mapbox.streets',
    // accessToken: 'your.mapbox.access.token'
    accessToken: 'pk.eyJ1Ijoidm9ucmFtc3kiLCJhIjoiY2pveGF0aDV2MjIyOTNsbWxlb2hhMmR4dCJ9.JJdYD_jWgRwUeJkDWiBz3w'
}).addTo(mymap);

var myIcon = L.icon({
    iconUrl: 'assets/icon.png',
    shadowUrl: 'assets/icon_shadow.png',

    iconSize:     [50, 50], // size of the icon
    shadowSize:   [50, 50], // size of the shadow
    iconAnchor:   [25, 50], // point of the icon which will correspond to marker's location
    shadowAnchor: [25, 50],  // the same for the shadow
    popupAnchor:  [0, -45] // point from which the popup should open relative to the iconAnchor
});

for (var i=0; i<data.length; i++) {
  
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
    console.log(myPopUp)
    
    
    L.marker( [data[i].lat, data[i].lon], {icon: myIcon}).bindPopup(myPopUp).addTo(mymap);
}

document.getElementsByClassName( 'leaflet-control-attribution' )[0].style.display = 'none';