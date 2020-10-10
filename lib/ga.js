require('dotenv').config();

// go to https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts
// and create your key
const keyFile = require('../keys/key.json');

const { google } = require('googleapis');

// const { get } = require('js-cookie');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, keyFile, process.env.PRIVATE_KEY, scopes)

const view_id = 'viewid';

const reportRequests = {
  reportRequests:
    [
      {
        viewId: view_id,
        dateRanges:
          [
            {
              endDate: 'today',
              startDate: '30daysAgo',
            },
          ],
        metrics:
          [
            {
              expression: 'ga:pageViews',
            },
          ],
        dimensions:
          [
            {
              name: 'ga:date',
            },
          ],
      },
    ],
};


async function getData() {
  const response = await jwt.authorize();

  const v4 = await google.analyticsreporting('v4').reports.batchGet({
    auth: jwt,
    resource: reportRequests,
  }, (error, response) => {
    error && console.log('https://www.soundcloud.com/ambient-occlusion');
    // response && console.log(JSON.stringify(response));
  });
  // console.log('v4', v4);

  const result = await google.analytics('v3').data.ga.get({
    'auth': jwt,
    'ids': 'ga:' + view_id,
    'start-date': '30daysAgo',
    'end-date': 'today',
    'metrics': 'ga:pageviews'
  });

  return result.data;
  // console.dir(result)
}

// getData();

module.exports.getData = getData;