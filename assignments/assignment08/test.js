let mySeconds = 0;
let xMin = Infinity;
let xMax = -Infinity;
let xMins = [];
let xMaxs = [];
// let timeStart = new Date();

function waitAndDo(times) {

  if(times < 1) {
    console.log(xMins)
    return;
  }

  setTimeout(function() {

    if (mySeconds < 600) {
      const x = Math.floor(Math.random().toFixed(3)*10000)
      if (x < xMin) {
        xMin = x;
        console.log('The value of xMin was updated within one minute ' + xMin);
      }
      if (x > xMax) {
        xMax = x;
        // console.log('The value of xMax was updated within one minute ' + xMin);
      }
      // const array = (x, new Date())
      // console.log(array);
      mySeconds++;
    } else {
      mySeconds = 0;
      console.log(' ')
      console.log('-------------------------------------')
      console.log('A minute has passed');
      console.log('The current value for xMin is: ' + xMin)

      if (xMins.length < 60) {
        xMins.splice(0, 0, xMin);
        xMaxs.splice(0, 0, xMax);
      } else {
        console.log('There are now sixty elements in the array!');
        xMins.splice(0, 0, xMin);
        xMaxs.splice(0, 0, xMax);
        xMaxs.pop()
        xMins.pop()
      }



      console.log('***');
      console.log('The xMin array now looks like this: ')
      console.log(xMins.toString())
      console.log('The length should be 60:' + xMins.length)
      console.log('***');
      console.log('***');
      console.log('The xMax array now looks like this: ')
      console.log(xMaxs.toString())
      console.log('The length should be 60:' + xMaxs.length)
      console.log('***');
      console.log('-------------------------------------')
      console.log(' ')

      xMin = Infinity;
      xMax = -Infinity;

    }

    waitAndDo(times-1);
  }, 100);
}

waitAndDo(12000)
