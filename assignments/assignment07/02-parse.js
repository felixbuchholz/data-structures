const {promisify} = require('util');
const fs = require('fs');
const cheerio = require('cheerio');
const readFile = promisify(fs.readFile)
const writeFile = promisify(fs.writeFile)

const meetings = [];
let meetingPK = 1;

const paths = getPaths();

function getPaths() {
  let paths = [];
  for (var i = 1; i <= 10; i++) {
    i = (i < 10) ? i = '0' + i : i;
    const path = `data/text/aa-meetings${i}.txt`
    paths.push(path)
  }
  // console.log(paths);
  return paths
}

let zone = 1;
async function processFiles(paths) {
  for (const path of paths) {
      console.log('******************************************');
      console.log(path);

    const content = await readFile(path);
    const $ = cheerio.load(content);
    const row = $('tr')

    let groupPK = 1;
    row.each((rowIndex, rowElem) => {

      // The data I want to parse is in the table row
      // with this particular style:
      // margin-bottom:10px
      if ($(rowElem).attr('style') == 'margin-bottom:10px') {

        // Every table row has three td elements
        //
        // The first one contains the Name of the location, the address, the detailsBox and the wheelchair access information
        const firstTD = $('td', rowElem).eq(0);
        // The second one contains the time, type and special interest information
        const secondTD = $('td', rowElem).eq(1);
        // The third one stores the original meetingID
        const thirdTD = $('td', rowElem).eq(2);

        // <br>-spilt Array:
        const brSplitArr = firstTD.html().split("<br>")
        // console.log(i, brSplitArr[2]);

        // ADDRESS, everything between the second and third <br>
        const addressFirstLine = brSplitArr[2].trim();

        // ADDRESS street
        const regItemDelimiter = /[,.-]/
        const delArr = addressFirstLine.split(regItemDelimiter)

        // ADDRESS junction in second line
        const addressSecondLine = brSplitArr[3].trim();
        // console.log(addressSecondLine);

        // According to my data model, the most granular information is the meeting timings in the date table, I want to loop through this to fill in all the other information
        //
        // I can split the individual sessions by a delimiter consiting of two <br> tags with whitespace in between.
        const dateArr = secondTD
              .html()
              .trim()
              .split('<br>\n                    \t<br>');

        // LOOP LEVEL: 2
        //
        // Primary key counter:
        let datePK = 0;
        dateArr.forEach((dateElem, dateIndex) => {

          // only if the line starts with a day create a date object with the information
          const isDay = dateElem.match(/[SMTWF]\w+?days/g)
          if (isDay != null && isDay != undefined && isDay != '') {

          // CREATE GROUP OBJECT
            const group = {
                groupPK: groupPK,
                name: getGroupName($, firstTD),
                // details: getGroupDetails($, rowElem)
              }
            // console.log(group.details);

          // CREATE DATE OBJECT
            const date = {
              datePK: datePK,
              day: dateElem.match(/[SMTWF]\w+?days/g),
              start: dateElem.match(/\d\d?:\d\d [A|P]M/g)[0],
              end: dateElem.match(/\d\d?:\d\d [A|P]M/g)[1],
              meetingType: dateElem.match(/(?<=Meeting Type\<\/b\> )[A-Z]{1,2}/g),
              specialInterest: dateElem.match(/(?<=Special Interest\<\/b\> )(.*)/g)
            }
            datePK++;
            // console.log(date);

            // CREATE ADDRESS OBJECT
              const address = {
                PK: 0,
                lat: 0,
                long: 0,
                street: delArr[0].replace('&amp;', 'and'),
                city: 'NY',
                zipcode: $(rowElem).text().match(/\d{5}/g)
              }



            // CREATE LOCATION OBJECT
              const location = {
                locationPK : 0,
                name : $('h4', firstTD).text(),
                details : getLocationDetails($, rowElem, firstTD),
                wheelchairAccess : $(rowElem).text().includes('Wheelchair')? true : false,
                address: address
              }


            // CREATE MEETING OBJECT
              meeting = {
                meetingPK: meetingPK,
                group: group,
                date: date,
                location: location,
                zone: zone
              }
              // console.log(location.details);
              meetings.push([meeting.zone, meeting.meetingPK, location.details])
              // console.log(meeting.group.details, meeting.location.details);
              meetingPK++;



          }; // if isDay == true
        }) // dateArr.forEach
        groupPK++;
      } // if style == margin-bottom:10px
    }) // rows
    zone++;
  } // for … of paths
  writeFile('data/parsed/parsed.json', JSON.stringify(meetings, null, 2));
  // console.log('Done!');
}

