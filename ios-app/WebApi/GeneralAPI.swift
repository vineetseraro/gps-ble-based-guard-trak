

// the class has been prepared using almofire sourcecode so if you are using framework then use  Almofire.request instead of request

import UIKit
import AWSCognitoIdentityProvider

enum STRApiType: Int{
    case strApiLogin = 0//
    case strApiSession //
    case strApiRequestForgetPassword //
    case strApiValidateForgetPassword//
    case strApiResetForgetPassword//
    case strApiGetUSerProfile
    case strGetHomeData
    case strApiGetSettingDetails
    case strPickShipment
    case strGetShipmentDetails
    case strApiGETComments
    case strPostComment
    case strApiNotificationApi
    case strApiSignOut
    case strGetIssues
    case strApiGetCountries
    case strApiDeleteUserProfile
    case strApiGlobalSearch
    case strApiGetUserCommentsForIssue
    case strApiGetCaseItemComments
    case strApiGetInventory
    case strDeviceInformation
    case strDeleteNotification
    case strApiGetLocationData
    case strUpdatScanInformation
    case strApiUpdateItemInventory
    case strApiSubmitSurgeryReport
    case strUpdateTimeZone
    case strMarkedDelivered
    case strFloorListApi
    case strAPiFloorProducts
    case strAPiLoginLink
    case strAPiLogoutUNLink
    case strApiGetInventoryItemDetails
    case strUpdateUserProfile
    case strApiUpdateSettingDetails
    case strApiTrackingSetting
    case strApiUpdateTrackingSetting
    case strApigetContactSettings
    case strApiUpdateContactSettings
    case strApiGetGeofences
    case strGetHomeDetails
    case strGetTaskDetails
    case strPostNotes
    case strTourHistory
    case strStartSchedule
    case strEndTour
    case strPostScan
    case strEventList
    case strGetEventDetails
}

class GeneralAPI: NSObject {
    var successCallBack: ((Dictionary<String,AnyObject>)->())?
    var errorCallBack: ((NSError)->())?
    //save param and service type to hit silently
    var prevData: Dictionary<String,AnyObject>?
    var prevrequest:STRApiType?
    var response: AWSCognitoIdentityUserGetDetailsResponse?
    var user: AWSCognitoIdentityUser?
    var pool: AWSCognitoIdentityUserPool?
    
    
    func hitApiwith(_ parameters: Dictionary<String,AnyObject> ,serviceType:STRApiType,success:@escaping ((Dictionary<String,AnyObject>)->()),failure:@escaping ((NSError)->())){
        successCallBack = success
        errorCallBack = failure
        prevData=parameters
        prevrequest=serviceType
        switch serviceType {
        case .strApiLogin:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/signIn")
            hitPOSTApiNSURLLogin(parameters, path: aStr)
            break
        case .strApiSession:
            self.prevData=nil
            let aStr = String(format: "%@%@", Kbase_url, "/reader/generateSession")
            hitPOSTApiNSURLSession(parameters, path: aStr)
            break
            
        case .strApiRequestForgetPassword:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/requestForgotPassword")
            hitPOSTApiNSURLLogin(parameters, path: aStr)
            break
        case .strApiValidateForgetPassword:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/validateForgotToken")
            hitPOSTApiNSURLLogin(parameters, path: aStr)
            
            break
        case .strApiResetForgetPassword:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/resetPassword")
            hitPOSTApiNSURLLogin(parameters, path: aStr)
            break
        case .strApiGetUSerProfile:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/getProfile")
            hitGETApiNSURL(parameters, path: aStr)
            break
            
        case .strGetHomeData:
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "/tasks/" + APIStage)!
            urlComponents.queryItems = [
                URLQueryItem(name: "date", value:parameters["date"]! as? String),
            ]
            print(urlComponents)
            hitGETAmazonApi(parameters, path: (urlComponents.url?.absoluteString)!)

            break
        case .strStartSchedule:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/tasks/" + APIStage+"/starttour")
            hitPOSTAmazonApiWithToken(parameters, path: aStr)
            break
           
        case .strPostScan:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/tasks/" + APIStage+"/scanLocation")
            hitPOSTAmazonApiWithToken(parameters, path: aStr)
            break
        case .strEndTour:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/tasks/" + APIStage+"/endtour")
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strGetHomeDetails:
            //<Base Url>/movements/<stage>/details?date=<YYYY-MM-DD>
            //<Base_Url>/emptrakapp/<id>/inoutdetails?date={'today' || date(2017-11-28)}&location=<locId>
            
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "/emptrakapp/" + APIStage + "/inoutdetails")!
            urlComponents.queryItems = [
                URLQueryItem(name: "date", value:parameters["date"]! as? String),
              //  URLQueryItem(name: "location", value:parameters["location"]! as? String),
            ]
            
