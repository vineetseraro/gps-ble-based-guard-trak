import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Login e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('./Authentication_TestData.json');         // Authentication-TestData.json conatins all test datasets
  let Obj_Rep = require('../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT
  let randomCode = Math.floor(Math.random()*(10000-1)) + 2;
  let random = require('../ak-Random.json');             // ak-Random.json contains a random code generated at runtime
  random.randomCode = randomCode;                        // Generating one-time random code
  console.log(random.randomCode);

  /// Check Login Page is displayed correctly ////
  it('Check Login Page is displayed correctly', () => {
    page.navigateTo('/');
    browser.driver.manage().window().maximize();
    page.verifyText("loginPageHeading_class",  Obj_Rep.loginPageHeading_text); //Verify Heading of Login Page

  });

 // Check the Login functionality ////
  it('Check Login Functionality', () => {
    page.type("username_id", testData.login.username);
    page.type("password_id", testData.login.password);
    page.click("loginButton_id");
    // expect(page.isElementPresent("logoutButton_xpath")).toEqual(true); //Verify logout button is visible
  });

});