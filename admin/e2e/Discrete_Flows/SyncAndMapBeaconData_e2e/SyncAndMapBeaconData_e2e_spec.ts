import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Sync Beacon Data e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('./Beacons_TestData.json');         // Masters_TestData.json conatins all test datasets
  let Obj_Rep = require('../../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT
  let random = require('../../ak-Random.json');             // ak-Random.json contains a random code generated at runtime
  
  beforeAll(() => {
    // Expanding menu
    page.click("menuExpandButton_class");
    browser.sleep(2000);;

  });

  afterAll(() => {
    // Collapsing menu
    page.click("menuExpandButton_class");
    browser.sleep(2000);;

  });

  /// Check the sync Beacon Functionality////
  it('Check the sync beacon Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuThings_xpath");
    browser.sleep(2000);
    // clicking Tags link
    page.click("menuBeacons_id");
   // page.click("addTagButton_class");
    //page.type("addTag_Name_id", testData.tag.tag_name + random.randomCode);
    //page.click("saveTagButton_id");
    //page.type("searchTagByName_xpath", testData.tag.tag_name + random.randomCode);      //Search Tag by name
    //page.verifyText("searchTag_Name_xpath", testData.tag.tag_name + random.randomCode); //Check if tag name matches
    //page.verifyText("searchTag_Status_xpath", "Y");  //Check if status is active
  
  });

  
});