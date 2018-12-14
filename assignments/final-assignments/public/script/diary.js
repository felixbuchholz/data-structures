/* global d3 */
/* global data */

d3.selection.prototype.first = function() {
  return d3.select(this[0][0]);
};

d3.selection.prototype.last = function() {
  var last = this.size() - 1;
  return d3.select(this[0][last]);
};

for (var i = 0; i < data.length; i++) {
  if (!data[i].length) {
   data[i] = [{'end': true, 'headline': {'S': 'Undefined.'}, 'entry': {'S': 'C’est la fin, mon ami.'}}];
  } 
}
/*
if (!Array.isArray(data[data.length-1]) || !data[data.length-1].length) {
  data[data.length-1] = [{'entry': {'S': 'You reached the end, my friend.'}}];
  // d3.select('#firstentry')
  //   .text(`You reached the end, my friend.`);
}
*/
console.log(data);

d3.select('body')
  .selectAll('div')
  .data(data).enter()
    .append('div')
    .attr('class', function(d, i) {
      if (d[0].end) {
        return 'end-row'
      } else {
        return 'row'
      }
    })
    .attr('id', function(d, i) {
      // console.log(d)
      // console.log(i)
      return i
    })
    .each(function (p, j) {
      // console.log(this)
      d3.select(this)
        .selectAll('div')
        .data(p)
        .enter()
        .append('div')
        .attr('class', function(d, i) {
          if (d.end) {
            return 'end'
          } else {
            return 'element'
          }
          
        })
        .style('padding-left', function(d, i) {
          return `${i*100}px`
        })
        .html(function(d, i) {
          // console.log (d, i)
          return `
          <h2>${d.headline.S}</h2>
          ${d.entry.S.trim()}
          `
        })

    })
    
    // d3.select(`#${data.length-1}`)

d3.selectAll('div').style('margin-bottom', null);
var lastChild = d3.select('body:last-child');
console.log(lastChild)
lastChild.style('margin-bottom', '300px')


lastChild.append('div').text(function(d, i) {
  console.log(this)
  return 'Unless this is the end, keep scrolling'
}).classed('scroll', true)




// scrollTo(data.length-1);
var latestScrollPosition = document.getElementById(`${data.length-1}`).getBoundingClientRect().top
// function scrollTo(hash) {
//     location.hash = "#" + hash;
// }

// console.log(latestScrollPosition)

//window.scrollTo(0, latestScrollPosition-500);

window.scrollTo({
  top: latestScrollPosition-650,
    left: 0
});

// Reference: http://www.html5rocks.com/en/tutorials/speed/animations/

var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
  var body = document.body,
      html = document.documentElement;
  
  // https://stackoverflow.com/questions/1145850/how-to-get-height-of-entire-document-with-javascript
  var pageHeight = Math.max( body.scrollHeight, body.offsetHeight, 
                       html.clientHeight, html.scrollHeight, html.offsetHeight );
  // https://stackoverflow.com/questions/1248081/get-the-browser-viewport-dimensions-with-javascript
  var viewportHeight = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);
  
  // console.log(scroll_pos+viewportHeight, pageHeight)
  d3.selectAll('div').style('color', function () {
    var color = d3.interpolatePlasma(0.9-(scroll_pos/(pageHeight)));
    return color;
  })
  if (scroll_pos+viewportHeight == pageHeight) {
    //d3.select('body').append('div').text(`${data[data.length-1][1].entry.S}`)
    // document.location.reload(true)
    window.location.href = `http://34.200.243.17:8080/dd?ser=${data.length}`;
  }
}

window.addEventListener('scroll', function(e) {

  last_known_scroll_position = window.scrollY;

  if (!ticking) {

    window.requestAnimationFrame(function() {
      doSomething(last_known_scroll_position);
      ticking = false;
    });

    ticking = true;

  }

});