processFiles(paths)

function getGroupName($, firstTD) {
  let groupName = $('b', firstTD).text();
  groupName = groupName.split('-')[0].trim();
  return groupName
}

function getLocationDetails($, rowElem, firstTD) {
  const regH4 = /\<h4.*\<\/h4\>/s;
  const regB = /\<b.*<\/b>/s;
  const regSpan = /<span.*<\/span>/s;
  const regN = /[\n]+/gs;
  const regT = /[\t]+/g;
  const regS = /[\s]+/g;
  const regFirstComma = /^(.+?),/;
  const regBetw = /Between\s|Btwneen\s|Betw\.|Betw\s|Btw\.\s|Btw\s|Btwn\.\s/gi;
  const regApos = /&apos;/gi;
  const regQuot = /&quot;/gi;
  const regDash = /&#x2013;|-|–/gi;
  const regAnd = /and\s|&amp;|\s&\s/g;
  const regParO = /\(/g;
  const regParC = /\)/g;
  const regWk = /Wk/g;
  const regEq = /=/g
  const regThru = /thru\s/g;
  const regMon = /Mon\.|Mon\s/g;
  const regTue = /Tue\.|Tue\s|Tues(?!d)/g;
  const regWed = /Wed\.|Wed\s/g;
  const regThu = /Thu\.|Thu\s|Thurs\./g;
  const regFri = /Fri\.|Fri\s/g;
  const regSat = /Sat\.|Sat\s/g;
  const regSun = /Sun\.|Sun\s/g;
  const regTradition = /\sT\s|Trad\.|Tradition\s(?!m)/g;
  const regFriFri = /Friday\sFriday/gi;
  const regComma = /,/g;
  const regBr = /<br>/g;
  const regNum = /#’s/g;
  const regAnniv = /Anniv\s|Anniv\./gi;
  const regFullSt = /\./g;
  const regNoSmoke = /non – smoking/gi;



  let myCleanTD = firstTD.html().trim()
    .replace(regQuot, `'`)
    .replace(regApos, '’')
    .replace(regDash, ' – ')
    .replace(regNoSmoke, 'non-smoking')
    .replace(regH4, '')
    .replace(regB, '')
    .replace(regSpan, '')
    .replace(regN, '')
    .replace(regT, '')
    .replace(regBetw, ' between ')
    .replace(regAnd, ' and ')
    // :)
    .replace('S and M', 'S&M')
    .replace('NY', '')
    .replace(/\d{5}/, '')
    .replace(regFirstComma, '')
    .replace(regBr, ';')
    .replace('<div class="detailsBox">', '')
    .replace('</div>', ';')

    .replace("AAvenue", 'Amsterdam Avenue')
    .replace("Amsterdam Avenues", 'Amsterdam Avenue')
    .replace("Bway", 'Broadway')
    .replace("Columbuis Avenue", 'Columbus Avenue')
    .replace('CPW', 'Central Park West')

    .replace('(English-Spanish)', 'English-Spanish')

    .replace('Addtl', 'additional')
    .replace('Wheelcahir', 'Wheelchair')
    .replace('GLBT', 'LGBT')
    .replace('Disc.', 'Discussion')
    .replace('ENT', 'ENTER')
    .replace('Rm ', 'Room ')
    .replace(regThru, 'through ')
    .replace('Ave.', 'Avenue')
    .replace('Wkshp', 'Workshop')
    .replace('St.', 'Street')
    .replace('wk.', 'week')
    .replace(regWk, 'Week')
    .replace('Blvd.', 'Boulevard')
    .replace('Sts', 'Streets')
    .replace('St ', 'Street ')
    .replace(regEq, ' = ')
    .replace(regMon, 'Monday ')
    .replace(regTue, 'Tuesday ')
    .replace(regWed, 'Wednesday ')
    .replace(regThu, 'Thursday ')
    .replace(regFri, 'Friday ')
    .replace(regSat, 'Saturday ')
    .replace(regSun, 'Sunday ')
    .replace(regTradition, ' Tradition meeting ')
    .replace(regNum, 'Numbers')
    .replace(regAnniv, 'Anniversary ')
    .replace('. All', ', all')
    // .replace(regFullSt, ' ')



    .replace('As Bill See it', 'As Bill Sees It')

    //
    .replace(regParO, '')
    .replace(regParC, ';')
    .replace(regComma, ', ')
    .replace(' ,', ', ')
    .replace(regS, ' ')
    // .replace('.', '')

    .trim()

    myCleanTD = myCleanTD.split(';')

    let myEvenCleanerTD = []
    myCleanTD.forEach((e, i) => {

      e = e.replace(regFriFri, 'Friday, Friday').trim().replace(' ,', ', ').replace(/,$/, '').replace(/\.$/, '').trim()
      if (e.length > 1) {
        myEvenCleanerTD.push(e);
      }
    })

    myCleanTD = myEvenCleanerTD

  let locationDetails = [];
  const locationIdentifiers = [
    /chapel/i,
    /floor/i,
    /off/i,
    /^between/i,
    /^@/i,
    /stairs/i,
    /room/i,
    /enter\s/i,
    /Entrance/i,
    /building/i,
    /basement/i,
    /lower level/i,
    /door/i,
    /gym/i,
    /hall/i,
    /way/i,
    /street/i,
    /avenue/i,
    /desk/i,
    /Rectory/i,
    /Cafeteria/i,
    /Library/i,
    /block/i,
    /Kitchen/i,
    /near/i,
    /location/i,
    /A la isquierda de la iglesia/i,
    /Auditorium/i,
    /Mezzanine/i,
    /upstairs/i,
    /church/i,
    /left/i,
    /right/i,
    /elevator/i,
    /Gratitude/i,
    /bell/i
  ];

  myCleanTD.forEach((e, i) => {
    locationIdentifiers.forEach((f, j) => {
      if (f.test(e)) {
        if (locationDetails.indexOf(e) < 0) {
          locationDetails.push(e);
          // myCleanTD.splice(i, 1);
        }
      }
    })
    myCleanTD = myCleanTD.filter( ( el ) => !locationDetails.includes( el ) );
  })

  let dateDetails = [];
  const dateIdentifiers = [
    /=/i,
    /between/i,
    /day/i,
    /11th S Meditation/i,
    /week/i,
    /month/i,
    /July/i,
    /August/i,
    /year/i,
    /\d\d?:\d\d/
  ];

  myCleanTD.forEach((e, i) => {
    dateIdentifiers.forEach((f, j) => {
      if (f.test(e)) {
        if (dateDetails.indexOf(e) < 0) {
          dateDetails.push(e);
          // myCleanTD.splice(i, 1);
        }
      }
    })
    myCleanTD = myCleanTD.filter( ( el ) => !dateDetails.includes( el ) );
  })

  let groupDetails = [];
  const groupIdentifiers = [
    /welcome/i,
    /speaking meeting/i,
    /agnostic/i,
    /men’s/i,
    /non-smoking/i,
    /living sober/i,
    /focus/i,
    /Bilingual/i,
    /Interpreted for the Deaf and Hard of Hearing/i,
    /speaker/i,
    /round robin/i,
    /Big Book/i,
    /No prayers/i,
    /Step/i,
    /LGBT/i,
    /Trans-female focus/i,
    /As Bill Sees It/i,
    /topic/i,
    /Spirituality/i,
    /All\smeetings/i,
    /meditation/i,
    /Literature/i,
    /12 Concepts/i,
    /please/i,
    /Lifestyles/i,
    /language/i
  ];

  myCleanTD.forEach((e, i) => {
    groupIdentifiers.forEach((f, j) => {
      if (f.test(e)) {
        if (groupDetails.indexOf(e) < 0) {
          groupDetails.push(e);
          // myCleanTD.splice(i, 1);
        }
      }
    })
    myCleanTD = myCleanTD.filter( ( el ) => !groupDetails.includes( el ) );
  })

  myCleanTD.forEach((e, i) => {
    locationDetails.push(e);
  })


  details = {
    // location: locationDetails,
    // date: dateDetails,
    // group: groupDetails,
    leftover: myCleanTD
  }
  return details
}
