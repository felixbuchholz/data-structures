// console.log(data)
d3.select('#firstentry').text(`${data[0].entry.S}`).on('scroll', function () {
  d3.select(`#${this.id}`).style('color', 'red')
});

// Reference: http://www.html5rocks.com/en/tutorials/speed/animations/

var last_known_scroll_position = 0;
var ticking = false;

function doSomething(scroll_pos) {
  console.log(scroll_pos)
  d3.select('#firstentry').style('color', function () {
    var color = d3.interpolatePlasma(scroll_pos/8736);
    return color;
  })
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
