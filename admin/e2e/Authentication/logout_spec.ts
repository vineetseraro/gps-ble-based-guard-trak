import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Logout e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('./Authentication_TestData.json');         // Authentication-TestData.json conatins all test datasets
  let Obj_Rep = require('../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT


  /// Logout from the application////
  it('Logout from the application', () => {
    page.click("logoutButton_xpath");
    page.verifyText("loginPageHeading_class",  Obj_Rep.loginPageHeading_text);

  });

});