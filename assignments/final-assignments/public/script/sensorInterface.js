/* global date */
/* global d3 */
// console.log(date);
const currentDate = new Date(date[1]);
const startDate = new Date('2018-11-25T05:00:00.000Z');
// console.log(startDate)
const offset = parseFloat(window.location.href.split('=')[1]);
console.log(offset)

d3.select('body')
  .append('div')
    .attr('id', 'use')
    .text(`zoom: scroll | orbit: click & drag`)

d3.select('body')
  .append('div')
    .attr('id', 'date')
    .text(`${date[0]}`)
    

if (currentDate > startDate) {
  d3.select('body')
    .append('div')
      .attr('id', 'previous')
      .text('prev')
      .on('click', function() {
        window.location.href = `http://34.200.243.17:8080/ss?off=${offset+1}`;
      })
}


if (offset > 0) {
  d3.select('body')
  .append('div')
    .attr('id', 'next')
    .text('next')
    .on('click', function() {
      window.location.href = `http://34.200.243.17:8080/ss?off=${offset-1}`;
    })
}


