let myScale = 300;
let onlyChanges = false;
if (onlyChanges) {
  myScale = 30;
} else {
  myScale = 300;
}

// data = JSON.parse(data);

let xmins = data.map(a => a.xmini);
let xmaxs = data.map(a => a.xmaxi);
let xavg = [d3.mean(xmins), d3.mean(xmaxs)]
let ymins = data.map(a => a.ymini);
let ymaxs = data.map(a => a.ymaxi);
let yavg = [d3.mean(ymins), d3.mean(ymaxs)]
let zmins = data.map(a => a.zmini);
let zmaxs = data.map(a => a.zmaxi);
let zavg = [d3.mean(zmins), d3.mean(zmaxs)]
//console.log(xavg, d3.mean(xavg))


let vectors = [];
let vectorsSmooth = [];
let aggregateVector = [ 0, 0, 0 ];
let counter = 0;
data.forEach((e, i) => {
  let x, y, z;
  // console.log(xavg);
  x = (e.xmini + e.xmaxi)/2 - d3.mean(xavg);
  y = (e.ymini + e.ymaxi)/2 - d3.mean(yavg);
  z = (e.zmini + e.zmaxi)/2 - d3.mean(zavg);
  // console.log(e.xmini, e.xmaxi, (e.xmini + e.xmaxi)/2, d3.mean(xavg))
  vectors.push( [x, y, z] )
})

vectors.forEach((e, i) => {
  if (arraysEqual(vectors[i], vectors[i+1])) {
    aggregateVector[0] += vectors[i][0]; // aggregateVector[0] = x;
    aggregateVector[1] += vectors[i][1]; // aggregateVector[1] = y;
    aggregateVector[2] += vectors[i][2]; // aggregateVector[2] = z;
    counter++;
  } else {
    aggregateVector[0] += vectors[i][0]; // aggregateVector[0] = x;
    aggregateVector[1] += vectors[i][1]; // aggregateVector[1] = y;
    aggregateVector[2] += vectors[i][2]; // aggregateVector[2] = z;
    if (onlyChanges) {
      if (counter > 0) {
        aggregateVector[0] = aggregateVector[0]/counter;
        aggregateVector[1] = aggregateVector[1]/counter;
        aggregateVector[2] = aggregateVector[2]/counter;
      }
    }
    vectorsSmooth.push(aggregateVector);
    counter = 0;
    aggregateVector = [ 0, 0, 0 ];
  }
})
console.log(vectors);
console.log(vectorsSmooth);
vectors = vectorsSmooth;


/*


for (var i = 0; i < vectors.length; i++) {
  if (i = 0) {
    vertices.push(vectors[i])
  } else {
    // const nextVertex = [
    //   vertices[vertices.length-1][0] + vectors[i][0],
    //   vertices[vertices.length-1][1] + vectors[i][1],
    //   vertices[vertices.length-1][2] + vectors[i][2]
    // ];
    // vertices.push(nextVertex);
  }
}
*/
let vertices = [];
vertices[0] = [ 0, 0, 0 ];
for (var i = 0; i < vectors.length; i++) {
    // console.log(vertices[i], vectors[i]);
    let nextx, nexty, nextz;
    nextx = vertices[i][0] + vectors[i][0]/myScale;
    nexty = vertices[i][1] + vectors[i][1]/myScale;
    nextz = vertices[i][2] + vectors[i][2]/myScale;

    const nextVertex = [nextx, nexty, nextz];

    // array1 = vertices[i-1];
    // array2 = vectors[i];
    //
    // let nextVertex = array1.map(function (num, idx) {
    //                   let res = (num + array2[idx])/10;
    //                   res = parseFloat(res.toFixed(1));
    //                     return res;
    //                   });

    vertices.push(nextVertex);

}

console.log(vertices);

const xCooArr = vertices.map(x => x[0]);
const xCenter = (d3.min(xCooArr) + d3.max(xCooArr))/2;
const yCooArr = vertices.map(x => x[1]);
const yCenter = (d3.min(yCooArr) + d3.max(yCooArr))/2;
const yMin = d3.min(yCooArr);
const zCooArr = vertices.map(x => x[2]);
const zCenter = (d3.min(zCooArr) + d3.max(zCooArr))/2;
console.log(xCenter, yCenter, zCenter, yMin);


