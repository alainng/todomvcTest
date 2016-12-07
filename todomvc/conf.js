exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  capabilities: {
    'browserName': 'chrome'
  },
  
  specs: ['spec.js'],
  
  jasmineNodeOpts: {
    showColors: true
  },
  framework: 'jasmine2',
  
  onPrepare: function() {
    var jasmineReporters = require('jasmine-reporters');

    // returning the promise makes protractor wait for the reporter config before executing tests
    return browser.getProcessedConfig().then(function(config) {
        var browserName = config.capabilities.browserName;

        var junitReporter = new jasmineReporters.JUnitXmlReporter({
            consolidateAll: false,
            savePath: 'xmlreports',
            modifyReportFileName: function(generatedFileName, suite) {
                return browserName + '.' + generatedFileName;
            }
        });
        jasmine.getEnv().addReporter(junitReporter);
    });
  },
  
};