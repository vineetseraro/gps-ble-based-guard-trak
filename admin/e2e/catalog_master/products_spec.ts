import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Products e2e Tests', function () {
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

  /// Check the Product Listing Page////
  it('Check the Product Listing Page opens', () => {
    // clicking Masters
    page.click("menuMasters_xpath");
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(2000);
    page.click("menuProducts_id");
    page.verifyText("productPageHeading_class", Obj_Rep.productsPageHeading_text); //Verify Heading of Products Page

  });


  /// Check the Add Product Functionality////
  it('Check the Add Product Functionality', () => {
    page.click("addProductButton_class");
    page.type("addProduct_Name_id", testData.addProduct.product_name + random.randomCode);
    page.type("addProduct_Code_id", testData.addProduct.product_code + random.randomCode);
    page.click("addProduct_Category_xpath");
    page.click("addProduct_CategoryTypeFirstItem_xpath");
    page.click("saveProductButton_id");

    //Verify if a product is added successfully
    page.type("searchProductByCode_xpath", testData.addProduct.product_code + random.randomCode);      //Search product by code
    page.verifyText("searchProduct_Name_xpath", testData.addProduct.product_name + random.randomCode); //Check if product name matches
    page.verifyText("searchProduct_Status_xpath", "Y");  //Check if status is active       

  });

  /// Check the Edit Product Functionality////
  it('Check the Edit Product Functionality', () => {
    page.click("searchProduct_Name_xpath");
    page.clear("addProduct_Name_id");
    page.type("addProduct_Name_id", testData.addProduct.product_name + random.randomCode + "edited"); //Editing the Product Name
    page.click("saveProductButton_id");
     //Verify if a product is updated successfully
    page.type("searchProductByCode_xpath", testData.addProduct.product_code + random.randomCode);      //Search product by code
    page.verifyText("searchProduct_Name_xpath", testData.addProduct.product_name + random.randomCode + "edited"); //Check if product name matches
    page.verifyText("searchProduct_Status_xpath", "Y");  //Check if status is active

  });

  /// Check the pagination////
  xit('Check the Pagination', () => {
    // clicking Masters
    page.clear("searchProductByCode_xpath");
    page.click("menuMasters_xpath");
    browser.sleep(2000);
    // clicking Catalog link
    page.click("menuCatalog_xpath");
    browser.sleep(5000);
    page.click("menuAttributes_id");
    browser.sleep(5000);
    page.click("menuMasters_xpath");
    browser.sleep(2000);
    page.click("menuCatalog_xpath");
    browser.sleep(5000);
    page.click("menuProducts_id");
    browser.sleep(10000);
    page.click("ProductPage_RecordCountSelector_xpath");
    browser.sleep(5000);
    page.click("ProductPage_RecordCountValue_xpath");
    //let pageCount = page.getText("html/body/app-root/app-page/section/main/section/div/app-product-list/p-datatable/div/p-paginator/div/select");
    let pageCount= element(by.id('dataTable')).rows;
    browser.sleep(5000);
    let count = page.getTableRowsCount("ProductDataTable_xpath");
    browser.sleep(5000);
    page.verifyText(count, pageCount);
    /*if(pageCount===count)
    {
      console.log("count verified");
      console.log(count);
    }
    else{
      console.log("count not verified");
      console.log(count);
    }   */
    browser.sleep(5000);
  });

  /// Check the duplicate Product code Functionality////
  it('Check the Duplicate Product Functionality', () => {
    page.click("addProductButton_class");
    page.type("addProduct_Name_id", testData.addProduct.product_name + random.randomCode + "new");
    page.type("addProduct_Code_id", testData.addProduct.product_code + random.randomCode);
    page.click("addProduct_Category_xpath");
    page.click("addProduct_CategoryTypeFirstItem_xpath");
    page.click("saveProductButton_id");

    //Verify if a product is not added with duplicate code
    page.verifyText("addProductPageHeading_xpath", Obj_Rep.addProductPageHeading_text); //Check if user redirected to "add product"

  });
 

});