require('dotenv').config();

// go to https://console.cloud.google.com/projectselector2/iam-admin/serviceaccounts
// and create your key
const keyFile = require('../keys/key.json');

const { google } = require('googleapis');

// const { get } = require('js-cookie');
const scopes = 'https://www.googleapis.com/auth/analytics.readonly'
const jwt = new google.auth.JWT(process.env.CLIENT_EMAIL, keyFile, process.env.PRIVATE_KEY, scopes)

const viewId = process.env.VIEW_ID_HAMAMCI;

const reportRequests = [
  {
    viewId,
    dimensions: [
      // {
      //   name: 'ga:productListName'
      // },
      {
        name: 'ga:productSku'
      }
    ],
    // dimensionFilterClauses: [
    //   {
    //     // operator: ,
    //     filters: [
    //       {
    //         operator: 'IN_LIST',
    //         dimensionName: 'ga:productSku',
    //         expressions: [
    //           '8680005038080',
    //           '8680005036574',
    //           '8680005101296',
    //           '8680005103344',
    //           '8680005103580',
    //           '8680005107618',
    //           '8680005111172',
    //           '8680005115576',
    //           '8680005115590'
    //         ]
    //       }
    //     ]
    //   }
    // ],
    dateRanges: [
      {
        startDate: '30daysAgo',
        endDate: '2020-10-13',
      },
    ],
    metrics: [
      {
        expression: 'ga:itemRevenue'
      },
      {
        expression: 'ga:productDetailViews'
      }
    ],
  },
]


async function getData() {
  const response = await jwt.authorize();

  const analyticsreporting = google.analyticsreporting({
    version: 'v4',
    auth: jwt
  });

  const res = await analyticsreporting.reports.batchGet({
    requestBody: {
      reportRequests
    },
  });

  // const v4 = await google.analyticsreporting('v4').reports.batchGet({
  //   auth: jwt,
  //   resource: reportRequests,
  // }, (error, response) => {
  //   // error && console.log('https://www.soundcloud.com/ambient-occlusion');
  //   response && console.log('response', JSON.stringify(response));
  //   return JSON.stringify(response);
  // });
  // console.log('v4', res.data);

  // const result = await google.analytics('v3').data.ga.get({
  //   'auth': jwt,
  //   'ids': 'ga:' + viewId,
  //   'start-date': '30daysAgo',
  //   'end-date': 'today',
  //   'metrics': 'ga:pageviews'
  // });

  console.log(JSON.stringify(res.data.reports[0].data.rows));
  return res.data.reports[0].data.rows.sort((a, b) => (+b.metrics[0].values[0] / +b.metrics[0].values[1]) - (+a.metrics[0].values[0] / +a.metrics[0].values[1]) );
  // return result.data;
  // console.dir(result)
}

// getData();

module.exports.getData = getData;