            hitGETAmazonApi(parameters, path: (urlComponents.url?.absoluteString)!)
            
            break
        case .strApiGetSettingDetails:
            let aStr = String(format: "%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage)
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strFloorListApi:
            //  /locations/<stage>/{locationId}/floors/inventory
            let aStr = String(format: "%@%@/%@%@", KBaseUrl_Amazon, "/locations/" + APIStage , parameters["locId"] as! String, "/floors/inventory")
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strAPiFloorProducts:
            let aStr = String(format: "%@%@/%@%@", KBaseUrl_Amazon, "/locations/" + APIStage + "/floors" , parameters["skuId"] as! String, "/products"  )
            hitGETAmazonApi(parameters, path: aStr)
            
            
            break
        case .strPickShipment:
            
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/shipments/" + APIStage + "/carrier/pick")
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strGetShipmentDetails:
            //            var urlComponents = URLComponents(string: Kbase_url+"/reader/getShipmentDetails")!
            //            let str = parameters["shipmentNo"]! as? String
            //            urlComponents.queryItems = [
            //                URLQueryItem(name: "caseNo", value:parameters["caseNo"]! as? String),
            //                URLQueryItem(name: "shipmentNo", value:str!.removingPercentEncoding),
            //            ]
            
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/shipments/" + APIStage + "/carrier/" + (parameters["shipmentid"]! as! String) )
            print(aStr)
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strPostComment:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/tasks/" + APIStage + "/incident")
            hitPOSTAmazonApiWithToken(parameters, path: aStr)
            break;
        case .strApiGETComments:
            var urlComponents = URLComponents(string: Kbase_url+"/reader/getIssueComments")!
            let str = parameters["ShipmentNumber"]! as? String
            urlComponents.queryItems = [
                URLQueryItem(name: "issueId", value:parameters["issueId"]! as? String),
                URLQueryItem(name: "shippingNo", value:str!.removingPercentEncoding),
                URLQueryItem(name: "caseNo", value:parameters["caseNo"]! as? String)
            ]
            hitGETApiNSURL(parameters, path: (urlComponents.url?.absoluteString)!)
            break
        case .strApiNotificationApi:
            var urlComponents = URLComponents(string: KBaseUrl_Amazon+"/notifications/" + APIStage + "/")!
            urlComponents.queryItems = [
                URLQueryItem(name: "mobile", value:"1"),
            ]
            hitGETAmazonApi(parameters, path:(urlComponents.url?.absoluteString)!)
            break
        case .strApiSignOut:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/signOut" )
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break
        case .strGetIssues:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/myIssues")
            hitGETApiNSURL(parameters, path: aStr)
            break
        case .strApiGetCountries:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/common/"+APIStage+"/countries")
            //hitGETApiNSURL(parameters, path: aStr)
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strApiDeleteUserProfile:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/updateProfile")
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break
        case .strApiGlobalSearch:
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "/shipments/" + APIStage + "/carrier/search")!
            urlComponents.queryItems = [
                URLQueryItem(name: "query", value:parameters["query"]! as? String),
            ]
            let str =  KBaseUrl_Amazon + "/shipments/" + APIStage + "/carrier/search?query="+"\(parameters["query"]! as! String)"
            
            
            
