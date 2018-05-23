 
import UIKit

import Crashlytics
import AKProximity
import JWTDecode
import WebKit
// FIXME: comparison operators with optionals were removed from the Swift Standard Libary.
// Consider refactoring the code to use the non-optional operators.
fileprivate func < <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
    switch (lhs, rhs) {
    case let (l?, r?):
        return l < r
    case (nil, _?):
        return true
    default:
        return false
    }
}

// FIXME: comparison operators with optionals were removed from the Swift Standard Libary.
// Consider refactoring the code to use the non-optional operators.
fileprivate func > <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
    switch (lhs, rhs) {
    case let (l?, r?):
        return l > r
    default:
        return rhs < lhs
    }
}


class  HomeViewController:UIViewController{
    var webView:WKWebView!
    var timezone = ""
    var arraySchedules:[Dictionary<String,AnyObject>]?
    var getData:Bool = true

    var isNotesAvaliable :Bool = false
    var tourId: String?
    var id:String?
    var lat:Double? = 0
    var long: Double? = 0

    @IBOutlet weak var lblID: UILabel!
    @IBOutlet weak var notesButton: UIButton!
    @IBOutlet var vwBase: UIView!
    @IBOutlet var lblNavigation: UILabel!
    @IBOutlet weak var vwWebViewBase: UIView!
    @IBAction func btnSideMenu(_ sender: AnyObject) {
        toggleSideMenu(UIButton())
    }
    @IBAction func btnSearch(_ sender: AnyObject) {
        //        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
        //        self.navigationController?.pushViewController(VW, animated: true)
    }
    @IBAction func btnEdit(_ sender: UIButton) {
        
    }
    
    @IBOutlet weak var btnStop: UIButton!
    
    @IBAction func btnStop(_ sender: Any) {
        if (id != nil){
        stopTour(id: self.id!)
        }
    }
    
    @IBOutlet weak var btnStart: UIButton!
    @IBAction func btnStart(_ sender: Any) {
        if (self.arraySchedules != nil){
     let vw =   SchedulesViewController.init(nibName: "SchedulesViewController", bundle: nil)
     vw.data = self.arraySchedules
     vw.timezone = self.timezone
     vw.delegate = self
     let nav = UINavigationController.init(rootViewController: vw)
     self.navigationController?.present(nav, animated: true, completion: nil)
     getData = false
        }
    }
    
    @IBOutlet weak var btnScan: UIButton!
    @IBAction func btnScan(_ sender: Any) {
        if id?.count != 0 && id != "" && id != nil{
            let vw =   QRScannerViewController.init(nibName: "QRScannerViewController", bundle: nil)
            vw.tourId = self.id
            vw.name = self.lblID.text
            vw.delegate = self
            let nav = UINavigationController.init(rootViewController: vw)
            self.navigationController?.present(nav, animated: true, completion: nil)
            getData = false
        }
        else{
            utility.createAlert("", alertMessage: "No active tour", alertCancelTitle: "Ok", view: self.view)
        }
        //self.navigationController?.pushViewController(vw, animated: true)
    }
    var location: OneTimeLocation?
    
    
    override var preferredStatusBarStyle : UIStatusBarStyle {
        return UIStatusBarStyle.lightContent
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        NotificationCenter.default.post(Notification(name: Notification.Name(rawValue: "UPDATEPROFILENOTIFICATION"), object: nil))
        self.navigationController?.navigationBar.isHidden = true
        self.revealViewController().panGestureRecognizer().isEnabled = true

     self.view .addGestureRecognizer(self.revealViewController().tapGestureRecognizer())
        addWebView()
         notesButton.isEnabled = false
        
        location = OneTimeLocation(block: { (lat, long) in
            self.lat = lat
            self.long = long
            var str = mapUrl
            str = str + ("?latitude=\(lat)&longitude=\(long)")
            let myRequest = URLRequest(url: URL(string:str)!)
            self.webView.load(myRequest)
        })
        }
        
