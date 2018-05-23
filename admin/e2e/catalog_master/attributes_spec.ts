import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Attributes e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('../ak-TestData.json');         // ak-TestData.json conatins all test datasets
  let Obj_Rep = require('../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT
  let random = require('../ak-Random.json');             // ak-Random.json contains a random code generated at runtime
  
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

 // Check the Attributes Listing Page opens////
 it('Check the Attributes Listing Page opens', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    page.click("menuAttributes_id");
    page.verifyText("attributesPageHeading_class",  Obj_Rep.attributesPageHeading_text); //Verify Heading of Attributes Page

  });

 // Check the Add Attribute Functionality////
 it('Check the Add Attribute Functionality', () => {
    page.click("addAttributeButton_class");
    page.verifyText("addAttributePageHeading_xpath", Obj_Rep.addAttributesPageHeading_text);

    // Verify new attribute can be added
    page.type("addAttribute_Name_id", testData.addAttribute.attribute_name + random.randomCode);
    page.type("addAttribute_Code_id", testData.addAttribute.attribute_code + random.randomCode);
    page.type("attributeTag_xpath", testData.addAttribute.attribute_name + random.randomCode);
    page.getElement("attributeTag_xpath").sendKeys(Key.ENTER);
    page.click("saveAttributeButton_id");
    page.type("searchAttributeByCode_xpath", testData.addAttribute.attribute_code + random.randomCode);      //Search Attribute by code
    page.verifyText("searchAttribute_Name_xpath", testData.addAttribute.attribute_name + random.randomCode); //Check if Attribute name matches
    page.verifyText("searchAttribute_Status_xpath", "Y");  //Check if status is active
  
  });

 // Check the Edit Attribute Functionality////
 it('Check the Edit Attribute Functionality', () => {

    page.click("searchAttribute_Name_xpath");
    // Verify Heading of Edit Attribute Page
    page.verifyText("editAttributePageHeading_xpath",  Obj_Rep.editAttributesPageHeading_text);

    expect(page.isElementEnabled("addAttribute_Code_id")).toEqual(false); //Check if Attribute Code field is disabled

    page.clear("addAttribute_Name_id");
    page.type("addAttribute_Name_id", testData.addAttribute.attribute_name + random.randomCode + "edited"); //Editing the Attribute Name
    page.click("saveAttributeButton_id");

    //Verify if a Attribute is updated successfully
    page.type("searchAttributeByCode_xpath", testData.addAttribute.attribute_code + random.randomCode);      //Search Attribute by code
    page.verifyText("searchAttribute_Name_xpath", testData.addAttribute.attribute_name + random.randomCode + "edited"); //Check if Attribute name matches
    page.verifyText("searchAttribute_Status_xpath", "Y");  //Check if status is active

  });

});