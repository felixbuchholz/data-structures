const fs = require('fs');
const cheerio = require('cheerio');
const util = require('util')
// const titleCase = require('title-case');

// this is the file that we created in the starter code from last week
const content = fs.readFileSync('data/aa06.txt');

// load `content` into a cheerio object
const $ = cheerio.load(content);


$('tr').each(function(i, elem) {
  const row = $(elem).text();

  if ($(elem).attr('style') == 'margin-bottom:10px') {

    // Assign first and second TD element
    let firstTD = $('td', elem).eq(0);
    let secondTD = $('td', elem).eq(1);
    let thirdTD = $('td', elem).eq(2);


    // LOCATION name
    // console.log($('h4', firstTD).text());
    const locationName = $('h4', firstTD).text();

    // GROUP name (meeting name), select
    let groupName = $('b', firstTD).text();

      // Group name, clean
        // Use only first part before the '-',
        // split and select first element of the array:
        groupName = groupName.split('-')[0];
        // Problem 1: all groupNames should be formated like this: 111th
          // Two digits followed by two characters (wihtout space):
        // Title Case
        // groupName = titleCase(groupName);
        // console.log(groupName);

      // <br>-spilt Array:
      const brSplitArr = firstTD.html().split("<br>")
      // console.log(i, brSplitArr[2]);

      // ADDRESS, everything between the second and third <br>
      const addressFirstLine = brSplitArr[2].trim();

      // ADDRESS street
      const regItemDelimiter = /[,.-]/
      const delArr = addressFirstLine.split(regItemDelimiter)
      const street = delArr[0].replace('&amp;', 'and');
      // console.log(i, street);

      // ADDRESS junction in second line
      const addressSecondLine = brSplitArr[3].trim();
      // console.log(addressSecondLine);

      // ADDRESS junction selection
      //Use regex to find the signifiers "Between" (and alternatives) and "and", "&amp;" and split the string at the right postions
      const regBetw = /Between|Betw.|Betw|Btw.|Btw/i
      const regPar = /\(|\)|\./g;
      const regAnd = /and|\&amp\;/g;
      // Negative lookaheads
      const regAm = /Amsterdam(?!\s)/;
      const regCol = /Columbus(?!\s)/;

      // Needed for address details, here and later:
      let details = [];
      const regEnter = /\bEnter\b.*/gi;
      const regAt = /(@.*)/g;

      // ADDRESS junction cleaning
      const juncArr = addressSecondLine.replace(regBetw, "(").replace(regPar, '')
          .replace('NY', '')
          .replace(/\d{5}/, '')
          .replace("AAvenue", 'Amsterdam Avenue')
          .replace("Amsterdam Avenues", 'Amsterdam Avenue')
          .replace("Bway", 'Broadway')
          .replace("Columbuis Avenue", 'Columbus Avenue')
          .replace('CPW', 'Central Park West')
          .replace('@Corner of', '')
          .trim().split(regAnd);

      if (juncArr.length == 2) {
        juncArr.forEach((e, i) => {
          juncArr[i] = juncArr[i]
            .trim()
            .split(regItemDelimiter)[0]
            .replace(regAm, 'Amsterdam Avenue')
            .replace(regCol, 'Columbus Avenue')
        })
        // Order alphabetically
        juncArr.sort()
        // console.log(i, juncArr);
      }

      // ADDRESS details left over by the junction array
        else {
          const juncLeft = juncArr[0]
          if (juncLeft && !regEnter.test(juncLeft) && !regAt.test(juncLeft)) {
            // console.log(juncLeft);
            details.push(juncLeft);
          }
        }

      // ADDRESS enter details by regex
      const regNYDelimiter = /\)|NY|<|@/i;
      if (row.match(regEnter)) {
        const enterDetail = row.match(regEnter)[0].split(regNYDelimiter)[0].trim();
        if (enterDetail.length > 0) {
          // console.log(i, enterDetail);
          details.push(enterDetail);
        }
      };

      // ADDRESS at details by regex

      if (row.match(regAt)) {
        const regNYDelimiterWithoutAt = /\)|NY|</i;
        const atDetail = row.match(regAt)[0].split(regNYDelimiterWithoutAt)[0].trim();
        if (atDetail.length > 9) {
          details.push(atDetail);
        }
      };

      // ADDRESS details in first line
      for (var j = 1; j < delArr.length; j++) {
        const detail = delArr[j].trim()
        // Filter out the zip codes and empty entries:
        if (!detail.match(/\d{5}/) && detail) {
          details.push(detail);
        }
      }

      // ADDRESS zip code
      const regZip = /\d{5}/g;
      const zipcode = row.match(regZip);
      // console.log(i, zipcode);


      // GROUP details
      let groupDetails = [];
      let detailsBox = $('td .detailsBox', elem).html()
      if (detailsBox) {
        detailsBox = detailsBox.trim()
        .replace('&apos;', '’')
        .replace('&amp;', 'and')
        .split('<br>');

        detailsBox.forEach((e, j) => {
          if (e != null && e != '' && e != undefined) {
            // If you want to put out list items later, maybe splitting the array further would be good:
            // console.log(i, e.trim().split(/[\,\;]/g));
            groupDetails.push(e.trim());
          }
        })
        // console.log(i, groupDetails);
      }

      // LOCATION wheelchair access
      const wheelchairAccess = $(elem).text().includes('Wheelchair')? true : false;
      // console.log(i, wheelchairAccess);

      // DATES
      let meetingList = secondTD.html().trim().split('<br>\n                    \t<br>')
      meetingList = meetingList.forEach((e, j) => {
        // console.log(e);
        console.log(i, j, e.match(/[SMTWF]\w+?days/g));
        console.log(i, j, e.match(/\d\d?:\d\d [A|P]M/g));
        console.log(i, j, e.match(/(?<=Meeting Type\<\/b\> )[A-Z]{1,2}/g));
        console.log(i, j, e.match(/(?<=Special Interest\<\/b\> )(.*)/g));
      })
      let days = secondTD;
      let times = secondTD.text().match(/\d\d?:\d\d [A|P]M/g);
      // console.log(i, days, times);

  }
});