// strings = [];
// vertices.forEach((e, i) => {
//   string = `new THREE.Vector3( ${e[0]}, ${e[1]}, ${e[2]} ), `
//   // new THREE.Vector3( 0, 0, 0 ),
//   strings.push(string);
// })


vertices = vertices.map((x) => {
  res = new THREE.Vector3(x[0], x[1], x[2]);
  return res;
})
// console.log(vertices);

// var scene = new THREE.Scene();
// var camera = new THREE.PerspectiveCamera( 75, window.innerWidth / window.innerHeight, 0.1, 1000 );
//
// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
//
// var geometry = new THREE.BoxGeometry( 1, 1, 1 );
// var material = new THREE.MeshBasicMaterial( { color: 0xffff00 } );
// var cube = new THREE.Mesh( geometry, material );
// scene.add( cube );
//
// camera.position.z = 5;
//
// function animate() {
// 	requestAnimationFrame( animate );
//   cube.rotation.x += 0.01;
//   cube.rotation.y += 0.01;
// 	renderer.render( scene, camera );
// }
// animate();

// var renderer = new THREE.WebGLRenderer();
// renderer.setSize( window.innerWidth, window.innerHeight );
// document.body.appendChild( renderer.domElement );
//
// var camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 500 );
// camera.position.set( 0, 0, 100 );
// camera.lookAt( 0, 0, 0 );
//
// var scene = new THREE.Scene();
// var material = new THREE.LineBasicMaterial( { color: 0x0000ff } );
// var geometry = new THREE.Geometry();
// geometry.vertices.push(new THREE.Vector3( -10, 0, 0) );
// geometry.vertices.push(new THREE.Vector3( 0, 10, 0) );
// geometry.vertices.push(new THREE.Vector3( 10, 0, 0) );
//
// var line = new THREE.Line( geometry, material );
//
// scene.add( line );
// renderer.render( scene, camera );