            hitGETAmazonApi(parameters, path:str )//(urlComponents.url?.absoluteString)!
            break
        case .strApiGetUserCommentsForIssue:
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "tasks/api/incident/<IncidentId>"+APIStage)!
            let str  = parameters["shippingNo"]! as? String
            
            urlComponents.queryItems = [
                //URLQueryItem(name: "caseNo", value:parameters["caseNo"]! as? String),
                URLQueryItem(name: "shippingNo", value:str)//!.stringByRemovingPercentEncoding
                // URLQueryItem(name: "issueId", value:parameters["issueId"]! as? String)
            ]
            hitGETAmazonApi(parameters, path: (urlComponents.url?.absoluteString)!)

            break
        case .strApiGetCaseItemComments:
            var urlComponents = URLComponents(string: Kbase_url+"/reader/getCaseItemComments")!
            urlComponents.queryItems = [
                URLQueryItem(name: "caseNo", value:parameters["caseNo"]! as? String),
                URLQueryItem(name: "skuId", value:parameters["skuId"]! as? String),
            ]
            hitGETApiNSURL(parameters, path: (urlComponents.url?.absoluteString)!)
            break
        case .strApiGetInventory:
          
            let aStr = String(format: "%@%@/%@%@", KBaseUrl_Amazon, "/locations/" + APIStage + "/floors" , parameters["skuId"] as! String, "/products"  )
            hitGETAmazonApi(parameters, path: aStr)

          
            
//           // let aStr = String(format: "%@%@/%@%@", KBaseUrl_Amazon, "/locations/" + APIStage + "/floors" , parameters["skuId"] as! String, "/products"  ) //"/locations/floorzoneproducts", parameters["skuId"] as! CVarArg)
//            // hitGETApiAmazon(parameters, path: aStr)
//            
//            
//            let aStr = String(format: "%@%@%@", KBaseUrl_Amazon, "/products/" + APIStage + "/inventory/",parameters["skuId"] as! CVarArg)
//            
//            hitGETAmazonApi(parameters, path: aStr)


             
            break
        case .strApiGetInventoryItemDetails:
           
            
            
            
            //           // let aStr = String(format: "%@%@/%@%@", KBaseUrl_Amazon, "/locations/" + APIStage + "/floors" , parameters["skuId"] as! String, "/products"  ) //"/locations/floorzoneproducts", parameters["skuId"] as! CVarArg)
            //            // hitGETApiAmazon(parameters, path: aStr)
            //
            //
            let aStr = String(format: "%@%@%@", KBaseUrl_Amazon, "/products/" + APIStage + "/inventory/",parameters["skuId"] as! CVarArg)
            
            hitGETAmazonApi(parameters, path: aStr)
            
            
            
            break
        case .strDeviceInformation:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon,  "/things/" + APIStage + "/devices")
            hitPOSTApiDeviceRegistration(parameters, path: aStr)
            break
        case .strDeleteNotification:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/notifications/" + APIStage + "/archive")
            hitPUTApiWithAmazon(parameters, path: aStr)

            break
        case .strApiGetLocationData:
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "/locations/" + APIStage + "/inventory")!
            urlComponents.queryItems = [
                URLQueryItem(name: "latitude", value:parameters["latitude"]! as? String),
                URLQueryItem(name: "longitude", value:parameters["longitude"]! as? String),
                URLQueryItem(name: "locationId", value:parameters["locationId"]! as? String)
            ]
            hitGETAmazonApi(parameters, path: (urlComponents.url?.absoluteString)!)
