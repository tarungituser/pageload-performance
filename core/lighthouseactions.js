const lighthouse = require('lighthouse');
const chromeLauncher = require('chrome-launcher');
const fs = require('fs');
const lh = require('../core/lighthouseactions.js');
const config = require('../config/testconfig.json');
const executionConfig = require('../config/execution-config.js');

var reportsSavingPath = executionConfig.reportsSavingPath;

/**
 * This method will used to get perf metrics
 * @param {*} reportName : Report Name
 * @param {*} url : Url
 * @param {*} opts : Config Options
 * @param {*} config : COnfig
 */
async function launchChromeAndRunLighthouseGetResult(reportName, url, opts, config = null) {
    return chromeLauncher.launch({ chromeFlags: opts.chromeFlags }).then(async chrome => {
        opts.port = chrome.port;
        const results = await lighthouse(url, opts, config);
        res = await results.report;
        //Generating the HTML reports
        if(!(reportsSavingPath=="" || reportsSavingPath==undefined))
        {
        fs.writeFile(reportsSavingPath + reportName + ".html", await res, function (err) {
            console.log('Step 1');
            if (err) {
                return console.log(err);
            }
            return 0;
        });
        }
        chrome.kill(function (err) {
            console.log(err);
        });
        return results.lhr;
    });
}

module.exports = {
    launchChromeAndRunLighthouseGetResult
}