var renderer, scene, camera;
var spotLight, lightHelper, shadowCameraHelper;
var gui;
function init() {
  renderer = new THREE.WebGLRenderer({antialias: true});
  renderer.setPixelRatio( window.devicePixelRatio );
  renderer.setSize( window.innerWidth, window.innerHeight );
  document.body.appendChild( renderer.domElement );
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;
  renderer.gammaInput = true;
  renderer.gammaOutput = true;
  scene = new THREE.Scene();
  scene.background = new THREE.Color( 0x393939 );
  camera = new THREE.PerspectiveCamera( 45, window.innerWidth / window.innerHeight, 1, 1400 );
  camera.position.set( 300, 250, -300 );
  var controls = new THREE.OrbitControls( camera, renderer.domElement );
  controls.addEventListener( 'change', render );
  controls.minDistance = 250;
  controls.maxDistance = 900;
  controls.enablePan = true;
  var ambient = new THREE.AmbientLight( 0xfdfdff, 0.05 );
  scene.add( ambient );
  // spotLight = new THREE.SpotLight( 0xffffff, 0.2 );
  // spotLight.position.set( 80, 400, 80 );
  // spotLight.angle = Math.PI / 5;
  // spotLight.penumbra = 0.01;
  // spotLight.decay = 2;
  // spotLight.distance = 800;
  // spotLight.castShadow = true;
  // spotLight.shadow.mapSize.width = 2048;
  // spotLight.shadow.mapSize.height = 2048;
  // spotLight.shadow.camera.near = 10;
  // spotLight.shadow.camera.far = 400;
  scene.add( spotLight );
  spotLight = new THREE.SpotLight( 0xfffffd, 1.2 );
  spotLight.position.set( 0, 500, 0 );
  spotLight.angle = Math.PI / 5;
  spotLight.penumbra = 0.5;
  spotLight.decay = 1;
  spotLight.distance = 800;
  spotLight.castShadow = true;
  spotLight.shadow.mapSize.width = 2048;
  spotLight.shadow.mapSize.height = 2048;
  spotLight.shadow.camera.near = 10;
  spotLight.shadow.camera.far = 400;
  scene.add( spotLight );
  lightHelper = new THREE.SpotLightHelper( spotLight );
  // scene.add( lightHelper );
  shadowCameraHelper = new THREE.CameraHelper( spotLight.shadow.camera );
  // scene.add( shadowCameraHelper );
  // scene.add( new THREE.AxesHelper( 10 ) );
  var material = new THREE.MeshPhongMaterial( { color: 0xffffff, dithering: true } );
  var geometry = new THREE.PlaneBufferGeometry( 2000, 2000 );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( 0, 0, 0 );
  mesh.rotation.x = - Math.PI * 0.5;
  mesh.receiveShadow = true;
  scene.add( mesh );

  // var geometry = new THREE.BoxBufferGeometry( 2, 8000, 10000 );
  // var mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( - 40 , 0 , 0 );
  // mesh.receiveShadow = true;
  // scene.add( mesh );
  // var geometry = new THREE.BoxBufferGeometry( 1000, 8000, 2 );
  // var mesh = new THREE.Mesh( geometry, material );
  // mesh.position.set( 0 , 0 , 120 );
  // mesh.receiveShadow = true;
  // scene.add( mesh );

  var material = new THREE.MeshPhongMaterial( { color: 0xc7d7f2, reflectivity: 1.0, shininess: 255,  dithering: true, specular: 0xffffff, flatShading: false } );
  // var material = new THREE.MeshStandardMaterial( { color: 0x111188, roughness: 0.0, metalness: 0.8} );
  var path = new THREE.CatmullRomCurve3(vertices);
  // params
  var pathSegments = 1500;
  var tubeRadius = 2;
  var radiusSegments = 20;
  var closed = false;

  var geometry = new THREE.TubeBufferGeometry( path, pathSegments, tubeRadius, radiusSegments, closed );
  var mesh = new THREE.Mesh( geometry, material );
  mesh.position.set( -xCenter , -yMin+2 , -zCenter );
  mesh.castShadow = true;
  mesh.receiveShadow = true;

  scene.add( mesh );
  controls.target.set( 0, 0, 0 );
  controls.update();
  window.addEventListener( 'resize', onResize, false );
}
function onResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize( window.innerWidth, window.innerHeight );
}
function render() {
  lightHelper.update();
  shadowCameraHelper.update();
  renderer.render( scene, camera );
}
// function buildGui() {
//   gui = new dat.GUI();
//   var params = {
//     'light color': spotLight.color.getHex(),
//     intensity: spotLight.intensity,
//     distance: spotLight.distance,
//     angle: spotLight.angle,
//     penumbra: spotLight.penumbra,
//     decay: spotLight.decay
//   };
//   gui.addColor( params, 'light color' ).onChange( function ( val ) {
//     spotLight.color.setHex( val );
//     render();
//   } );
//   gui.add( params, 'intensity', 0, 2 ).onChange( function ( val ) {
//     spotLight.intensity = val;
//     render();
//   } );
//   gui.add( params, 'distance', 50, 200 ).onChange( function ( val ) {
//     spotLight.distance = val;
//     render();
//   } );
//   gui.add( params, 'angle', 0, Math.PI / 3 ).onChange( function ( val ) {
//     spotLight.angle = val;
//     render();
//   } );
//   gui.add( params, 'penumbra', 0, 1 ).onChange( function ( val ) {
//     spotLight.penumbra = val;
//     render();
//   } );
//   gui.add( params, 'decay', 1, 2 ).onChange( function ( val ) {
//     spotLight.decay = val;
//     render();
//   } );
//   gui.open();
// }
init();
// buildGui();
render();

function arraysEqual(a, b) {
  if (a === b) return true;
  if (a == null || b == null) return false;
  if (a.length != b.length) return false;

  // If you don't care about the order of the elements inside
  // the array, you should sort both arrays here.
  // Please note that calling sort on an array will modify that array.
  // you might want to clone your array first.

  for (var i = 0; i < a.length; ++i) {
    if (a[i] !== b[i]) return false;
  }
  return true;
}
