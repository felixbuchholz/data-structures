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
let meetingTable = [];
let groupTable = [];
let locationTable = [];
let addressTable = [];
let dateTable = [];

let zone = 1;
let groupPK = 0; //solved
let locationPK = 0; //solved
let addressPK = 0; //solved
let datePK = 1;

async function processFiles(paths) {
  for (const path of paths) {
      console.log('******************************************');
      console.log(path);

    const content = await readFile(path);
    const $ = cheerio.load(content);
    const row = $('tr')

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
        const regItemDelimiter = /,|@|Rm\s|\D-\D|\(/;
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
        dateArr.forEach((dateElem, dateIndex) => {

          // only if the line starts with a day create a date object with the information
          const isDay = dateElem.match(/[SMTWF]\w+?days/g)
          if (isDay != null && isDay != undefined && isDay != '') {

          // CREATE GROUP OBJECT
          let group;
          if (!groupTable.some(e => e.name === getGroupName($, firstTD))) {
              groupPK++;
              group = {
                groupPK: groupPK,
                name: getGroupName($, firstTD).replace(/[\s]+/g, ' '),
                description: getDetails('group', firstTD),
                scheduleDetails: getDetails('date', firstTD),
              }
              groupTable.push(group)
          } else {
            const tableIndex = groupTable.findIndex(function(e) {
              return e.name == getGroupName($, firstTD)
            })
            group = {
              groupPK: groupTable[tableIndex].groupPK,
              name: getGroupName($, firstTD).replace(/[\s]+/g, ' '),
              description: getDetails('group', firstTD),
              scheduleDetails: getDetails('date', firstTD),
            }
            // groupTable.push(group)
          }



          // CREATE DATE OBJECT
            const date = {
              datePK: datePK,
              day: dateElem.match(/[SMTWF]\w+?days/g)[0],
              start: dateElem.match(/\d\d?:\d\d [A|P]M/g)[0],
              end: dateElem.match(/\d\d?:\d\d [A|P]M/g)[1],
              meetingType: dateElem.match(/(?<=Meeting Type\<\/b\> )[A-Z]{1,2}/g) ? dateElem.match(/(?<=Meeting Type\<\/b\> )[A-Z]{1,2}/g)[0] : 'none',
              specialInterest: dateElem.match(/(?<=Special Interest\<\/b\> )(.*)/g) ? dateElem.match(/(?<=Special Interest\<\/b\> )(.*)/g)[0] : 'none'
            }
            dateTable.push(date);

            // CREATE ADDRESS OBJECT
            let address;
            if (!addressTable.some(e => e.street === getStreet(delArr))) {
                addressPK++;
                address = {
                  addressPK: addressPK,
                  lat: 0,
                  long: 0,
                  street: getStreet(delArr),
                  city: 'NY',
                  zipcode: getZipcode($, rowElem, delArr),
                  zone: zone
                }
                addressTable.push(address);
            } else {
              const tableIndex = addressTable.findIndex(function(e) {
                return e.street == getStreet(delArr)
              })
              address = {
                addressPK: addressTable[tableIndex].addressPK,
                lat: 0,
                long: 0,
                street: getStreet(delArr),
                city: 'NY',
                zipcode: $(rowElem).text().match(/\d{5}/g),
                zone: zone
              }
              // addressTable.push(address);
            }



            // CREATE LOCATION OBJECT
            let location;
            let equalDetails;
            let equalAddress;
            let equalLocation;
            let tableIndex = -1
            for (var i = 0; i < locationTable.length; i++) {
              if (locationTable[i].details.join() == getDetails('location', firstTD).join()) {
                equalDetails = true;
                if (locationTable[i].addressFK == address.addressPK) {
                  equalAddress = true;
                  tableIndex = i;
                }
              }
            }
            equalLocation = equalDetails && equalAddress;
            if (!equalLocation) {
                locationPK++;
                console.log('new', locationPK);
                location = {
                  locationPK : locationPK,
                  name : $('h4', firstTD).text(),
                  details : getDetails('location', firstTD),
                  wheelchairAccess : $(rowElem).text().includes('Wheelchair')? true : false,
                  addressFK: address.addressPK,
                  // address: address
                }
                locationTable.push(location)
            } else {
              // const tableIndex = locationTable.findIndex(function(e) {
              //   return e.details.sort().join() == getDetails('location', firstTD).sort().join()
              // })
              console.log('old', tableIndex);
              location = {
                locationPK : locationTable[tableIndex].locationPK,
                name : $('h4', firstTD).text(),
                details : getDetails('location', firstTD),
                wheelchairAccess : $(rowElem).text().includes('Wheelchair')? true : false,
                addressFK: address.addressPK,
                // address: address
              }
            }



            // CREATE MEETING OBJECT
              meeting = {
                meetingPK: meetingPK,
                groupFK: group.groupPK,
                dateFK: datePK,
                locationFK: location.locationPK,
                group: group,
                date: date,
                location: location,
                zone: zone
              }

              const justMeetingTable = {
                meetingPK: meetingPK,
                groupFK: group.groupPK,
                dateFK: datePK,
                locationFK: location.locationPK,
              }

              meetingTable.push(justMeetingTable)


              // console.log(location.details);
              meetings.push(meeting)






              // console.log(meeting.group.details, meeting.location.details);
              datePK++;
              meetingPK++;



          }; // if isDay == true
        }) // dateArr.forEach
      } // if style == margin-bottom:10px
    }) // rows
    zone++;
  } // for … of paths
  writeFile('data/parsed/parsed-nested-1level.json', JSON.stringify(meetings, null, 2));
  writeFile('data/parsed/parsed-meetingTable.json', JSON.stringify(meetingTable, null, 2));
  writeFile('data/parsed/parsed-groupTable.json', JSON.stringify(groupTable, null, 2));
  writeFile('data/parsed/parsed-addressTable.json', JSON.stringify(addressTable, null, 2));
  writeFile('data/parsed/parsed-locationTable.json', JSON.stringify(locationTable, null, 2));
  writeFile('data/parsed/parsed-dateTable.json', JSON.stringify(dateTable, null, 2));
  // console.log('Done!');
}

