const log = require('lighthouse-logger');
const lh = require('../core/lighthouseactions.js');
const elastic = require('../core/elasticpump.js');
const config = require('../config/testconfig.json');
var testUrl = require('../testdata.json');
var lighthouseConfig = require('../config/lighthouse-config.js');
var executionConfig = require('../config/execution-config.js');
const stepLogger = require('../core/steplogger.js');
const fs = require('fs');

/**
 * Getting the config data for perf execution.
 */
const fcpBenchMark = config.fcpBenchMark;
const fmpBenchMark = config.fmpBenchMark;
const siBenchMark = config.siBenchMark;
const ttiBenchMark = config.ttiBenchMark;
const seoScoreBenchmark = config.seoScoreBenchmark;
const accessibilityScoreBenchmark = config.accessibilityScoreBenchmark;
var testdata = testUrl["testurls"];
var executionEnvironment = lighthouseConfig.executionEnvironment;
var reportSavingDispalyPath = executionConfig.reportSavingDispalyPath;
var elasticIndex = executionConfig.elasticIndex;

/**
 * Setting up lighthouse execution options.
 */
const opts = {
    output: 'html',
    emulatedFormFactor: executionEnvironment,
    logLevel: 'info',
    onlyCategories: ['performance', 'seo', 'accessibility', 'best-practices'],
    view: true,
    throttlingMethod: lighthouseConfig.throttlingMethod,
    disableStorageReset: false
};


testdata.forEach(async (url) => {
 describe(`${executionEnvironment} - Page Load Performance for - ${url}`,  () => {

    var fcpActual;
    var fmpActual;
    var siActual;
    var ttiActual;
    var seoScoreActual;
    var accessibilityScoreActual;
    var reportName;
    var fullReportPath;

    beforeAll( async () => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 100000;
        browser.waitForAngularEnabled(false);
        const givenUrl = new URL(url);
        var date = new Date();
        var day = date.getDate() + "-" + (date.getMonth()+1) + "-" + date.getFullYear();
        reportName = day + givenUrl.pathname.replace(/\//g, '-') + "h" + date.getHours() + "m" + date.getMinutes() + "s" + date.getSeconds() + executionEnvironment;
        fullReportPath = reportSavingDispalyPath + reportName + ".html";
        await lh.launchChromeAndRunLighthouseGetResult(reportName, url, opts).then(results => {
            log.setLevel(opts.logLevel);
            fcpActual = results.audits['first-contentful-paint'].numericValue;
            console.log(`Actual First Contentful Paint = ${fcpActual} ms`);
            fmpActual = results.audits['first-meaningful-paint'].numericValue;
            console.log(`Actual First Meaningful Paint = ${fmpActual} ms`);
            siActual = results.audits['speed-index'].numericValue;
            console.log(`Actual Speed Index = ${siActual} ms`);
            ttiActual = results.audits.interactive.numericValue;
            console.log(`Actual Time to Interactive = ${ttiActual} ms`);
            seoScoreActual = (results.categories.seo.score) * 100;
            console.log(`Actual SEO Score = ${seoScoreActual}`);
            accessibilityScoreActual = (results.categories.accessibility.score) * 100;
            console.log(`Actual Accessibility Score = ${accessibilityScoreActual}`);
      });

      

      var pageMetrics = {
           "pageUrl" : givenUrl,
           "device" : executionEnvironment,
           "accessibility" : accessibilityScoreActual,
           "seo" : seoScoreActual,
           "fcp" : fcpActual,
           "fmp" : fmpActual,
           "speedIndex" : siActual,
           "tti" : ttiActual,
           "timestamp" : date,
           "fullReportPath" : fullReportPath
      };

      /**
       * Pushing perf metrics into elastic search DB.
       */
      if(!elasticIndex=="")
      {
          await elastic.pumpData(pageMetrics);
      }
      else
      {
          console.log("No call to Elastic Search, Index Value = " + elasticIndex);
      }
      
      

    });
    
    it(`Verify First Contentful Paint - ${url}`, async () => {
        stepLogger.createStep(`Actual First Contentful Paint = ${fcpActual} ms`);
        var fcpBenchMarkMeets = (fcpActual<=fcpBenchMark);  
        expect(fcpBenchMarkMeets).toBe(true, `First Contentful Paint does not meets the expected benchmark, Actual=${fcpActual} ms  Benchmark=${fcpBenchMark} ms`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });

    it(`Verify First Meaningful Paint - ${url}`, async () => {
        stepLogger.createStep(`Actual First Meaningful Paint = ${fmpActual} ms`);
        var fmpBenchMarkMeets = (fmpActual<=fmpBenchMark);  
        expect(fmpBenchMarkMeets).toBe(true, `First Meaningful Paint does not meets the expected benchmark, Actual=${fmpActual} ms  Benchmark=${fmpBenchMark} ms`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });

    it(`Verify Speed Index - ${url}`, async () => {
        stepLogger.createStep(`Actual Speed Index = ${siActual} ms`);
        var siBenchMarkMeets = (siActual<=siBenchMark);  
        expect(siBenchMarkMeets).toBe(true, `Speed Index does not meets the expected benchmark, Actual=${siActual} ms  Benchmark=${siBenchMark} ms`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });

    it(`Verify Time To Interactive - ${url}`, async () => {
        stepLogger.createStep(`Actual Time to Interactive = ${ttiActual} ms`);
        var ttiBenchMarkMeets = (ttiActual<=ttiBenchMark);  
        expect(ttiBenchMarkMeets).toBe(true, `Time to Interactive does not meets the expected benchmark, Actual=${ttiActual} ms  Benchmark=${ttiBenchMark} ms`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });

    it(`Verify SEO Score - ${url}`, async () => {
        stepLogger.createStep(`Actual SEO Score = ${seoScoreActual}`);
        var seoBenchMarkMeets = (seoScoreActual>=seoScoreBenchmark);  
        expect(seoBenchMarkMeets).toBe(true, `SEO Score does not meets the expected benchmark, Actual=${seoScoreActual}   Benchmark=${seoScoreBenchmark}`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });

    it(`Verify Accessibility Score - ${url}`, async () => {
        stepLogger.createStep(`Actual Accessibility Score = ${accessibilityScoreActual}`);
        var accessibilityBenchMarkMeets = (accessibilityScoreActual>=accessibilityScoreBenchmark);  
        expect(accessibilityBenchMarkMeets).toBe(true, `Accessibility Score does not meets the expected benchmark, Actual=${accessibilityScoreActual}   Benchmark=${accessibilityScoreBenchmark}`);
        stepLogger.createStep(`Full HTML Report Path:- ${fullReportPath}`);
    });
});
});


