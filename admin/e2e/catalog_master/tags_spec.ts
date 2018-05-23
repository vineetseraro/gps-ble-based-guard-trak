import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Tags e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('../ak-ObjectRepository.json');         // ak-TestData.json conatins all test datasets
  let Obj_Rep = require('../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT
  let random = require('../ak-Random.json');             // ak-Random.json contains a random code generated at runtime
  
  beforeAll(() => {
    // Expanding menu
    page.click("menuExpandButton_class");
    browser.sleep(2000);

  });

  afterAll(() => {
    // Collapsing menu
    page.click("menuExpandButton_class");
    browser.sleep(2000);

  });

  /// Check the Tags Listing Page opens////
  it('Check the Tags Listing Page opens', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    page.click("menuTags_id");
    page.verifyText("tagsPageHeading_class",  Obj_Rep.tagsPageHeading_text); //Verify Heading of Tags Page

  });

 /// Check the Add Tag Functionality////
 it('Check the Add Tag Functionality', () => {
    page.click("addTagButton_class");
    page.verifyText("addTagPageHeading_xpath", Obj_Rep.addTagPageHeading_text);

    // Verify new attribute can be added
    page.type("addTag_Name_id", testData.addTag.tag_name + random.randomCode+"new");
    page.click("saveTagButton_id");
    page.type("searchTagByName_xpath", testData.addTag.tag_name + random.randomCode+"new");      //Search Tag by name
    page.verifyText("searchTag_Name_xpath", testData.addTag.tag_name + random.randomCode+"new"); //Check if tag name matches
    page.verifyText("searchTag_Status_xpath", "Y");  //Check if status is active
    page.verifyText("tag_LastModified_xpath", page.getDateTime());
  
  });

 /// Check the Edit Tag Functionality////
 xit('Check the Edit Tag Functionality', () => {

    page.click("searchTag_Name_xpath");
    // Verify Heading of Edit Attribute Page
    page.verifyText("editTagPageHeading_xpath",  Obj_Rep.editTagPageHeading_text);
    expect(page.isElementEnabled("addTag_Name_id")).toEqual(true); 

    page.clear("addTag_Name_id");
    page.type("addTag_Name_id", testData.addTag.tag_name + random.randomCode + "edited"); //Editing the Tag Name
    page.click("saveTagButton_id");

    //Verify if a Tag is updated successfully
    page.type("searchTagByName_xpath", testData.addTag.tag_name + random.randomCode);      //Search Tag by Name
    page.verifyText("searchTag_Name_xpath", testData.addTag.tag_name + random.randomCode + "edited"); //Check if Tag name matches
    page.verifyText("searchTag_Status_xpath", "Y");  //Check if status is active

 });

});