processFiles(paths)

function arraysEqual(arr1, arr2) {
    if(arr1.length !== arr2.length)
        return false;
    for(var i = arr1.length; i--;) {
        if(arr1[i] !== arr2[i])
            return false;
    }

    return true;
}

function getZipcode($, rowElem, delArr) {
  if (getStreet(delArr) == '22 Barclay Street') {
    return '10007';
  } else if (getStreet(delArr) == '152 west 71st street') {
    return '10023';
  } else {
    return $(rowElem).text().match(/\d{5}/g);

  }
}

// TODO: remove the second number for the geodata request
// Central Park West and 76th Street, 4 W 76th St
function getStreet (delArr) {
  return delArr[0].replace('&amp;', 'and')
    .replace('Central Park West and 76th Street', '4 West 76th Street')
    .replace('189th Street and Bennett Avenue', '178 Bennett Avenue')
    .replace('. Meeting in the gym.', '')
    .replace('Blvd.', 'Boulevard')
    .replace('W.', 'West')
    .replace(/St\W/, 'Street')
    .replace('&apos;', '’')
    .replace(/Stree$/, 'Street')
    .trim()
}

function getGroupName($, firstTD) {
  let groupName = $('b', firstTD).text();
  groupName = groupName.split('-')[0].trim();
  return groupName
}

function getDetails(selectedDetails, firstTD) {
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
  const regDash = /&#x2013;|-\D|–/gi;
  const regAnd = /and\s|&amp;|\s&\s/g;
  const regParO = /\(/g;
  const regParC = /\)/g;
  const regWk = /Wk/g;
  const regEq = /=/g
  const regThru = /thru\s/g;
  const regMon = /Mon\.|Mon\s|Mon\)/g;
  const regTue = /Tue\.|Tue\s|Tues(?!d)/g;
  const regWed = /Wed\.|Wed\s/g;
  const regThu = /Thu\.|Thu\s|Thurs\.|Thu\)/g;
  const regFri = /Fri\.|Fri\s/g;
  const regSat = /Sat\.|Sat\s/g;
  const regSun = /Sun\.|Sun\s/g;
  const regTradition = /\bT\s|Trad\.|Trad\s|Tradition\s(?!m)/g;
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
    // .replace(regDash, ' – ')
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
    .replace(/\*+/gi, '')
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

      e = e.replace(regFriFri, 'Friday, Friday').trim().replace(' ,', ', ').replace(/,$/, '').replace(/^,/, '').replace(/\.$/, '').trim();
      e = e.charAt(0).toUpperCase() + e.slice(1);;
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
    /bell/i,
    /wheelchair/i,
    /Sanctuary/i
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
    /\d\d?:\d\d/,
    /when applicable/i
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
    /language/i,
    /@yahoo.com/i,
    /@gmail.com/i,
    /young people/i,
    /tradition meeting/i
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

  // myCleanTD.forEach((e, i) => {
  //   locationDetails.push(e);
  // })
  //
  // details = {
  //   location: locationDetails,
  //   date: dateDetails,
  //   group: groupDetails,
  //   leftover: myCleanTD
  // }
  if (selectedDetails == 'location') {
    return locationDetails;
  } else if (selectedDetails == 'group') {
    return groupDetails;
  } else if (selectedDetails == 'date') {
    return dateDetails;
  }
}
