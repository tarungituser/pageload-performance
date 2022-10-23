exports.config = {
  //seleniumAddress: 'http://localhost:4444/wd/hub',
    capabilities: {
        browserName: 'chrome'
      },
    specs: ['test/perf.spec.js'],
    framework: 'jasmine2',
    directConnect: true,
    useAllAngular2AppRoots: true,

    onPrepare: function() {
        var AllureReporter = require('jasmine-allure-reporter');
    jasmine.getEnv().addReporter(new AllureReporter({
      resultsDir: 'allure-results'
    }));
    }
}