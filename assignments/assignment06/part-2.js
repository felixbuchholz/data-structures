//REQUIRE
var AWS = require('aws-sdk');
var async = require('async');
require('dotenv').config()

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var params = {
    TableName : "deardiary",
    KeyConditionExpression: "series = :series and #sq = :sequence", // the query expression
    ExpressionAttributeNames: { // name substitution, used for reserved words in DynamoDB
        "#sq" : "sequence"
    },
    ExpressionAttributeValues: { // the query values
        ":series": {N: "0"},
        ":sequence": {N: "0"}
    }
};

var dynamodb = new AWS.DynamoDB();

dynamodb.query(params, function(err, data) {
    if (err) {
        console.error("Unable to query. Error:", JSON.stringify(err, null, 2));
    } else {
        console.log("Query succeeded.");
        data.Items.forEach(function(item) {
            console.log("***** ***** ***** ***** ***** \n", item);
        });
    }
});
