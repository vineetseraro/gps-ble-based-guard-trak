import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Collections e2e Tests', function () {
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

  /// Check the Collections Page opens and Listing populates////
  it('Check the Collections Page opens and Listing populates', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    page.click("menuCollections_id");
    page.verifyText("collectionsPageHeading_class",  Obj_Rep.collectionsPageHeading_text); //Verify Heading of Collections Page
    page.isElementPresent("pagesCount_class"); //Verify Collections Listing populates
  
  });

  /// Check all columns are displayed in collections listing////
  it('Check all columns are displayed in collections listing', () => {
    expect(page.isElementPresent("nameColumnCollection_xpath")).toEqual(true);
    expect(page.isElementPresent("codeColumnCollection_xpath")).toEqual(true);
    expect(page.isElementPresent("categoryColumnCollection_xpath")).toEqual(true);
    expect(page.isElementPresent("activeColumnCollection_xpath")).toEqual(true);
    expect(page.isElementPresent("lastModifiedColumnCollection_xpath")).toEqual(true);
    
  });

  /// Check the Add Collection & Search Functionality////
  it('Check the Add Collection & Search Functionality', () => {
    page.click("addCollectionButton_class");
    // Verify Heading of Add Collections Page
    page.verifyText("addCollectionPageHeading_xpath",  Obj_Rep.addCollectionPageHeading_text);
    
    // Verify new collection can be added
    page.type("addCollection_Name_id", testData.addCollection.collection_name + random.randomCode);
    page.type("addCollection_Code_id", testData.addCollection.collection_code + random.randomCode);
    page.click("addCollection_Type_xpath");
    page.click("addCollection_TypeValue_xpath");
    page.type("Tag_xpath", testData.addCollection.collection_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    
    for (let i = 1; i < 3; i++) {
      browser.executeScript('window.scrollTo(0,document.body.scrollHeight)').then(function(){
        browser.findElement(by.xpath("html/body/app-root/app-page/section/main/section/div/app-collection-add/form/section[2]/p-tabview/div/div/p-tabpanel/div/p-datatable/div/div[1]/table/tbody/tr[" + i + "]/td[1]/span[2]")).click();
      });
     
      browser.findElement(by.xpath("html/body/app-root/app-page/section/main/section/div/app-collection-add/form/section[2]/p-tabview/div/div/p-tabpanel/div/p-datatable/div/div[1]/table/tbody/tr[" + i + "]/td[1]/div/p-dropdown/div/div[2]/span")).click();
      browser.findElement(by.xpath("html/body/app-root/app-page/section/main/section/div/app-collection-add/form/section[2]/p-tabview/div/div/p-tabpanel/div/p-datatable/div/div[1]/table/tbody/tr[" + i + "]/td[1]/div/p-dropdown/div/div[3]/div[2]/ul/li[" + i + "]/span")).click();
      browser.findElement(by.xpath("html/body/app-root/app-page/section/main/section/div/app-collection-add/form/section[2]/p-tabview/div/div/p-tabpanel/div/input")).click();
    }

    page.click("saveCollectionButton_id");
    page.type("searchCollectionByCode_xpath", testData.addCollection.collection_code + random.randomCode);      //Search collection by code
    page.verifyText("searchCollection_Name_xpath", testData.addCollection.collection_name + random.randomCode); //Check if collection name matches
    page.verifyText("searchCollection_Status_xpath", "Y");  //Check if status is active
 
  });

   // Check the Edit Collection Functionality////
  it('Check the Edit Collection Functionality', () => {

    page.click("searchCollection_Name_xpath");
    // Verify Heading of Edit Collection Page
    page.verifyText("editCollectionPageHeading_xpath",  Obj_Rep.editCollectionPageHeading_text);

    expect(page.isElementEnabled("addCollection_Code_id")).toEqual(false); //Check if Collection Code field is disabled

    page.clear("addCollection_Name_id");
    page.type("addCollection_Name_id", testData.addCollection.collection_name + random.randomCode + "edited"); //Editing the Collection Name
    page.click("saveCollectionButton_id");

    //Verify if a Collection is updated successfully
 
    page.type("searchCollectionByCode_xpath", testData.addCollection.collection_code + random.randomCode);      //Search collection by code
    page.verifyText("searchCollection_Name_xpath", testData.addCollection.collection_name + random.randomCode + "edited"); //Check if collection name matches
    page.verifyText("searchCollection_Status_xpath", "Y");  //Check if status is active

  });

  // Check that duplicate collection cannot be added////
  it('Check that duplicate collection cannot be added', () => {
    page.click("addCollectionButton_class");
    page.type("addCollection_Name_id", testData.addCollection.collection_name + random.randomCode + "New");
    page.type("addCollection_Code_id", testData.addCollection.collection_code + random.randomCode);
    page.click("saveCollectionButton_id");
    page.verifyText("addCollectionValidationMessage_xpath", "Duplicate Code");
    page.click("cancelCollectionButton_id");

  });

});