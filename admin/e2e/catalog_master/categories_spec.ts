import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Categories e2e Tests', function () {
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

  /// Check the Category Page opens and Listing populates////
  it('Check the Category Page opens and Listing populates', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
     browser.sleep(2000);
    page.click("menuCategories_id");
    page.verifyText("categoriesPageHeading_class",  Obj_Rep.categoriesPageHeading_text); //Verify Heading of Categories Page
    page.isElementPresent("pagesCount_class"); //Verify Categories Listing populates
  });

  /// Check all columns are displayed in categories listing////
  it('Check all columns are displayed in categories listing', () => {
    expect(page.isElementPresent("nameColumnCategory_xpath")).toEqual(true);
    expect(page.isElementPresent("codeColumnCategory_xpath")).toEqual(true);
    expect(page.isElementPresent("activeColumnCategory_xpath")).toEqual(true);
    expect(page.isElementPresent("lastModifiedColumnCategory_xpath")).toEqual(true);
    
  });

  /// Check the Add Category & Search Functionality////
  it('Check the Add Category & Search Functionality', () => {
    page.click("addCategoryButton_class");
    // Verify Heading of Add Category Page
    page.verifyText("addCategoryPageHeading_xpath",  Obj_Rep.addCategoryPageHeading_text);
    
    // Verify new category can be added
    page.type("addCategory_Name_id", testData.addCategory.category_name + random.randomCode);
    page.type("addCategory_Code_id", testData.addCategory.category_code + random.randomCode);
    page.type("Tag_xpath", testData.addCategory.category_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    page.click("saveCategoryButton_id");
    page.type("searchCategoryByCode_xpath", testData.addCategory.category_code + random.randomCode);      //Search category by code
    page.verifyText("searchCategory_Name_xpath", testData.addCategory.category_name + random.randomCode); //Check if category name matches
    page.verifyText("searchCategory_Status_xpath", "Y");  //Check if status is active

  });

  /// Check the Edit Category Functionality////
  it('Check the Edit Category Functionality', () => {

    page.click("searchCategory_Name_xpath");
    // Verify Heading of Edit Category Page
    page.verifyText("editCategoryPageHeading_xpath",  Obj_Rep.editCategoryPageHeading_text);

    expect(page.isElementEnabled("addCategory_Code_id")).toEqual(false); //Check if Category Code field is disabled

    page.clear("addCategory_Name_id");
    page.type("addCategory_Name_id", testData.addCategory.category_name + random.randomCode + "edited"); //Editing the Category Name
    page.click("saveCategoryButton_id");

    //Verify if a Category is updated successfully
 
    page.type("searchCategoryByCode_xpath", testData.addCategory.category_code + random.randomCode);      //Search category by code
    page.verifyText("searchCategory_Name_xpath", testData.addCategory.category_name + random.randomCode + "edited"); //Check if category name matches
    page.verifyText("searchCategory_Status_xpath", "Y");  //Check if status is active

  });

  /// Check that duplicate category cannot be added////
  it('Check that duplicate category cannot be added', () => {
    page.click("addCategoryButton_class");
    page.type("addCategory_Name_id", testData.addCategory.category_name + random.randomCode + "New");
    page.type("addCategory_Code_id", testData.addCategory.category_code + random.randomCode);
    page.click("saveCategoryButton_id");
    page.verifyText("addCategoryValidationMessage_xpath", "Duplicate Code");
    page.click("cancelCategoryButton_id");

  });

});