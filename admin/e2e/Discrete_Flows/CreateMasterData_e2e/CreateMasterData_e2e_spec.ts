import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Create Master Data e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('./Masters_TestData.json');         // Masters_TestData.json conatins all test datasets
  let Obj_Rep = require('../../ak-ObjectRepository.json');  // ak-ObjectRepository.json Contains all objects of the AUT
  let random = require('../../ak-Random.json');             // ak-Random.json contains a random code generated at runtime

  beforeAll(() => {
    // Expanding menu
    console.log("Reached CreateMasterData_e2e");
    page.click("menuExpandButton_class");
    browser.sleep(2000);;

  });

  afterAll(() => {
    // Collapsing menu
    page.click("menuExpandButton_class");
    browser.sleep(2000);;

  });

  /// Check the Add Tag Functionality////
  xit('Check the Add Tag Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    // clicking Tags link
    page.click("menuTags_id");
    //browser.sleep(2000);
    page.click("addTagButton_class");
    //browser.sleep(5000);
    page.type("addTag_Name_id", testData.tag.tag_name + random.randomCode);
    //browser.sleep(5000);
    page.click("saveTagButton_id");
    //page.type("searchTagByName_xpath", testData.tag.tag_name + random.randomCode);      //Search Tag by name
    //page.verifyText("searchTag_Name_xpath", testData.tag.tag_name + random.randomCode); //Check if tag name matches
    //page.verifyText("searchTag_Status_xpath", "Y");  //Check if status is active
   
  });

  /// Check the Add Attribute Functionality////
  xit('Check the Add Attribute Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    // clicking Attributes link
    page.click("menuAttributes_id");
    page.click("addAttributeButton_class");
    page.type("addAttribute_Name_id", testData.attribute.attribute_name + random.randomCode);
    page.type("addAttribute_Code_id", testData.attribute.attribute_code + random.randomCode);
    page.type("Tag_xpath", testData.tag.tag_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    page.click("saveAttributeButton_id");
    //page.type("searchAttributeByCode_xpath", testData.attribute.attribute_code + random.randomCode);      //Search Attribute by code
    //page.verifyText("searchAttribute_Name_xpath", testData.attribute.attribute_name + random.randomCode); //Check if Attribute name matches
    //page.verifyText("searchAttribute_Status_xpath", "Y");  //Check if status is active
  
  });

  /// Check the Add Category Functionality////
  xit('Check the Add Category Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
     browser.sleep(2000);
    // clicking Categories link
    page.click("menuCategories_id");
    page.click("addCategoryButton_class");
    page.type("addCategory_Name_id", testData.category.category_name + random.randomCode);
    page.type("addCategory_Code_id", testData.category.category_code + random.randomCode);
    page.type("Tag_xpath", testData.tag.tag_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    page.click("saveCategoryButton_id");
    //page.type("searchCategoryByCode_xpath", testData.category.category_code + random.randomCode);      //Search category by code
    //page.verifyText("searchCategory_Name_xpath", testData.category.category_name + random.randomCode); //Check if category name matches
    //page.verifyText("searchCategory_Status_xpath", "Y");  //Check if status is active
  
  });

  /// Check the Add Collection Functionality////
  xit('Check the Add Collection Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    // clicking Collections link
    page.click("menuCollections_id");
    page.click("addCollectionButton_class");
    page.type("addCollection_Name_id", testData.collection.collection_name + random.randomCode);
    page.type("addCollection_Code_id", testData.collection.collection_code + random.randomCode);
    page.click("addCollection_Type_xpath");
    page.click("addCollection_TypeValue_xpath");
    page.type("Tag_xpath", testData.tag.tag_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    page.click("Add_More");
    page.click("addCollection_Item_xpath");
    page.type("addCollection_Item_Input_xpath", testData.category.category_name + random.randomCode);
    browser.findElement(by.xpath("//*[@id='attributeType']/div/div[4]/div[2]/ul/li/span")).click();
    page.click("addCollection_Item_Save_xpath");
    page.click("saveCollectionButton_id");
    //page.type("searchCollectionByCode_xpath", testData.collection.collection_code + random.randomCode);      //Search collection by code
    //page.verifyText("searchCollection_Name_xpath", testData.collection.collection_name + random.randomCode); //Check if collection name matches
    //page.verifyText("searchCollection_Status_xpath", "Y");  //Check if status is active
 
  });

  /// Check the Add Location Functionality////
  it('Check the Add Location Functionality', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    // clicking Locations link
    page.click("menuLocations_id");
    page.click("addLocationButton_class");
    page.type("addLocation_Name_id", testData.location.location_name + random.randomCode);
    page.type("addLocation_Code_id", testData.location.location_code + random.randomCode);
    page.click("addLocation_Category_xpath");
    let countPromise = page.getElementsCount("xpath", "//*[@id='categories']/div/div[4]/div[2]/ul/li");
    countPromise.then((count) => {
        for (let i = 1; i <=count; i++) {
            let catNamePromise = browser.findElement(by.xpath("//*[@id='categories']/div/div[4]/div[2]/ul/li[" + i + "]/label")).getText();
            catNamePromise.then((catName) => {
                if (catName.match(testData.location.location_category))
                {   page.type("addLocation_Category_Input_xpath", testData.location.location_category);
                    browser.findElement(by.xpath("//*[@id='categories']/div/div[4]/div[2]/ul/li[" + i + "]/div/div[2]")).click();
                }
                else {console.error("Category "+ testData.location.location_category + " not found!" )}
            });
        };
    });

    page.type("Tag_xpath", testData.tag.tag_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    page.type("addLocation_Address_id", testData.location.location_address);
    page.click("addLocation_Search_xpath");
    browser.sleep(20000);
    page.click("saveLocationButton_id");

    //page.click("addLocation_FloorTab_xpath");
    //page.click("addLocation_AddFloor_xpath");
    
    
    

    /*/Verify if a product is added successfully
    page.type("searchLocationtByCode_xpath", testData.addLocaction.locaction_code + random.randomCode);      //Search product by code
    page.verifyText("searchLocation_Name_xpath", testData.addLocaction.locaction_name + random.randomCode); //Check if product name matches
    page.verifyText("searchLocation_Status_xpath", "Y");  //Check if status is active 

    page.click("addLocation_Category_xpath");
    page.type("Tag_xpath", testData.tag.tag_name + random.randomCode);
    page.getElement("Tag_xpath").sendKeys(Key.ENTER);
    browser.sleep(10000);*/
    
    
    

  });
 

});