//            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/locations/" + APIStage + "/inventory?dd=1")
//            
//            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strUpdatScanInformation:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/updateInventoryScanData")
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break
        case .strApiUpdateItemInventory:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/updateItemInventory")
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break;
        case .strApiSubmitSurgeryReport:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/submitSurgeryReport")
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break;
        case .strUpdateTimeZone:
            let aStr = String(format: "%@%@", Kbase_url, "/reader/updateProfile")
            hitPOSTApiWithAlaomfire(parameters, path: aStr)
            break
        case  .strMarkedDelivered:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/shipments/" + APIStage + "/deliver/" + (parameters["shipmentid"]! as! String) )
            //parameters.removeValue(forKey: "shipmentid");
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case  .strAPiLoginLink:
         
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/things/" + APIStage + "/device/link")
            //parameters.removeValue(forKey: "shipmentid");
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case  .strAPiLogoutUNLink:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/things/" + APIStage + "/device/unlink" )
            //parameters.removeValue(forKey: "shipmentid");
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strUpdateUserProfile:
            let aStr = String(format: "%@%@", KBaseUrl_Amazon, "/users/" + APIStage + "/profile" )
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strApiUpdateSettingDetails:
            let aStr = String(format: "%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage)
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strApiTrackingSetting:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage, "/trackingHours/")
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strApigetContactSettings:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage, "/emergencyContacts/")
            hitGETAmazonApi(parameters, path: aStr)
            break
        case .strApiUpdateContactSettings:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage, "/emergencyContacts/")
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strApiUpdateTrackingSetting:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/settings/",APIStage, "/trackingHours/")
            hitPUTApiWithAmazon(parameters, path: aStr)
            break
        case .strApiGetGeofences:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/locations/",APIStage, "/list/")
            hitGETAmazonApiNOAUTH(parameters, path: aStr)
            break
        case .strGetTaskDetails:
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/tasks/",APIStage, "/\(parameters["id"] as! String)/")
            hitGETAmazonApi(parameters, path: aStr)
        case .strPostNotes:
           let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/tasks/",APIStage, "/\(parameters["id"] as! String)?mobile=1")
            hitPUTApiWithAmazon(parameters, path: aStr)
        case .strTourHistory:
           // https://guardtrakapi.akwa.io/tasks/api/tours
            let aStr = String(format: "%@%@%@%@", KBaseUrl_Amazon,"/tasks/",APIStage, "/tours")
            hitGETAmazonApi(parameters, path: aStr)
            
        case .strEventList:
            //  https://guardtrakapi.akwa.io/report/api/tour/events?offset=0&limit=100&sort=-actionDate&tourId=AAAAAAA
            var urlComponents = URLComponents(string: KBaseUrl_Amazon + "/report/" + APIStage + "/tour/events")!
            urlComponents.queryItems = [
                URLQueryItem(name: "sort", value:parameters["sort"]! as? String),
                URLQueryItem(name: "tourId", value:parameters["tourId"]! as? String),
            ]
            hitGETAmazonApi(parameters, path: (urlComponents.url?.absoluteString)!)
        case .strGetEventDetails:
            //https://guardtrakapi.akwa.io/tasks/api/incident/<IncidentId>
             let aStr = String(format: "%@%@%@%@%@", KBaseUrl_Amazon,"/tasks/",APIStage, "/incident/",parameters["IncidentId"] as! String)
            hitGETAmazonApi(parameters, path: aStr)
            
        }
        
    }
    
    fileprivate func hitPUTApiWithAmazon(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let request = NSMutableURLRequest(url: URL(string:path)!)
        let generateToken = utility.getIdToken() + "::" + utility.getAccessToken()
        request.httpMethod = "PUT"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(generateToken, forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("guardtrak", forHTTPHeaderField:"Appname")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: []);
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            guard error == nil && data != nil else {                                                          // check for fundamental
                self.errorCallBack!(error! as NSError)
                return
            }
            
            let test = response as? HTTPURLResponse
            print(test!.statusCode)
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
            }
            else
            {
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,AnyObject>(), path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict)
                }
            }
            
        })
        task.resume()
    }
    fileprivate func hitGETAmazonApi(_ params: Dictionary<String,AnyObject>,path:String)->Void{
       
        if isTokenExpire(){
            
        }
        let escapedAddress = path.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)//addingPercentEscapes(using: String.Encoding.utf8)
        let generateToken = utility.getIdToken() + "::" + utility.getAccessToken()
        let request = NSMutableURLRequest(url: URL(string: escapedAddress!)!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(generateToken, forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("guardtrak", forHTTPHeaderField:"Appname")
        
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            
            guard error == nil && data != nil else {
                self.errorCallBack!(error! as NSError)
                return
            }
            //9932080037/9679554840
            let test = response as? HTTPURLResponse
            print("Response Code \(test!.statusCode)")
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
            }
            else
            {
                
                
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: []) as! [String : AnyObject];
                print (dict)
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict)
                }
            }
        })
        task.resume()
    }
    fileprivate func hitGETAmazonApiNOAUTH(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        
        
        let escapedAddress = path.addingPercentEncoding(withAllowedCharacters: .urlQueryAllowed)//addingPercentEscapes(using: String.Encoding.utf8)
        let request = NSMutableURLRequest(url: URL(string: escapedAddress!)!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("guardtrak", forHTTPHeaderField:"Appname")
        
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            
            guard error == nil && data != nil else {
                self.errorCallBack!(error! as NSError)
                return
            }
            let test = response as? HTTPURLResponse
            print("Response Code \(test!.statusCode)")
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
            }
            else
            {
                
                
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: []) as! [String : AnyObject];
                print (dict)
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict)
                }
            }
        })
        task.resume()
    }

    
    
    // Use for Case Api And all
    fileprivate func hitPOSTApiDeviceRegistration(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let request = NSMutableURLRequest(url: URL(string:path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue("noauth", forHTTPHeaderField: "authorization")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("guardtrak", forHTTPHeaderField:"Appname")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: .prettyPrinted);

        
        let task = URLSession.shared.dataTask(with: (request as? URLRequest)!, completionHandler: { data, response, error in
            guard error == nil && data != nil else {                                                          // check for fundamental
                print("error=\(error as! NSError)")
                self.errorCallBack!(error! as NSError)
                return
            }
            
            let test = response as? HTTPURLResponse
            print(test!.statusCode)
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                //utility.setUserToken(" ")
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
            }
            else
            {
                let dict:Dictionary<String,AnyObject> = try! JSONSerialization.jsonObject(with: data!, options: .mutableContainers) as! Dictionary<String,AnyObject>;
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict as! Dictionary<String, AnyObject>)
                }
            }
            
        })
        task.resume()
    }
    
    
    // Use for Case Api And all
    fileprivate func hitPOSTAmazonApiWithToken(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let request = NSMutableURLRequest(url: URL(string:path)!)
        if isTokenExpire(){
            
        }
        let generateToken = utility.getIdToken() + "::" + utility.getAccessToken()
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(generateToken, forHTTPHeaderField: "Authorization")
        request.addValue("application/json", forHTTPHeaderField: "Accept")
        request.setValue("guardtrak", forHTTPHeaderField:"Appname")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: .prettyPrinted);
        let task = URLSession.shared.dataTask(with: (request as? URLRequest)!, completionHandler: { data, response, error in
            guard error == nil && data != nil else {                                                          // check for fundamental
                print("error=\(error as! NSError)")
                self.errorCallBack!(error! as NSError)
                return
            }
            
            let test = response as? HTTPURLResponse
            print(test!.statusCode)
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                //utility.setUserToken(" ")
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
            }
            else
            {
                let dict:Dictionary<String,AnyObject> = try! JSONSerialization.jsonObject(with: data!, options: .mutableContainers) as! Dictionary<String,AnyObject>;
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict as! Dictionary<String, AnyObject>)
                }
            }
            
        })
        task.resume()
    }
    func isTokenExpire() -> Bool{
        
        self.pool = AWSCognitoIdentityUserPool(forKey: AWSCognitoUserPoolsSignInProviderKey)
        if (self.user == nil) {
            self.user = self.pool?.currentUser()
            
        }
        self.user?.getSession().continueOnSuccessWith(block: { (task ) -> Any? in
            if task.error == nil {
                
                print("coginto id \(task.result)")
                let ret = task.result! as AWSCognitoIdentityUserSession
                let myToken = ret.idToken?.tokenString;
                let accessToken = ret.accessToken?.tokenString
                
                
                utility.setIdToken(myToken!)
                utility.setAccessToken(accessToken!)
            }else{
                print("coginto id \(task.error)")
            }
            return nil
        })
        
        return true
        
        
    }
    
    
    
    // Use for Case Api And all
    fileprivate func hitPOSTApiWithAlaomfire(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let request = NSMutableURLRequest(url: URL(string:path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(utility.getDevice(), forHTTPHeaderField:"deviceId")
        request.setValue("traquer", forHTTPHeaderField:"AppType")
        request.setValue(utility.getUserToken(), forHTTPHeaderField:"sid")
        request.setValue("courier", forHTTPHeaderField:"role")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: []);
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            guard error == nil && data != nil else
            {                                                          // check for fundamental
                print("error=\(error)")
                self.errorCallBack!(error! as NSError)
                return
            }
            
            let test = response as? HTTPURLResponse
            print(test!.statusCode)
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
                
            }
            else
            {
                
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict as! Dictionary<String, AnyObject>)
                }
            }
            
        })
        task.resume()
    }
    
    fileprivate func hitGETApiNSURL(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let escapedAddress = path.addingPercentEscapes(using: String.Encoding.utf8)
        let request = NSMutableURLRequest(url: URL(string: escapedAddress!)!)
        request.httpMethod = "GET"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(utility.getDevice(), forHTTPHeaderField:"deviceId")
        request.setValue(utility.getUserToken(), forHTTPHeaderField:"sid")
        request.setValue("traquer", forHTTPHeaderField:"AppType")
        request.setValue("courier", forHTTPHeaderField:"role")
        
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            
            guard error == nil && data != nil else {
                print("error=\(error)")
                self.errorCallBack!(error! as NSError)
                return
            }
            let test = response as? HTTPURLResponse
            print(test!.statusCode)
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
                
            }
            else
            {
                
                
                //                let dict = try! JSONSerialization.jsonObject(with: data!, options: []);
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
                print (dict)
                if(dict["code"] as! NSNumber == 209)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        self.hitPOSTApiNSURLSession(Dictionary<String,String>() as Dictionary<String, AnyObject>, path:String(format: "%@%@", Kbase_url, "/reader/generateSession") )
                    }
                    
                }
                else if (dict["code"] as! NSNumber  == 210)
                {
                    utility.setUserToken(" ")
                    DispatchQueue.main.async {
                        let appDelegate = UIApplication.shared.delegate as! AppDelegate
                        appDelegate.initSideBarMenu()
                    }
                }
                else{
                    self.prevData = nil
                    self.successCallBack!(dict as! Dictionary<String, AnyObject>)
                }
            }
        })
        task.resume()
    }
    
    //MARK: session and login methods for post
    fileprivate func hitPOSTApiNSURLSession(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        let request = NSMutableURLRequest(url: URL(string:path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(utility.getDevice(), forHTTPHeaderField:"deviceId")
        print(utility.getPermToken()!)
        request.setValue(utility.getPermToken()!, forHTTPHeaderField:"sid")
        request.setValue("courier", forHTTPHeaderField:"role")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: []);    let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            guard error == nil && data != nil else {                                                                          print("error=\(error)")
                self.errorCallBack!(error! as NSError)
                return
            }
            
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
                
            }
            if(self.prevData != nil)
            {
                
                let dict1:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
                guard let dict2 = dict1["data"] as? [String:AnyObject],let readerGenerateSessionResponse = dict2["readerGenerateSessionResponse"] as? [String:AnyObject] else{
                    return
                }
                utility.setUserToken((readerGenerateSessionResponse["token"] as? String)!)
                DispatchQueue.main.async {
                    self.hitApiwith(self.prevData!, serviceType: self.prevrequest!, success:self.successCallBack!, failure:self.errorCallBack!)
                }
            }
            else
            {
                let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
                // let dict = try! JSONSerialization.jsonObject(with: data!, options: []);
                print (dict)
                self.successCallBack!(dict as! Dictionary<String, AnyObject>)
            }
        })
        task.resume()
        
    }
    fileprivate func hitPOSTApiNSURLLogin(_ params: Dictionary<String,AnyObject>,path:String)->Void{
        self.prevData=nil
        let request = NSMutableURLRequest(url: URL(string:path)!)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")
        request.setValue(utility.getDevice(), forHTTPHeaderField:"deviceId")
        request.setValue("courier", forHTTPHeaderField:"role")
        
        request.httpBody = try! JSONSerialization.data(withJSONObject: params, options: []);
        let task = URLSession.shared.dataTask(with: request as URLRequest, completionHandler: { data, response, error in
            print(response)
            guard error == nil && data != nil else {                                                          // check for fundamental networking error
                print("error=\(error)")
                self.errorCallBack!(error! as NSError)
                return
            }
            
            if let httpStatus = response as? HTTPURLResponse, httpStatus.statusCode > 299 {           // check for http errors
                print("statusCode should be 200, but is \(httpStatus.statusCode)")
                print("response = \(response)")
                let err = NSError(domain:"API_Nicbit" , code: 500, userInfo: ["description":"Status code not 200"])
                self.errorCallBack!(err)
                return
                
            }
            print("response = \(response)")
            
            let dict:[String:AnyObject] = try! JSONSerialization.jsonObject(with: data!, options: .mutableLeaves) as! [String : AnyObject];
            //   let dict = try! JSONSerialization.jsonObject(with: data!, options: []);
            print (dict)
            self.successCallBack!(dict as! Dictionary<String, AnyObject>)
        }) 
        task.resume()
        
    }
    
    
    
    
}

