var diaryEntries = [];

class DiaryEntry {
  constructor(obj) {
    //Primary key
    this.pk = {};
    this.pk.N = obj.pk.toString();

    //Essentials
    this.headline = {};
    this.headline.S = obj.headline;
    if (obj.subhead != null) {
      this.subhead = {};
      this.subhead.S = obj.subhead || 'empty';
    }
    this.entry = {};
    this.entry.S = obj.entry;
    if (obj.translation != null) {
      this.translation = {};
      this.translation.S = obj.translation || 'empty';
    }

    // Only when author is someone else
    this.author = {};
    this.author.S = obj.author || 'Felix Buchholz';

    //Dates
    this.uploaded = {};
    this.uploaded.S = obj.uploaded.toDateString();
    if (obj.updatedOn != null) {
      this.updatedOn = {};
      this.updatedOn.S = typeof obj.updatedOn != 'undefined'? obj.updatedOn.toDateString() : new Date(1970, 0, 1, 0, 0, 0).toDateString();
    }
    this.startedWriting = {};
    this.startedWriting.S = obj.startedWriting.toDateString();
    this.finishedWriting = {};
    this.finishedWriting.S = obj.finishedWriting.toDateString();

    // Tags and references
    this.tags = {};
    this.tags.SS = obj.tags;
    if (obj.imgRefs != null) {
      this.imgRefs = {};
      this.imgRefs.SS = obj.imgRefs || ['empty'];
    }
    if (obj.otherRefs != null) {
      this.otherRefs = {};
      this.otherRefs.SS = obj.otherRefs || ['empty'];
    }

    // Ordering and linking of entries
    this.sequence = {};
    this.sequence.N = obj.sequence.toString();
    this.importance = {};
    this.importance.N = obj.importance.toString();
    this.urgency = {};
    this.urgency.N = obj.urgency.toString();
    if (obj.commentOn != null) {
      this.commentOn = {};
      this.commentOn.N = typeof obj.commentOn != 'undefined'? obj.commentOn.toString() : '-1';
    }
    if (obj.updateOf != null) {
      this.updateOf = {};
      this.updateOf.N = typeof obj.updateOf != 'undefined'? obj.updateOf.toString() : '-1';
    }
  }
}

diaryEntries.push(
  new DiaryEntry({
    pk: 0,

    headline: 'Dear ~Diary~ Judith Milz,',
    subhead: 'An Attempt to Collect and Map',
    entry: `I want this to be a tool to collect the ideas, anecdotes, stories, we share maybe a map of our “Brieffreundschaft” or even – hopefully – it can be a tool to collaborate as well, if it’s not too technical or indirect and then at least document its failure. Then it may only be a place for me to collect my ideas. I feel uncomfortable writing to you in English, so I might soon switch to German and offer a English translation, comment or summary instead.

    I think in the end I want this to be a website with just one page wich is scrollable vertically and horizontally and which shows all the entries positioned according to the time they were written and proximity by relations, this is where the tags will come in handy. The typography should reflect the tags (which can include moods) and very different topics could be juxtaposed. There might also be a filtering or sorting option to generate different outcomes of this map`,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 12, 12, 00, 00),
    finishedWriting: new Date(2018, (10-1), 12, 12, 31, 00),

    tags: ['introduction', 'mainIntroduction', 'thisConcept', 'English'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 0,
    importance: 6,
    urgency: 5,
    // commentOn: ,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 1,

    headline: 'Are Some Things Better Said in German?',
    // subhead: '',
    entry: 'It seems so strange to write to you in English, why would I do that? What strange excercise is that? I think it’s ok for this excercise but I feel like we loose a lot of subtleties in the way we structure language and story telling in our mother tongue. So let me think, what we need. We need a category (that is a tag) of things that can only be said in German.',
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 11, 22, 30, 00),
    finishedWriting: new Date(2018, (10-1), 12, 12, 44, 00),

    tags: ['introduction', 'thisConcept', 'English', 'betterSaidInGerman'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 1,
    importance: 3,
    urgency: 4,
    // commentOn: ,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 2,

    headline: 'Nochmal dasselbe…',
    subhead: 'Zeit und Ort',
    entry: `Das hier ist vielleicht so etwas wie eine Sammlung, eine Übung, die hoffentlich hinterlässt, was man gerne wieder aufgreifen möchte. Und im Besten Falle vielleicht etwas, was wir beide benutzen könnten um darüber zu sprechen, was wir vielleicht einmal zusammen machen könnten.

    Heute als ich in der U-Bahn saß, fiel mir auf, dass ich viel deutschsprachige Musik höre und es könnte daran liegen, dass ich diese Zeit, das Hiersein als Zwischenzeit, zwischen vergangenem Nichthiersein und zukünfitgem Nichthiersein wahrnehme, dass obwohl ich mich oft wundere, dass ich mich ganz distanzlos fühle, nicht mehr über die andere Sprache nachdenke zum Beispiel, ich oft an die Zukunft denke, die nicht hier stattfindet.`,
    translation : 'This is just me explaining the idea again and talking about how I feel like being in NY at the moment. Especially this might be interesting to see change over time.',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 11, 22, 8, 00),
    finishedWriting: new Date(2018, (10-1), 12, 13, 01, 00),

    tags: ['introduction', 'thisConcept', 'German', 'betterSaidInGerman', 'beingHere', 'personal', 'zwischenZeit', 'howDoIFeelAboutNY', 'feelingMakeshift'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 2,
    importance: 2,
    urgency: 1,
    commentOn: 1,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 3,

    headline: 'This artist we have been talking about',
    subhead: 'Bas Jan Ader',
    entry: `Bas Jan Ader, you told me about his three-minute black-and-white silent film, I’m too sad to tell you and how he tried to cross the ocean in a little boat and disappeared.`,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 11, 23, 46, 00),
    finishedWriting: new Date(2018, (10-1), 11, 23, 52, 00),

    tags: ['introduction', 'thisConcept', 'German', 'beingHere', 'personal'],
    imgRefs: ['https://upload.wikimedia.org/wikipedia/en/4/40/Bas_Jan_Ader_-_I%27m_too_sad_to_tell_you.jpg'],
    // otherRefs: [''],

    sequence: 3,
    importance: 7,
    urgency: 2,
    // commentOn: ,
    // updateOf:
}));


// console.log(diaryEntries);

//REQUIRE
var AWS = require('aws-sdk');
var async = require('async');
require('dotenv').config()

AWS.config = new AWS.Config();
AWS.config.accessKeyId = process.env.AWS_ID;
AWS.config.secretAccessKey = process.env.AWS_KEY;
AWS.config.region = "us-east-1";

var dynamodb = new AWS.DynamoDB();

// Upload this
async.eachSeries(diaryEntries, function(value, callback) {
  console.log(value);
    var params = {};
    params.Item = value;
    params.TableName = "deardiary";

    dynamodb.putItem(params, function (err, data) {
      if (err) console.log(err, err.stack); // an error occurred
      else     console.log(data);           // successful response
    });
  setTimeout(callback, 1000);
});
