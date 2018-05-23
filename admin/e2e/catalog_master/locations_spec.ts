import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Locations e2e Tests', function () {
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
  /// Check the Locations Listing Page////
  it('Check the Locations Listing Page opens', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    page.click("menuLocations_id");
    page.verifyText("locationPageHeading_class", Obj_Rep.locationsPageHeading_text); //Verify Heading of Products Page

  });
   /// Check the Add Product Functionality////
  it('Check the Add Location Functionality', () => {
    page.click("addLocationButton_class");
    page.type("addLocation_Name_id", testData.addLocation.location_name + random.randomCode);
    page.type("addLocation_Code_id", testData.addLocation.location_code + random.randomCode);
    page.click("addLocation_Category_xpath");
    page.click("addLocation_CategoryTypeFirstItem_xpath");
    page.click("saveLocationButton_id");

    //Verify if a product is added successfully
    page.type("searchLocationtByCode_xpath", testData.addLocaction.locaction_code + random.randomCode);      //Search product by code
    page.verifyText("searchLocation_Name_xpath", testData.addLocaction.locaction_name + random.randomCode); //Check if product name matches
    page.verifyText("searchLocation_Status_xpath", "Y");  //Check if status is active       

  });

  /// Check the Edit Product Functionality////
 xit('Check the Edit Product Functionality', () => {
    page.click("searchProduct_Name_xpath");
    page.clear("addProduct_Name_id");
    page.type("addProduct_Name_id", testData.addProduct.product_name + random.randomCode + "edited"); //Editing the Product Name
    page.click("saveProductButton_id");
     //Verify if a product is updated successfully
    page.type("searchProductByCode_xpath", testData.addProduct.product_code + random.randomCode);      //Search product by code
    page.verifyText("searchProduct_Name_xpath", testData.addProduct.product_name + random.randomCode + "edited"); //Check if product name matches
    page.verifyText("searchProduct_Status_xpath", "Y");  //Check if status is active

  });

});