    func setUpInitialState(){
        self.btnStop.isEnabled = false
        self.btnScan.isEnabled = false
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        self.navigationController?.navigationBar.isHidden = true
        if(utility.getIdToken() == nil || utility.getIdToken() == " ")
        {
            
            utility.setflagSession(true)
            self.presentLogin()
            utility.setBeaconServices(true)
        }
        else{
            getTimeZone()
            if getData{
                setUpInitialState()
                getHomeData()
            }
            else{
              getData = true
            }
        }
        
    }
    func presentLogin() -> () {
        let login = STRLoginViewController(nibName: "STRLoginViewController", bundle: nil)
        let nav = UINavigationController(rootViewController: login)
        self.navigationController?.present(nav, animated: false, completion: {
        })
    }
    func refresh(_ refreshControl:UIRefreshControl){
        refreshControl.endRefreshing()
    }
    func setUpFont(){
        self.lblNavigation.font =  UIFont(name: "Roboto-Light", size: 20)!
        
        
    }
    func addWebView(){
        let webConfiguration = WKWebViewConfiguration()
        webView = WKWebView(frame: .zero, configuration: webConfiguration)
        webView.navigationDelegate = self
        webView.translatesAutoresizingMaskIntoConstraints=false
        self.vwWebViewBase.translatesAutoresizingMaskIntoConstraints=false
        self.vwWebViewBase.addSubview(webView)
        self.vwWebViewBase.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-(0)-[webView]-(0)-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["webView" : webView]))
         self.vwWebViewBase.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-(0)-[webView]-(0)-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["webView" : webView]))
    }
    func barButtonItemClicked(_ sender : AnyObject){
        
    }

   
    @IBAction func notesClicked(_ sender: Any) {
        if isNotesAvaliable == true{
            let vw = STRComposeIssueViewController(nibName: "STRComposeIssueViewController", bundle: nil)
            vw.tourId = self.lblID.text
            vw.id  =  self.id
            
            //        vw.itemsArray = self.items
            //        vw.shippingNo = self.shippingNo
            //        vw.shipmentId = self.shipmentId
            //        vw.caseNo     = self.caseNo
            vw.reportType = .strReportCase
            self.navigationController?.pushViewController(vw, animated: true)
            getData = false
        }
       
        
    }

    func sortButtonClicked(_ sender : AnyObject){
        //        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
        //        self.navigationController?.pushViewController(VW, animated: true)
    }
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    
    func returnFormattedDate()->String{
        let formatter = DateFormatter()
        formatter.dateFormat = "yyyy-MM-dd"
        let str = formatter.string(from: Date())
        return str
    }
    
    //MARK:  API Fetch 
    
    func getHomeData()->(){
        var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        let someDict:[String:String] = ["date":returnFormattedDate()]//
        print(someDict)
        generalApiobj.hitApiwith(someDict as Dictionary<String, AnyObject>, serviceType: .strGetHomeData, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                if(response["code"] as! Int !=  200)
                {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    loadingNotification = nil
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                guard let data = response["data"] as? [Dictionary<String,AnyObject>]else{
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                self.arraySchedules = data
                self.btnStop.isEnabled = false
                self.btnScan.isEnabled = false
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                
            }
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                NSLog(" %@", err)
            }
        }
        
    }
    func getTimeZone(){
        do{
            let jwt = try decode(jwt: utility.getIdToken())
            let dict:[String:AnyObject] = jwt.body as [String : AnyObject]
            if let zone = dict["zoneinfo"] as? String{
                self.timezone = zone
            }
        }
        catch{
            
        }
        
    }
    func stopTour(id:String){
        var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        let someDict:[String:String] = ["tourId":id,"lat":"\(self.lat!)","lon":"\(self.long!)"]//
        print(someDict)
        generalApiobj.hitApiwith(someDict as Dictionary<String, AnyObject>, serviceType: .strEndTour, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                if(response["code"] as! Int !=  200)
                {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    loadingNotification = nil
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                guard let _ = response["data"] as? Dictionary<String,AnyObject> else{
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
               // self.arraySchedules = data
                self.btnStop.isEnabled = false
                self.btnScan.isEnabled = false
                self.btnStart.isEnabled = true
                self.notesButton.isEnabled = false
                self.isNotesAvaliable = false
                self.lblID.text = ""
                self.tourId = ""
                self.id = ""
                self.location = OneTimeLocation(block: { (lat, long) in
                    var str = mapUrl
                    str = str + ("?latitude=\(lat)&longitude=\(long)")
                    let myRequest = URLRequest(url: URL(string:str)!)
                    self.webView.load(myRequest)
                })
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                
            }
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                NSLog(" %@", err)
            }
        }
    }
}
extension HomeViewController:SchedulesViewControllerDelegate{
    func didStartTour(id:String,name:String,tourId:String){
        self.btnStart.isEnabled = false
        self.btnStop.isEnabled = true
        self.btnScan.isEnabled = true
        location = OneTimeLocation(block: { (lat, long) in
            var str = mapUrl
            str = str + ("?latitude=\(lat)&longitude=\(long)&tourId=\(id)")
            let myRequest = URLRequest(url: URL(string:str)!)
            self.webView.load(myRequest)
        })
        self.lblID.text = name + "-" + tourId
        self.tourId = tourId
        self.id = id
        notesButton.isEnabled = true
        isNotesAvaliable = true
    }
    
}

extension HomeViewController:WKNavigationDelegate{
    func webView(_ webView: WKWebView, didStartProvisionalNavigation navigation: WKNavigation!){
        let loadingNotification = MBProgressHUD.showAdded(to: self.vwWebViewBase, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"

    }
    func webView(_ webView: WKWebView, didFinish navigation: WKNavigation!) {
        MBProgressHUD.hideAllHUDs(for: self.vwWebViewBase, animated: true)
    }
}
extension HomeViewController:QRScannerViewControllerDelegate{
    func didScanTag(){
        location = OneTimeLocation(block: { (lat, long) in
            var str = mapUrl
            str = str + ("?latitude=\(lat)&longitude=\(long)&tourId=\(self.id!)")
            let myRequest = URLRequest(url: URL(string:str)!)
            self.webView.load(myRequest)
        })
    } 
}


