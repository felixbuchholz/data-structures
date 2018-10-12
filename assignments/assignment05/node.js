let diaryEntries = [];
let currentUploadIndex = 0;

class DiaryEntry {
  constructor(obj) {
    //Primary key
    this.pk = {};
    this.pk.N = obj.pk.toString();

    //Essentials
    if (obj.headline != null) {
      this.headline = {};
      this.headline.S = obj.headline;
    }
    if (obj.subhead != null) {
      this.subhead = {};
      this.subhead.S = obj.subhead || 'empty';
    }
    if (obj.entry != null) {
      this.entry = {};
      this.entry.S = obj.entry;
    }
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

    if (obj.startedWriting != null) {
      this.startedWriting = {};
      this.startedWriting.S = obj.startedWriting.toDateString();
    }
    if (obj.finishedWriting != null) {
      this.finishedWriting = {};
      this.finishedWriting.S = obj.finishedWriting.toDateString();
    }

    // Tags and references
    if (obj.tags != null) {
      this.tags = {};
      this.tags.SS = obj.tags;
    }
    if (obj.imgRefs != null) {
      this.imgRefs = {};
      this.imgRefs.SS = obj.imgRefs || ['empty'];
    }
    if (obj.otherRefs != null) {
      this.otherRefs = {};
      this.otherRefs.SS = obj.otherRefs || ['empty'];
    }

    // Ordering and linking of entries
    if (obj.sequence != null) {
      this.sequence = {};
      this.sequence.N = obj.sequence.toString();
    }
    if (obj.importance != null) {
      this.importance = {};
      this.importance.N = obj.importance.toString();
    }
    if (obj.urgency != null) {
      this.urgency = {};
      this.urgency.N = obj.urgency.toString();
    }
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

    tags: ['art', 'artist', 'basJanAder'],
    imgRefs: ['https://upload.wikimedia.org/wikipedia/en/4/40/Bas_Jan_Ader_-_I%27m_too_sad_to_tell_you.jpg'],
    // otherRefs: [''],

    sequence: 3,
    importance: 7,
    urgency: 2,
    // commentOn: ,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 4,

    headline: 'Chamber Music',
    // subhead: '',
    entry: `I got this weird habit at the moment listening to a lot of chamber music. As always I’m really lazy when it comes to finding music so that leaves me with the The Baroque 50: Spotify Picks. It might sound a bit crazy, but in a way I can relate to that aristrocrat mentality that vibes with that music. I think it’s because of this guilty pleasure – what a strange expression, I would not actually feel guilty about my pleasure watching this – show that I’m currently watching, Versaille, about Louis XIV. I don’t know if you can relate to this but sometimes shallowness and hostiliy concealed in etiquette have a strange atmosphere of honesty to them. `,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 12, 0, 10, 00),
    finishedWriting: new Date(2018, (10-1), 12, 0, 23, 00),

    tags: ['music', 'aristocracy', 'English', 'honesty', 'personal'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 4,
    importance: 2,
    urgency: 1,
    // commentOn: ,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 5,

    headline: 'A Thing to Write to a Diary',
    // subhead: '',
    entry: `You know I hate to end relationships,
especially when it has to be on a a bad note. But I finally mangaged to end the one I was telling you about when we sat in the crazy lunchtime heat of Karlsruhe at Kühler Krug. I finally ended that. And it’s good.
It’s even sort of a heart-warming feeling to know you have alomost something like an enemy very close to you.`,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 12, 0, 30, 00),
    finishedWriting: new Date(2018, (10-1), 12, 14, 3, 00),

    tags: ['lena', 'enemy', 'English', 'honesty', 'personal', 'relationships', 'karlsruhe'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 5,
    importance: 5,
    urgency: 0,
    // commentOn: ,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 6,

    headline: 'Swimming-pool voll Galle',
    // subhead: '',
    entry: `If I every feel like it, I also want to have a category to vent a bit. This would be it.

    Why not set the copy in Gill Sans and headlines in Bastard, by Virusfonts.`,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 12, 1, 49, 00),
    finishedWriting: new Date(2018, (10-1), 12, 14, 11, 00),

    tags: ['lena', 'enemy', 'English', 'honesty', 'personal', 'relationships', 'karlsruhe', 'gill', 'thisConcept', 'swimmingPool'],
    // imgRefs: [''],
    // otherRefs: [''],

    sequence: 6,
    importance: 5,
    urgency: 2,
    commentOn: 5,
    // updateOf:
}));

diaryEntries.push(
  new DiaryEntry({
    pk: 7,

    // headline: 'This artist we have been talking about',
    // subhead: 'Bas Jan Ader',
    // entry: `Bas Jan Ader, you told me about his three-minute black-and-white silent film, I’m too sad to tell you and how he tried to cross the ocean in a little boat and disappeared.`,
    // translation : '',

    // author: '',
    uploaded: new Date(),
    // updatedOn: new Date(1970, 0, 1, 0, 0, 0),
    startedWriting: new Date(2018, (10-1), 12, 14, 07, 00),
    finishedWriting: new Date(2018, (10-1), 12, 14, 09, 00),

    tags: ['art', 'artist', 'basJanAder'],
    // imgRefs: ['https://upload.wikimedia.org/wikipedia/en/4/40/Bas_Jan_Ader_-_I%27m_too_sad_to_tell_you.jpg'],
    // otherRefs: [''],

    // sequence: 3,
    // importance: 7,
    // urgency: 2,
    // commentOn: ,
    updateOf: 3
}));

// <------------------------------------------------ CURRENT ENTRIES: 7+1

// <------------------------------------------------ CURRENT ENTRIES: 7+1

// IMPORTANT CURRENT UPLOAD INDEX
currentUploadIndex = 7+1; // x+1, = diaryEntries.length
diaryEntries = diaryEntries.slice(currentUploadIndex)
console.log(diaryEntries);

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
