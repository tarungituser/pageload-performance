# CMS Page Load Performance

This project is for getting page load performance metrics using lighthouse and perform validations with expected benchmark with html report generation.

## Getting Started

### Tech Stack
* Page Load Performance Tool - Lighthouse - Node Library  (Version - 4.3.1)
* Testing Framework - Jasmine
* Reporting - Jasmine Allure Reporting
* Programming Language - JavaScript
* Running Environment - Node

### Prerequisites

* Node Environment

### How to Utilize?

* Clone the project from github.

* Setup the benchmark for First Contentful Paint, Speed Index and Time to Interactive in ms in testconfig.json file which is available at root level. Eg.
```
{

"fcpBenchMark": 2000,

"siBenchMark": 4000,

"ttiBenchMark": 10000

}
```

* Setup the test data i.e. page urls on which you wanted to perform page load test execution in testdata.json file which is available at root level. Eg.
```
{

"testurls": [

"https://microsoft.com",

"https://www.amazon.com",

"https://node.org"

]

}
```

* Perform the following commands for page load performance execution:
```
1) npm install - To get all required node libraries.
2) npm run preprotractor - Prerequisite required first time only, make sure to update chrome version w.r.t. you your current chrome version in package.json(scripts->preprotractor)
3) npm run perftest - For Page Load Test Execution.
4) npm run perf-report - For Generating HTML Reports at root level by name "allure-report"
5) allure serve - To host html reports in local [make sure to have allure in local](https://stackoverflow.com/questions/70885555/allure-report-generation-fails-with-message-allure-is-not-recognized-as-the-n)
```

## Running the tests via Jenkins

* Go to Jenkins Job after hosting abd creating pipeline using jenkins file.
* Build with Parameters with your email id, where you want test execution completion notification and test report link.

* After execution you will get the notification email with report link in the email body.

NOTE: This execution will be executed with default benchmark and test data which is available at master branch.

## Authors

* **TARUN KUMAR** 
