// Protractor configuration file, see link for more information
// https://github.com/angular/protractor/blob/master/lib/config.ts

const { SpecReporter } = require('jasmine-spec-reporter');
var Jasmine2HtmlReporter  = require('protractor-jasmine2-html-reporter');
var jasmineReporters = require('jasmine-reporters');

var today = new Date(),
timeStamp = today.getMonth() + 1 + '-' + today.getDate() + '-' + today.getFullYear() + '-' + today.getHours() + 'h' + today.getMinutes() + 'm' + today.getSeconds() + 's';

var reporter = new Jasmine2HtmlReporter({
  savePath: './TestResults/Run-' + timeStamp,
  screenshotsFolder: 'Screenshots',
  fixedScreenshotName: true,
  fileName: 'e2e-tests-report.html',
  cleanDestination: false,

});

exports.config = {
  allScriptsTimeout: 180000,
  getPageTimeout: 120000,
  suites: {

    login : ['./e2e/Authentication/login_spec.ts'],
    catalog_master :[

     // './e2e/catalog_master/tags_spec.ts',
    // './e2e/catalog_master/tags_spec.ts',
      // './e2e/catalog_master/products_spec.ts',
     // './e2e/catalog_master/locations_spec.ts',
      //'./e2e/catalog_master/tags_spec.ts',
      //'./e2e/catalog_master/products_spec.ts',
      //'./e2e/catalog_master/locations_spec.ts',
      //'./e2e/catalog_master/attributes_spec.ts',
      //'./e2e/catalog_master/categories_spec.ts',
    
      //'./e2e/catalog_master/collections_spec.ts',

    ],
    discrete_flows :[

      './e2e/Discrete_Flows/CreateMasterData_e2e/CreateMasterData_e2e_spec.ts',         //Ankit
      //'./e2e/Discrete_Flows/SyncAndMapBeaconData_e2e/SyncAndMapBeaconData_e2e_spec.ts', //Vijay
      //'./e2e/Discrete_Flows/CreateUserRolesAndAssignGroups_e2e/CreateUserRolesAndAssignGroups_e2e_spec.ts' //Purnima



    ],
    logout : ['./e2e/Authentication/logout_spec.ts'],

  },

  capabilities: {
    'browserName': 'chrome',
  },

  directConnect: true,
  baseUrl: 'http://localhost:4200/',
  framework: 'jasmine',

  jasmineNodeOpts: {
    showColors: true,
    defaultTimeoutInterval: 120000,
    print: function() {}
  },

  beforeLaunch: function() {
    require('ts-node').register({
      project: 'e2e/tsconfig.e2e.json'
    });
  },

  // Assign the test reporter to each running instance
  onPrepare() {
    jasmine.getEnv().addReporter(new SpecReporter({ spec: { displayStacktrace: true } }));
    jasmine.getEnv().addReporter(reporter);
    jasmine.getEnv().addReporter(new jasmineReporters.JUnitXmlReporter({
    consolidateAll: true,
    savePath: './TestResults/Run-' + timeStamp,
    filePrefix: 'ExecutionLog'
}));
    //browser.ignoreSynchronization = true;
  },

};
