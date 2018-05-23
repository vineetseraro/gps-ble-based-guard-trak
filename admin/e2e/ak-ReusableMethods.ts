import { browser, element, by, protractor} from 'protractor';
let Obj_Rep = require('./ak-ObjectRepository.json');
//import { RavenErrorHandler } from '../src/app/app.module';
//let err: RavenErrorHandler = new RavenErrorHandler();

export class BaseTestWebAKAdmin {

// This method navigates to a URL
  navigateTo(page:any) {
    return browser.get(page);
  }

// This method gets the text by tag name for an element
  getParagraphText(tag:any) {
    return element(by.tagName(tag)).getText();
  }

 // This method checks if an element is present
  isElementPresent(locatorKey:any)   {      //register_link

    let locatorKeyJson = Obj_Rep[locatorKey];    // {"selector": "Register", "type":"link"}
    let type = locatorKeyJson.type;         // link
    let selector = locatorKeyJson.selector; // Register
    let elementList =[];

    try{

    if(type === "id")
        elementList.push(browser.findElement(by.id(selector)));
    else if(type === "name")
        elementList.push(browser.findElement(by.name(selector)));
    else if(type === "xpath")
        elementList.push(browser.findElement(by.xpath(selector)));
    else if(type === "link")
        elementList.push(browser.findElement(by.linkText(selector)));
    else if(type === "class")
        elementList.push(browser.findElement(by.className(selector)));
    else if(type === "css")
        elementList.push(browser.findElement(by.css(selector)));
    else
        throw "Locator Not Correct!";
    
    } catch(exception){console.log(exception);}
    //catch (e) {err.handleError(e)}

    //return expect(elementList.length).toBeGreaterThan(0);
    if(elementList.length === 0)
        return false;
    else 
        return true;

  }

  // This method finds an element and returns it
  isElementEnabled(locatorKey:any)   {            //register_link

    let locatorKeyJson = Obj_Rep[locatorKey];    // {"selector": "Register", "type":"link"}
    let type = locatorKeyJson.type;         // link
    let selector = locatorKeyJson.selector; // Register
    let state = null;

    try {

    if(type === "id")
        state = browser.findElement(by.id(selector)).isEnabled();
    else if(type === "name")
        state = browser.findElement(by.name(selector)).isEnabled();
    else if(type === "xpath")
        state = browser.findElement(by.xpath(selector)).isEnabled();
    else if(type === "link")
        state = browser.findElement(by.linkText(selector)).isEnabled();
    else if(type === "class")
        state = browser.findElement(by.className(selector)).isEnabled();
    else if(type === "css")
        state = browser.findElement(by.css(selector)).isEnabled();
    else
        throw "Locator Not Correct!";

    } catch(exception){console.log(exception);}

    return state;
  }

  // This method finds an element and returns it
  getElement(locatorKey:any)   {            //register_link

    let locatorKeyJson = Obj_Rep[locatorKey];    // {"selector": "Register", "type":"link"}
    let type = locatorKeyJson.type;         // link
    let selector = locatorKeyJson.selector; // Register
    let element = null;

    try {

    if(type === "id")
        element = browser.findElement(by.id(selector));
    else if(type === "name")
        element = browser.findElement(by.name(selector));
    else if(type === "xpath")
        element = browser.findElement(by.xpath(selector));
    else if(type === "link")
        element = browser.findElement(by.linkText(selector));
    else if(type === "class")
        element = browser.findElement(by.className(selector));
    else if(type === "css")
        element = browser.findElement(by.css(selector));
    else
        throw "Locator Not Correct!";

    } catch(exception){console.log(exception);}

    return element;
  }

// This method gets the count of elements inside a parent element
  getElementsCount(type:String, locatorKey:any)  { 
    
    let selector = locatorKey;
    let elementList = null;

    try {

    if(type === "id")
        elementList = element.all(by.id(selector));
    else if(type === "name")
        elementList = element.all(by.name(selector));
    else if(type === "xpath")
        elementList = element.all(by.xpath(selector));
    else if(type === "link")
        elementList = element.all(by.linkText(selector));
    else if(type === "class")
        elementList = element.all(by.className(selector));
    else if(type === "css")
        elementList = element.all(by.css(selector));
  
    else
        throw "Locator Not Correct!";

    } catch(exception){console.log(exception);}

    return elementList.count();
  }

// This method gets the text for an element
  getText(locatorKey:any)  {
    return this.getElement(locatorKey).getText(function(text) 
    {
        console.log(text);
        return text.trim();});

  }
  
// This method types into an element that can receive user inputs
  type(locatorKey:any, data:any) {
    this.getElement(locatorKey).sendKeys(data);

  }

  /*getConsoleData(locatorKey:any)  {

        this.getElement(locatorKey).sendKeys(key);

  }*/

// This method checks if the actual text matches the expected text via locator key
  verifyText(locatorKey:any, expected:any)  {
    return expect(this.getText(locatorKey)).toEqual(expected);

  }

// This method checks if the actual text matches the expected text via text to text comparison
  matchText(actual:any, expected:any)  {
    return expect(actual).toEqual(expected);

  }

// This method clicks on an element
  click(locatorKey:any) {
    this.getElement(locatorKey).click();
  }

// This method clears the text inside an element
  clear(locatorKey:any) {
    this.getElement(locatorKey).clear();
  }

// This method returns the text converted to lower case
  getTextInLowerCase(locatorKey:any) {
    return this.getElement(locatorKey).getText(function(text) {return text.lowerCase();});

  }

// This method gets the count of rows/records in a table
getTableRowsCount(locatorKey:any) {  //Accepts table's locator

    let tableData = element.all(by.xpath(Obj_Rep[locatorKey].selector + "/tbody")); //Finds table body by table locator
    let rows = tableData.all(by.tagName("tr"));        //Finds all table rows inside a table body
    return rows.count();

}

// This method gets the count of columns/fields in a table
getTableColumnsCount(locatorKey:any) {  //Accepts table's locator

    let tableData = element.all(by.xpath(Obj_Rep[locatorKey].selector + "/thead")); //Finds table header by table locator
    let rows = tableData.all(by.tagName("tr"));        //Finds all table rows inside a table header
    let cols =rows.get(0).all(by.tagName("th"));
    return cols.count();

  }

// This method gets the current date & time in format mm/dd/yyyy hh:mm
getDateTime() {
   let today = new Date();
   let dd = today.getDate();
   let mm = today.getMonth()+1; //January is 0!
   let year = today.getFullYear();
   let hh = today.getHours();
   let min = today.getMinutes();

   if(dd<10) {
    var date = '0' + dd;
   } else date = dd.toString();

   if(mm<10) {
    var month ='0' + mm;
   } else month = mm.toString();

   if(min<10) {
    var minutes ='0' + min;
   } else minutes = min.toString();

   var timeStamp = month + '/' + date + '/' + year + ' ' + hh + ':' + minutes;
   return timeStamp;
}
  

}