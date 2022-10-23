var rp = require('request-promise');
const config = require('../config/testconfig.json');

var elasticBaseUri = config.elasticBaseUri;
var elasticIndex = process.env.ELASTICINDEX || '';

async function pumpData(pumpData)
{
    var requestOpts = {
        uri: elasticBaseUri+elasticIndex,
        method: 'POST',
        json: true,
        body:    {
            "pageurl" : pumpData.pageUrl,
            "device" : pumpData.device,
            "accessibility" : pumpData.accessibility,
            "seo" : pumpData.seo,
            "first-contentful-paint" : pumpData.fcp,
            "first-meaningful-paint" : pumpData.fmp,
            "speed-index" : pumpData.speedIndex,
            "time-to-interactive" : pumpData.tti,
            "timestamp" : pumpData.timestamp,
            "fullReportPath" : pumpData.fullReportPath
          }
    };
    
    rp(requestOpts)
    .then(function(parsedBody) {
        console.log("Elastic Success Response:-  " + JSON.stringify(parsedBody));
    })
    .catch(function(err) {
        console.log("Elastic Error Response" + err);
    });
}

module.exports = {
    pumpData
}

