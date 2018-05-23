import UIKit
import MessageUI
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
fileprivate func <= <T : Comparable>(lhs: T?, rhs: T?) -> Bool {
  switch (lhs, rhs) {
  case let (l?, r?):
    return l <= r
  default:
    return !(rhs < lhs)
  }
}


class STRSettingViewController: UIViewController, SSRadioButtonControllerDelegate ,MFMailComposeViewControllerDelegate,UIPopoverPresentationControllerDelegate,UIDocumentInteractionControllerDelegate{

    var rowArrayExpanded: Array<Int>?
    var sectionArray : NSMutableArray = NSMutableArray()
    var sectionContentDict : NSMutableDictionary = NSMutableDictionary()
    var optionMenu : UIAlertController?
    var radioButtonController: SSRadioButtonsController?
    @IBOutlet weak var tableView: UITableView!
    var selectedIndexpath : IndexPath?
    var dataArrayObj : NSDictionary?
    
     var switchControlObj : SevenSwitch?
    
    var defaultView : String?
    var defaultSortedby : String?
    var defaultSortedorder : String?
    var notification : Bool?  //ONOFF to Bool
    var sound : Bool?//ONOFF to Bool
     var vibration : Bool?//ONOFF to Bool
     var led : Bool?//ONOFF to Bool
     var silentFrom : String?
     var silentTo : String?
     var beaconServiceStatus: Bool = false//ONOFF to Bool
    let tmp4 : NSArray = ["Alerts", "Beacon Services"]
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.generalSetting.rawValue
        customizeNavigationforAll(self)
        let nib = UINib(nibName: "SettingTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "settingTableViewCell")
        let nib2 = UINib(nibName: "SettingWithSwitchCell", bundle: nil)
        tableView.register(nib2, forCellReuseIdentifier: "settingWithSwitchCell")
        tableView.sectionFooterHeight = 0.0;
        dataFeeding()
        
        sectionArray  = [SettingSectionMessage.Notification.rawValue]
//   SettingSectionMessage.DashboardDefaultView.rawValue, SettingSectionMessage.DashboardSortedBy.rawValue, SettingSectionMessage.DashboardSortedOrder.rawValue,
        
        let tmp1 : NSArray = [DashboardTitle.All.rawValue , DashboardTitle.Favorites.rawValue , DashboardTitle.alert.rawValue]
        
        var string1 = sectionArray .object(at: 0) as? String
        sectionContentDict.setValue(tmp4, forKey:string1! )
//        let tmp2 : NSArray = sortDataPopUp as NSArray
//        string1 = sectionArray .object(at: 1) as? String
//        sectionContentDict .setValue(tmp2, forKey:string1! )
//        let tmp3 : NSArray = ["Ascending","Descending"]
//        string1 = sectionArray .object(at: 2) as? String
//        sectionContentDict .setValue(tmp3, forKey:string1! )
//        string1 = sectionArray .object(at: 3) as? String
//        sectionContentDict .setValue(tmp4, forKey:string1! )
       
        self.revealViewController().panGestureRecognizer().isEnabled = false
    }

    
    func dotButtonClicked() {
        
        addpopup()
    }
    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.navigationBar.isHidden = false
    }
    func sortButtonClicked(_ sender : AnyObject){
        
//        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
//        self.navigationController?.pushViewController(VW, animated: true)
        
    }
    func backToDashbaord(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
    func logOut() {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        
        
        generalApiobj.hitApiwith([:], serviceType: .strApiSignOut, success: { (response) in
            DispatchQueue.main.async {
                
                //  print(response["data"] ?? <#default value#>)
                
                let dataDictionary = response["message"] as? String
                
                if dataDictionary == "Ok" {
                    utility.setUserToken(" ")
                    self.presentLogin()
                }

                
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                NSLog(" %@", err)
            }
        }
    }
    
    func presentLogin() -> () {
        let login = STRLoginViewController(nibName: "STRLoginViewController", bundle: nil)
        let nav = UINavigationController(rootViewController: login)
        self.navigationController?.present(nav, animated: true, completion: {
            
        })
        
    }
    
    func dataFeeding()  {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        
        
        generalApiobj.hitApiwith([:], serviceType: .strApiGetSettingDetails, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                let dataDictionary = response["data"] as? [String : AnyObject]
                if dataDictionary?.count <= 0 {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    return
                }
                let dictResult = dataDictionary! as NSDictionary
                self.dataArrayObj = dictResult["readerGetSettingsResponse"]  as? NSDictionary
                self.setValueInDefaults(self.dataArrayObj!)
                self.tableView .reloadData()
                
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                NSLog(" %@", err)
            }
        }
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }

    @IBAction func saveButtonClicked(_ sender: AnyObject) {
        
        
    }
    
    
    
    func numberOfSectionsInTableView(_ tableView: UITableView) -> Int {
        
        return (self.sectionArray.count)
        
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        let tps = sectionArray.object(at: section) as! String
        let count1 = (sectionContentDict.value(forKey: tps)) as! NSArray
        return count1.count
        
    }
    
    
    
    func tableView(_ tableView: UITableView, didSelectRowAtIndexPath indexPath: IndexPath) {
       
        selectedIndexpath = indexPath
        
        if indexPath.section == 0 {
            if indexPath.row == 0
            {
                let theswitch = self.tableView.viewWithTag(10) as? SevenSwitch
                if  theswitch!.on{
                    sound = false
                    vibration = false
                    led = false
                }else{
                    sound = true
                    vibration = true
                    led = true
                }
            }
            if indexPath.row == 1
            {
                let theswitch = self.tableView.viewWithTag(11) as? SevenSwitch
                if  theswitch!.on{
                    beaconServiceStatus = false
                }else{
                    beaconServiceStatus = true
                }
            }
        }
        
        
        if indexPath.section == 3 {
            if indexPath.row == 0
            {
                defaultView = "All"
                
            }
            if indexPath.row == 1
            {
                defaultView = "Watched"
            }
            if indexPath.row == 2
            {
                defaultView = "Exceptions"
            }
            
        }
        
        
        if indexPath.section == 1 {
            if indexPath.row == 0
            {
                defaultSortedby = sortDataFromApi[0]
            }
            if indexPath.row == 1
            {
                defaultSortedby = sortDataFromApi[1]
            }
            if indexPath.row == 2
            {
                defaultSortedby = sortDataFromApi[2]
            }
            if indexPath.row == 3 {
                defaultSortedby = sortDataFromApi[3]
            }
            if indexPath.row == 4 {
                defaultSortedby = sortDataFromApi[4]
            }
            if indexPath.row == 5 {
                defaultSortedby = sortDataFromApi[5]
            }
            
        }
        
        
       
        if indexPath.section == 2 {
            if indexPath.row == 0
            {
                defaultSortedorder = "asc"
            }
            if indexPath.row == 1
            {
                defaultSortedorder = "desc"
            }
        }
        
        
       
        let silentHrFrom : String = "2016-06-10T01:30:00+00:00"
        let silentHrTo : String = "2016-06-10T05:30:00+00:00"
        updateSettingDetailApi(defaultView!, sortedbyObj: defaultSortedby!, sortedOrderObj: defaultSortedorder!, notificationObj: notification!, soundObj: sound!, silentFromObj: silentHrFrom, silentToObj: silentHrTo, vibrationObj: vibration!, ledObj: led!, beaconServiceStatusObj: beaconServiceStatus)
        
    }
    func tableView(_ tableView: UITableView, heightForHeaderInSection section: Int) -> CGFloat {
        return 50
    }
    
    func tableView(_ tableView: UITableView, viewForHeaderInSection section: Int) -> UIView? {
        let vw = Bundle.main.loadNibNamed("STRSettingSectionHeader", owner: nil, options: nil)!.last as! STRSettingSectionHeader
        vw.frame =  CGRect(x: 0, y: 0, width: tableView.frame.size.width, height: 50)
        vw.LblTitle.text = sectionArray.object(at: section) as? String
        return vw
    }

    func tableView(_ tableView: UITableView, cellForRowAtIndexPath indexPath: IndexPath) -> UITableViewCell {
        
        if indexPath.section == 0 {
           let cellSwitch: SettingWithSwitchCell = self.tableView.dequeueReusableCell(withIdentifier: "settingWithSwitchCell") as! SettingWithSwitchCell
            let content = sectionContentDict .value(forKey: sectionArray.object(at: indexPath.section) as! String) as! NSArray
            cellSwitch.labelName!.text = content .object(at: indexPath.row) as? String
            
            print(indexPath.section + indexPath.row + 10)
            cellSwitch.switchControl?.tag = indexPath.section + indexPath.row + 10
            cellSwitch.switchControl!.setOn(false, animated: true)
            if indexPath.row == 0 && sound == true  {
                cellSwitch.switchControl!.setOn(true, animated: true)
            }
            if indexPath.row == 1 && beaconServiceStatus == true {
                 cellSwitch.switchControl!.setOn(true, animated: true)
            }
            cellSwitch.selectionStyle = UITableViewCellSelectionStyle.none
            
            return cellSwitch
        } else
        {
        let cell: SettingTableViewCell = self.tableView.dequeueReusableCell(withIdentifier: "settingTableViewCell") as! SettingTableViewCell
           
          
        let content = sectionContentDict .value(forKey: sectionArray.object(at: indexPath.section) as! String) as! NSArray
        let labelString  = content .object(at: indexPath.row) as? String
            
            if indexPath.section == 3{
                if dataArrayObj != nil {
                    var apiStringOrder = dataArrayObj!["dashboardDefaultView"] as? String
                    if apiStringOrder == "Watched" {
                        apiStringOrder = "Favorites"
                    }else if apiStringOrder == "Exceptions" { apiStringOrder = "Alerts" }
                    if labelString == apiStringOrder{
                        cell.switchControl?.setImage(UIImage(named: "rbselected"),for:UIControlState())
                    }
                    else{
                        cell.switchControl?.setImage(UIImage(named: "rbunselected"),for:UIControlState())
                    }
                }
            }
            if indexPath.section == 1{
                if dataArrayObj != nil {
                    var apiStringOrder = dataArrayObj!["dashboardSortBy"] as? String
                    if apiStringOrder == "code"{//"CaseNo"
                        apiStringOrder = "Order#"
                    }else if apiStringOrder == "orderStatusUpdatedOn" {   apiStringOrder = "Last Status Changed"   }else if apiStringOrder == "etd"{
                        apiStringOrder = "Surgery Date"
                    }
                    
                    if labelString == apiStringOrder{
                        cell.switchControl?.setImage(UIImage(named: "rbselected"),for:UIControlState())
                    }
                    else{
                        cell.switchControl?.setImage(UIImage(named: "rbunselected"),for:UIControlState())
                    }
                }
            }
            
            if indexPath.section == 2{
                if dataArrayObj != nil {
                    var apiStringOrder = dataArrayObj!["dashboardSortOrder"] as? String
                    if apiStringOrder == "desc"{
                        apiStringOrder = "Descending"
                    }else{   apiStringOrder = "Ascending"   }
                    
                    if labelString == apiStringOrder{
                        cell.switchControl?.setImage(UIImage(named: "rbselected"),for:UIControlState())
                    }
                    else{
                        cell.switchControl?.setImage(UIImage(named: "rbunselected"),for:UIControlState())
                    }
                }
            }
        cell.labelName!.text = labelString
        cell.selectionStyle = UITableViewCellSelectionStyle.none
            return cell
       }
    }

    @IBAction func showActionSheet(_ sender: AnyObject) {
        
        
        optionMenu = UIAlertController(title: nil, message: "Choose Option", preferredStyle: .actionSheet)
        
        
        
       
        
        let deleteAction = UIAlertAction(title: "Edit Profile", style: .default, handler: {
            (alert: UIAlertAction!) -> Void in
            
           
//            let strNotification = STREditProfileVC.init(nibName: "STREditProfileVC", bundle: nil)
//            self.navigationController?.pushViewController(strNotification, animated: true)
            
        })
        let saveAction = UIAlertAction(title: "Sign Out", style: .default, handler: {
            (alert: UIAlertAction!) -> Void in
            
             self.logOut()
        })
        let cancelAction = UIAlertAction(title: "Cancel", style: .cancel, handler: {
            (alert: UIAlertAction!) -> Void in
            
        })
        optionMenu!.addAction(deleteAction)
        optionMenu!.addAction(saveAction)
        optionMenu!.addAction(cancelAction)
        
        optionMenu!.popoverPresentationController?.sourceView = self.view
        optionMenu!.popoverPresentationController?.sourceRect = self.view.bounds
        // this is the center of the screen currently but it can be any point in the view
        
        optionMenu!.isModalInPopover = true
        
        let pop = optionMenu!.popoverPresentationController
        pop?.sourceRect=CGRect(x: self.view.frame.size.width, y: 0, width: 40, height: 40)
        pop?.sourceView=self.view
        pop?.delegate = self
        
        self.present(optionMenu!, animated: true, completion: nil)
    }

   
    
    
    
    
    func tableView(_ tableView: UITableView, heightForRowAtIndexPath indexPath: IndexPath) -> CGFloat {
        return 40
    }

    
    func updateSettingDetailApi(_ defaultViewObj : String, sortedbyObj : String,sortedOrderObj : String, notificationObj : Bool, soundObj : Bool, silentFromObj : String, silentToObj : String, vibrationObj : Bool, ledObj : Bool, beaconServiceStatusObj : Bool) {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        
        
        let someDict:[String:Any] = ["dashboardDefaultView":defaultViewObj, "dashboardSortBy":sortedbyObj,"dashboardSortOrder":sortedOrderObj, "notifications":notificationObj,"sound":soundObj,"silentHrsFrom":silentFromObj,"silentHrsTo":silentToObj, "vibration":vibrationObj, "led":ledObj, "beaconServiceStatus" : beaconServiceStatusObj]
        generalApiobj.hitApiwith(someDict as Dictionary<String, AnyObject>, serviceType: .strApiUpdateSettingDetails, success: { (response) in
            DispatchQueue.main.async {
                
                
                let dataDictionary = response["message"] as? String
                
                if dataDictionary == "Ok" {
                }
                self.dataFeeding()
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                NSLog(" %@", err)
            }
        }
    }

    
    
    func setValueInDefaults(_ infoDictionary : NSDictionary) {
        self.defaultView = self.dataArrayObj!["dashboardDefaultView"] as? String
        if self.defaultView == "All" {
            utility.setselectedIndexDashBoard("0")
        }else if self.defaultView == "Watched" {
            utility.setselectedIndexDashBoard("1")
        }else if self.defaultView == "Exceptions" {
            utility.setselectedIndexDashBoard("2")
        }
        
        
        self.defaultSortedby = self.dataArrayObj!["dashboardSortBy"] as? String
        
        utility.setselectedSortBy(self.defaultSortedby!)
        
        self.defaultSortedorder = self.dataArrayObj!["dashboardSortOrder"] as? String
        utility.setselectedSortOrder(self.defaultSortedorder!)
        
        self.notification = self.dataArrayObj!["notifications"] as? Bool
        self.silentFrom = self.dataArrayObj!["silentHrsFrom"] as? String
        self.silentTo = self.dataArrayObj!["silentHrsTo"] as? String
        self.sound = self.dataArrayObj!["sound"] as? Bool
        utility.setNotificationAlert(self.sound!)
        self.vibration = self.dataArrayObj!["vibration"] as? Bool
        utility.setNotificationVibration(self.vibration!)
        self.led = self.dataArrayObj!["led"] as? Bool
        utility.setNotificationBadge(self.led!)
        self.beaconServiceStatus = (self.dataArrayObj!["beaconServiceStatus"] as? Bool)!
        utility.setBeaconServices(self.beaconServiceStatus)
    }
    
    func addpopup(){
        let popup =  Bundle.main.loadNibNamed("STRPopupSort", owner: self, options: nil)! .first as! STRPopupSort
        popup.tag=10003
        popup.frame=(self.navigationController?.view.frame)!;
        popup.layoutIfNeeded()
        
        self.navigationController?.view.addSubview(popup)
        
        popup.layoutSubviews()
        
        popup.closure = {(sortString)in
            
            print(sortString)
            if sortString == "Sign Out" {
               self.logOut()
            }else{
               
//                let strNotification = STREditProfileVC.init(nibName: "STREditProfileVC", bundle: nil)
//                let leftSideNav = UINavigationController(rootViewController: strNotification)
//                self.revealViewController().setFront(leftSideNav, animated: true)
            }
            
           self.navigationController?.view.viewWithTag(10003)?.removeFromSuperview()
            
        }
        popup.setUpPopup(2)
        
    }
    
   
    func sendMail()->(){
         let documentsPath = NSSearchPathForDirectoriesInDomains(.documentDirectory, .userDomainMask, true)[0] + ("/"+role+"_log.csv")
       
        
        let fileData = URL(fileURLWithPath: documentsPath)
        
        let objectsToShare = [fileData]
        let activityVC = UIActivityViewController(activityItems: objectsToShare, applicationActivities: nil)
        
        self.present(activityVC, animated: true, completion: nil)
        
        // DONE
    }
    //    func configuredMailComposeViewController() -> MFMailComposeViewController {
//        let mailData = STRLogFileGenerator()
//        mailData.createCSV()
//        let emailController = MFMailComposeViewController()
//        emailController.mailComposeDelegate = self
//        emailController.setSubject("CSV File")
//        emailController.setMessageBody("", isHTML: false)
//        
//        // Attaching the .CSV file to the email.
//        emailController.addAttachmentData(mailData.csv(), mimeType: "text/csv", fileName: "Sample.csv")
//        return emailController
    //   }

    // MARK: MFMailComposeViewControllerDelegate
    
    func mailComposeController(_ controller: MFMailComposeViewController, didFinishWith result: MFMailComposeResult, error: Error?) {
        controller.dismiss(animated: true, completion: nil)
        
    }
    
    func popoverPresentationControllerShouldDismissPopover(_ popoverPresentationController: UIPopoverPresentationController) -> Bool {
        return true
    }

}
