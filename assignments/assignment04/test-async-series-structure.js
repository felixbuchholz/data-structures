// This is just a test script to understand the async.series structure
var async = require('async');

async.series({
    hampel: function(callback){
            callback();
            console.log('2');
    },
    mann: function(callback){
            callback();
            console.log('1');
    },
    tanz: function(callback){
            callback();
            console.log('5');
    },
    supermann: function(callback){
            callback();
            console.log('4');
    }

},
function(err, results) {
});
