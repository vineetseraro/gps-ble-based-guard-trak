import { browser, Key, by, element, ActionSequence } from 'protractor';
import { BaseTestWebAKAdmin } from '../../ak-ReusableMethods';  // ak-ReusableMethods.ts Contains all reusable custom methods from Selenium WebDriver

describe('ak-ng2-admin - Create User Data e2e Tests', function () {
  let page: BaseTestWebAKAdmin = new BaseTestWebAKAdmin();
  let testData = require('./RolesAndGroups_TestData.json');         // Masters_TestData.json conatins all test datasets
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
  /// Check the USERS Listing Page////
  it('Check the USERS Listing Page opens', () => {
    // clicking UserPool link
    page.click("menuUserpool_xpath");
    // click users and groups link
    page.click("menuUserAndGroupsLink_xpath");
    browser.sleep(2000);
     // click users tab link
    page.click("menuUsersTabLink_class");
    browser.sleep(2000);
    page.verifyText("usersPageHeading_class", Obj_Rep.usersPageHeading_text); //Verify Heading of USERS Page

  });

   /// Check the Add admin User Functionality////
  it('Check the Add User Page opens for adding Admin', () => {
    // clicking Add button
    page.click("addUserButton_class");
     browser.sleep(2000);
    // adding first name
    random.randomCode=random.randomCode+1;
    page.type( "addUserFirstNameInput_xpath",testData.addAkAdmin.AdminFirstName+ random.randomCode);
    browser.sleep(2000);
     // adding last name
    page.type( "addUserLastNameInput_xpath",testData.addAkAdmin.AdminLastName+ random.randomCode);
    browser.sleep(2000);
     // adding email id
    page.type( "addUserEmailInput_xpath",testData.addAkAdmin.EmailLocalPart+random.randomCode+testData.addAkAdmin.EmailDomain);
    browser.sleep(2000);
     // adding user zone
    page.click( "addUserSelectZoneDropDown_xpath");
    page.click( "addUserSelectedZoneValue_xpath");
    page.click("addUserArrovalYes_xpath");
    browser.sleep(2000);
     // click groups tab link
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
     // Click group dropdown
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
    page.click("addUserSelectGroupdropDown_xpath");
    browser.sleep(2000);
    page.click( "addUserGroupAdminValueSelected_xpath");
    browser.sleep(3000);
    page.click("submitAddedUser_class");
    browser.sleep(5000);
    //verification of user added
    page.type("addedUserSearchByMail_xpath",testData.addAkAdmin.EmailLocalPart+random.randomCode+testData.addAkAdmin.EmailDomain ); //search for email
    page.verifyText("searchedUserFirstName_xpath",testData.addAkAdmin.AdminFirstName+ random.randomCode);//verifying first name
    page.verifyText( "searchedUserLastName_xpath",testData.addAkAdmin.AdminLastName+ random.randomCode);//verifying last name
    page.verifyText( "searchedUserIsActive_xpath","true");//verifying "IS Active"
    page.verifyText( "searchedUserStatus_xpath",Obj_Rep.statusWhenAprroveChecked_text);// Verifying status
    page.verifyText( "searchedUserIsApproved_xpath","yes");// verifying "isApproved"

  });

   /// Verify group of the user added////
  it('Check that Added User is assigned the correct group for Admin', () => {
    //logout from application
     page.click("logoutButton_xpath");
    page.verifyText("loginPageHeading_class",  Obj_Rep.loginPageHeading_text);
     browser.sleep(2000);
    //login with the recently added user
    page.type("username_id", testData.addAkAdmin.EmailLocalPart+random.randomCode+testData.addAkAdmin.EmailDomain);
    console.log("enter password from email id");
    browser.sleep(60000);
   // page.type("password_id", testData.login.password);
   //reset password
   page.click("loginButton_id");
   console.log("enter old password from email id");
    browser.sleep(60000);
    page.type("setNewPasswordInput_id", testData.resetPassword.password);
    browser.sleep(5000);
    page.click("generateNewPasswordButton_id");
    browser.sleep(5000);

   //click user profile
    page.click("userProfilelink_class");
     browser.sleep(2000);

     //verifying page heading
    page.verifyText("editProfilePageHeading_class",Obj_Rep.manageUserPageHeading_text);
    page.click("manageProfileGroupTab_xpath");
     browser.sleep(2000);
    let divSection= (page.getText("manageProfileGroupRoleDiv:xpath")).toString();
    divSection.then(console.log);
    page.verifyText("manageProfileGroupValue:xpath","Group :");

  });

     /// Check the Add Sales rep User Functionality////
  xit('Check the Add User Page opens for sales rep', () => {
    // clicking Add button
    page.click("addUserButton_class");
     browser.sleep(2000);
     random.randomCode=random.randomCode+1;
    // adding first name
    page.type( "addUserFirstNameInput_xpath",testData.addAkSalesrep.SalesrepFirstName+ random.randomCode);
    browser.sleep(2000);
     // adding last name
    page.type( "addUserLastNameInput_xpath",testData.addAkSalesrep.SalesrepLastName+ random.randomCode);
    browser.sleep(2000);
     // adding email id
    page.type( "addUserEmailInput_xpath",testData.addAkSalesrep.EmailLocalPart+random.randomCode+testData.addAkSalesrep.EmailDomain);
    browser.sleep(2000);
     // adding user zone
    page.click( "addUserSelectZoneDropDown_xpath");
    page.click( "addUserSelectedZoneValue_xpath");
    page.click("addUserArrovalYes_xpath");
    browser.sleep(2000);
     // click groups tab link
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
     // Click group dropdown
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
    page.click("addUserSelectGroupdropDown_xpath");
    browser.sleep(2000);
    page.click( "addUserGroupSalesRepValueSelected_xpath");
    browser.sleep(3000);
    page.click("submitAddedUser_class");
    browser.sleep(5000);
    //verification of user added
    page.type("addedUserSearchByMail_xpath",testData.addAkSalesrep.EmailLocalPart+random.randomCode+testData.addAkSalesrep.EmailDomain ); //search for email
    page.verifyText("searchedUserFirstName_xpath",testData.addAkSalesrep.SalesrepFirstName+ random.randomCode);//verifying first name
    page.verifyText( "searchedUserLastName_xpath",testData.addAkSalesrep.SalesrepLastName+ random.randomCode);//verifying last name
    page.verifyText( "searchedUserIsActive_xpath","true");//verifying "IS Active"
    page.verifyText( "searchedUserStatus_xpath",Obj_Rep.statusWhenAprroveChecked_text);// Verifying status
    page.verifyText( "searchedUserIsApproved_xpath","yes");// verifying "isApproved"

  });

   /// Verify group of the user added for sales rep////
  xit('Check that Added sales rep User is assigned the correct group', () => {
    //logout from application
     page.click("logoutButton_xpath");
    page.verifyText("loginPageHeading_class",  Obj_Rep.loginPageHeading_text);
     browser.sleep(2000);

    //login with the recently added user
    page.type("username_id", testData.addAkSalesrep.EmailLocalPart+random.randomCode+testData.addAkSalesrep.EmailDomain);
    console.log("enter password from email id");
    browser.sleep(60000);
   // page.type("password_id", testData.login.password);
   //reset password
   page.click("loginButton_id");
   console.log("enter old password from email id");
    browser.sleep(60000);
    page.type("setNewPasswordInput_id", testData.resetPassword.password);
    browser.sleep(5000);
    page.click("generateNewPasswordButton_id");
    browser.sleep(5000);

   //click user profile
    page.click("userProfilelink_class");
     browser.sleep(2000);

     //verifying page heading
    page.verifyText("editProfilePageHeading_class",Obj_Rep.manageUserPageHeading_text);
    page.click("manageProfileGroupTab_xpath");
     browser.sleep(2000);
    page.verifyText("manageProfileGroupValue:xpath","Group :");

  });
   // Checking the Add user functionality for a carrier user
   xit('Check the Add User Page opens for carrier', () => {
    // clicking Add button
    page.click("addUserButton_class");
     browser.sleep(2000);
     random.randomCode=random.randomCode+1;
    // adding first name
    page.type( "addUserFirstNameInput_xpath",testData.addAkCarrier.CarrierFirstName+ random.randomCode);
    browser.sleep(2000);
     // adding last name
    page.type( "addUserLastNameInput_xpath",testData.addAkCarrier.CarrierLastName+ random.randomCode);
    browser.sleep(2000);
     // adding email id
    page.type( "addUserEmailInput_xpath",testData.addAkCarrier.EmailLocalPart+random.randomCode+testData.addAkCarrier.EmailDomain);
    browser.sleep(2000);
     // adding user zone
    page.click( "addUserSelectZoneDropDown_xpath");
    page.click( "addUserSelectedZoneValue_xpath");
    page.click("addUserArrovalYes_xpath");
    browser.sleep(2000);
     // click groups tab link
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
     // Click group dropdown
    page.click("addUserGroupTab_xpath");
    browser.sleep(2000);
    page.click("addUserSelectGroupdropDown_xpath");
    browser.sleep(2000);
    page.click( "addUserGroupCarrierValueSelected_xpath");
    browser.sleep(3000);
    page.click("submitAddedUser_class");
    browser.sleep(5000);
    //verification of user added
    page.type("addedUserSearchByMail_xpath",testData.addAkCarrier.EmailLocalPart+random.randomCode+testData.addAkCarrier.EmailDomain ); //search for email
    page.verifyText("searchedUserFirstName_xpath",testData.addAkCarrier.CarrierFirstName+ random.randomCode);//verifying first name
    page.verifyText( "searchedUserLastName_xpath",testData.addAkCarrier.CarrierLastName+ random.randomCode);//verifying last name
    page.verifyText( "searchedUserIsActive_xpath","true");//verifying "IS Active"
    page.verifyText( "searchedUserStatus_xpath",Obj_Rep.statusWhenAprroveChecked_text);// Verifying status
    page.verifyText( "searchedUserIsApproved_xpath","yes");// verifying "isApproved"

  });

   /// Verify group of the user added////
  xit('Check that Added carrier User is assigned the correct group', () => {
    //logout from application
     page.click("logoutButton_xpath");
    page.verifyText("loginPageHeading_class",  Obj_Rep.loginPageHeading_text);
     browser.sleep(2000);

    //login with the recently added user
    random.randomCode=random.randomCode+2;
    page.type("username_id", testData.addAkCarrier.EmailLocalPart+random.randomCode+testData.addAkCarrier.EmailDomain);
    console.log("enter password from email id");
    browser.sleep(60000);
   // page.type("password_id", testData.login.password);
   //reset password
   page.click("loginButton_id");
   console.log("enter old password from email id");
    browser.sleep(60000);
    page.type("setNewPasswordInput_id", testData.resetPassword.password);
    browser.sleep(5000);
    page.click("generateNewPasswordButton_id");
    browser.sleep(5000);

   //click user profile
    page.click("userProfilelink_class");
     browser.sleep(2000);

     //verifying page heading
    page.verifyText("editProfilePageHeading_class",Obj_Rep.manageUserPageHeading_text);
    page.click("manageProfileGroupTab_xpath");
     browser.sleep(2000);
    page.verifyText("manageProfileGroupValue:xpath","Group :");

  });


  });