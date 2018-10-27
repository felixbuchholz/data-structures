Felix Buchholz
MS Data Visualization @ Parsons NYC, Fall 2018, Data Structures, Aaron Hill

# Assignment 6

Sorry, this time I ran late for the assignment.

## Assignment description

[Link](https://github.com/visualizedata/data-structures/tree/master/assignments/weekly_assignment_06)

## My approach

### Part one

For assignment 7 I wanted to remove duplicates in my table, but still keep the relations between keys correct. For my query I decided to focus on accessibility if the user of the interface needed wheelchair access. I figured that there are addresses with multiple meeting locations and not necessarily all of them could be accessed by wheelchair. So I needed to join my addresses table with my locations table with its foreign key and primary key respectively. I realized, that it would be helpful for the table view to add the table name to the column name, for example like addlat, addlong, addstreet, addwca, locpk. Maybe I’ll adjust that, if it turns out to be useful, but I’ll need to explore that further.

``` javascript
var thisQuery =
"SELECT lat, long, street, wheelchairaccess, locations.pk " +
"FROM addresses " +
"INNER JOIN locations ON locations.addressFK=addresses.pk " +
"WHERE zone=6 AND wheelchairaccess=true;";
```
Output:
``` shell
┌─────────┬──────────────────┬───────────────────┬─────────────────────────┬──────────────────┬─────┐
│ (index) │       lat        │       long        │         street          │ wheelchairaccess │ pk  │
├─────────┼──────────────────┼───────────────────┼─────────────────────────┼──────────────────┼─────┤
│    0    │    40.7796117    │    -73.9801807    │ '164 West 74th Street'  │       true       │ 189 │
│    1    │    40.7789036    │    -73.9799533    │ '141 West 73rd Street'  │       true       │ 192 │
│    2    │ 40.7852818734432 │ -73.9771060064311 │ '215 West 82nd Street'  │       true       │ 196 │
│    3    │    40.7708644    │    -73.9806413    │  '5 West 63rd Street'   │       true       │ 199 │
│    4    │    40.7848713    │    -73.9800524    │ '251 West 80th Street'  │       true       │ 204 │
│    5    │    40.7708644    │    -73.9806413    │  '5 West 63rd Street'   │       true       │ 206 │
│    6    │    40.8021037    │    -73.9658778    │ '218 West 108th Street' │       true       │ 211 │
│    7    │    40.7986785    │    -73.9648897    │ '125 West 104th Street' │       true       │ 212 │
│    8    │    40.7796494    │    -73.982239     │ '236 West 73rd Street'  │       true       │ 213 │
│    9    │    40.7927534    │    -73.972842     │     '2504 Broadway'     │       true       │ 216 │
│   10    │    40.8051126    │    -73.9607974    │ '405 West 114th Street' │       true       │ 217 │
│   11    │    40.7977791    │    -73.9709911    │ '251 West 100th Street' │       true       │ 220 │
│   12    │    40.7844228    │    -73.9716168    │  '26 West 84th Street'  │       true       │ 221 │
│   13    │    40.7740859    │    -73.979107     │  '30 West 68th Street'  │       true       │ 230 │
│   14    │    40.7887918    │    -73.9772649    │ '263 West 86th Street'  │       true       │ 232 │
│   15    │    40.7879892    │    -73.9707609    │  '595 Columbus Avenue'  │       true       │ 236 │
│   16    │    40.7855603    │    -73.9776992    │ '213 West 82nd Street'  │       true       │ 238 │
│   17    │    40.7774259    │    -73.9812051    │ '152 west 71st street'  │       true       │ 240 │
│   18    │    40.7774259    │    -73.9812051    │ '152 West 71st Street'  │       true       │ 241 │
└─────────┴──────────────────┴───────────────────┴─────────────────────────┴──────────────────┴─────┘
```
### Part two

I realized I needed to improve the structure of my _Dear Judith_ database.

The main updates are that I remodeled my partition key and sort key and the way I handle updates.

Because my interface is intended to be a flat _map_ of all my entries, I need to load content sequentially when the user scrolls in a certain direction. Therefore I want to identify my entries by a series partition key and sequence sort key. I want the structure of my database as open as possible and develop the mapping while I’m writing the entries, so I think this rather abstract approach gives me the most freedom to do this.

``` javascript
// partition key
this.series = {};
this.series.N = obj.series.toString();

// and sort key
this.sequence = {};
this.sequence.N = obj.sequence.toString();
```

As a result my query looks very simple:

``` javascript
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
```


This would be my very first entry. For the final interface, I’ll probably start in the middle of my entries and users could go back or forth. In my interface I would then have to assign the proper scroll event handlers to load the right entries.
