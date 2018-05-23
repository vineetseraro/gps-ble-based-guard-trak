//
//  SettingViewController.swift
//  STRCourier
//
//  Created by Nitin Singh on 17/10/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit
import SwiftyJSON
class SettingModel : NSObject, NSCoding {
   
    
    var day: String?
    var from : String?
    var to : String?
    
    
    init(day: String?,from : String?,to: String?){
        self.day = day
        self.from = from
        self.to = to
       
    }
    
    func encode(with aCoder: NSCoder) {
        aCoder.encode(self.day, forKey: "day")
        aCoder.encode(self.from, forKey: "from")
        aCoder.encode(self.to, forKey: "to")
    }
    required init(coder decoder: NSCoder) {
        
        if let day = decoder.decodeObject(forKey: "day") as? String{
            self.day = day
        }
        if let from = decoder.decodeObject(forKey: "from") as? String{
            self.from = from
        }
        if let to = decoder.decodeObject(forKey: "to") as? String{
            self.to = to
        }
    }
    
    
    func encodeWithCoder(aCoder: NSCoder) {
        aCoder.encode(self.day, forKey: "day");
        aCoder.encode(self.from, forKey: "from");
        aCoder.encode(self.to, forKey: "to");
    }
    
    
}

class SettingViewController: UIViewController {

    @IBOutlet weak var endTimeText: UITextField!
    @IBOutlet var vwSegment: STRHomeSegment!
    var inputViewObj = UIView()
    @IBOutlet weak var startTimeText: UITextField!
    var textFieldSelected : UITextField!
    var startWeekString  : String! = "00:00"
     var endWeekString  : String! = "23:59"
    var startSunday  : String! = "00:00"
    var endSunday  : String! = "23:59"
    var startSaturday  : String! = "00:00"
    var endSaturday  : String! = "23:59"
    var segmentCount : Int = 0
    var arrayData: [SettingModel]! = []
    var datePickerObject = UIDatePicker()
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.trackingSetting.rawValue
        customizeNavigationforAll(self)
        inputViewObj = UIView()
        dataFeeding()
       
        self.vwSegment.blockSegmentButtonClicked = {(segment) in
            self.segmentCount = segment
            let setting = self.arrayData![segment]
            if segment == 0 {
            print("0")
                
                self.startTimeText.text = setting.from
                self.endTimeText.text = setting.to
            }else if segment == 1{
                print("1")
                self.startTimeText.text = setting.from
                self.endTimeText.text = setting.to
               
            }else{
                print("2")
                self.startTimeText.text = setting.from
                self.endTimeText.text = setting.to
            }
           
//            self.textFieldSelected.isUserInteractionEnabled = true
//            self.textFieldSelected.resignFirstResponder()
//            self.inputViewObj.removeFromSuperview()
        }
        NotificationCenter.default.addObserver(self, selector: #selector(SettingViewController.keyboardWillShow), name: NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(SettingViewController.keyboardWillHide), name: NSNotification.Name.UIKeyboardWillHide, object: nil)
        let tap =  UITapGestureRecognizer(target: self, action: #selector(hidePicker))
        tap.numberOfTapsRequired = 1
        self.view.addGestureRecognizer(tap)
        setUpPicker()
        
    }
    
    func setUpPicker(){
        self.datePickerObject.datePickerMode = .time
        self.startTimeText.inputView = self.datePickerObject
        self.endTimeText.inputView = self.datePickerObject
        self.datePickerObject.addTarget(self, action: #selector(handleDatePicker(_:)), for: UIControlEvents.valueChanged)
    }
    
    @objc func hidePicker(){
        self.textFieldSelected.resignFirstResponder()
    }
    func keyboardWillShow(notification: NSNotification) {
        let keyboardSize = (notification.userInfo![UIKeyboardFrameEndUserInfoKey] as! NSValue).cgRectValue.size
            if self.view.frame.origin.y == 64{
                self.view.frame.origin.y -= keyboardSize.height
            }
        
    }
    
    func keyboardWillHide(notification: NSNotification) {
     let keyboardSize = (notification.userInfo![UIKeyboardFrameEndUserInfoKey] as! NSValue).cgRectValue.size
            if self.view.frame.origin.y != 64{
                self.view.frame.origin.y += keyboardSize.height
            }
    
    }
    func sortButtonClicked(_ sender : AnyObject){
        
//        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
//        self.navigationController?.pushViewController(VW, animated: true)
        
    }
    func backToDashbaord(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
    @IBAction func saveButtonClicked(_ sender: Any) {
        self.textFieldSelected.resignFirstResponder()
        let setting = self.arrayData![segmentCount]
        updateTrackingTime(day: setting.day!, from: setting.from!, to: setting.to!)
    }
    func updateTrackingTime(day : String , from : String , to : String){
        
        if day == "weekdays" {
            let   paramDictfrom : [[String :String]] = [["from": self.appendTimeString(timeString: from), "to":self.appendTimeString(timeString: to)]]
            
            
            let   paramDictsun : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![2].from!), "to":self.appendTimeString(timeString: self.arrayData![2].to!)]]
            
            
            let   paramDictsatr : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![1].from!), "to":self.appendTimeString(timeString: self.arrayData![1].to!)]]
           
            let   paramDict = [day: paramDictfrom, "sunday": paramDictsun, "saturday": paramDictsatr] as [String : Any]
            
            updateTrackingTimeData(paramDict: paramDict as Dictionary<String, AnyObject>)
        }
        if day == "saturday" {
            let   paramDictfrom : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![0].from!), "to":self.appendTimeString(timeString: self.arrayData![0].to!)]]
           
            
            
            let   paramDictsun : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![2].from!), "to":self.appendTimeString(timeString: self.arrayData![2].to!)]]
           
            
            
            let   paramDictsatr : [[String :String]] = [["from": self.appendTimeString(timeString: from), "to":self.appendTimeString(timeString: to)]]
           
            
            let   paramDict = ["weekdays": paramDictfrom, "sunday": paramDictsun, day: paramDictsatr] as [String : Any]
            updateTrackingTimeData(paramDict: paramDict as Dictionary<String, AnyObject>)
            
        }
        if day == "sunday" {
            let   paramDictfrom : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![0].from!), "to":self.appendTimeString(timeString: self.arrayData![0].to!)]]
            
            
            
            let   paramDictsun : [[String :String]] = [["from": self.appendTimeString(timeString:from), "to":self.appendTimeString(timeString: to)]]
          
            
            
            let   paramDictsatr : [[String :String]] = [["from": self.appendTimeString(timeString: self.arrayData![1].from!), "to":self.appendTimeString(timeString: self.arrayData![1].from!)]]
            
            
            let   paramDict = ["weekdays": paramDictfrom, day: paramDictsun, "saturday": paramDictsatr] as [String : Any]
            updateTrackingTimeData(paramDict: paramDict as Dictionary<String, AnyObject>)
            
        }
        
        
        
        
       
        
    }
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    func dataFeeding() {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        let someDict:[String:String] = ["":""]
        generalApiobj.hitApiwith(someDict as Dictionary<String, AnyObject>, serviceType: .strApiTrackingSetting, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                
                guard let data = response["data"] as?  [String:AnyObject] else{
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
               print(data)
                self.setUpData(data: data)
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
    func setUpData(data:[String:AnyObject]){
        let weekdaysValues = data["weekdays"] as? [AnyObject]
        let weekdays = weekdaysValues![0] as! Dictionary<String, AnyObject>
        let settingWeekdays = SettingModel(day: "weekdays", from : self.substringTime(timeString: (weekdays["from"] as? String)!), to: self.substringTime(timeString: (weekdays["to"] as? String)!))
        self.startTimeText.text = self.substringTime(timeString: (weekdays["from"] as? String)!)
        self.endTimeText.text = self.substringTime(timeString: (weekdays["to"] as? String)!)
        self.arrayData?.append(settingWeekdays)
        
        let saturdayValues = data["saturday"] as? [AnyObject]
        let saturday = saturdayValues![0] as! Dictionary<String, AnyObject>
        let settingSaturday = SettingModel(day: "saturday", from : self.substringTime(timeString: (saturday["from"] as? String)!), to: self.substringTime(timeString: (saturday["to"] as? String)!))
        self.arrayData?.append(settingSaturday)
        
        let sundayValues = data["sunday"] as? [AnyObject]
        let sunday = sundayValues![0] as! Dictionary<String, AnyObject>
        let settingObj = SettingModel(day: "sunday", from : self.substringTime(timeString: (sunday["from"] as? String)!), to: self.substringTime(timeString: (sunday["to"] as? String)!))
        self.arrayData?.append(settingObj)
        
        utility.setselectedTrackingTime(self.arrayData!)

    }
    
    func substringTime (timeString: String) -> String {
   
        let start = timeString.startIndex
        let end = timeString.index(timeString.endIndex, offsetBy: -3)
        let substring = timeString[start..<end]
        print(substring)
        return substring
    }
   
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    public func textFieldDidBeginEditing(_ textField: UITextField)
    {
      //  if inputViewObj != nil
      //  {
      //      inputViewObj.removeFromSuperview()
      //  }
     //   textField.resignFirstResponder()
        if textField == startTimeText {
            textFieldSelected = startTimeText

         //   datePicker(textfeild: startTimeText)

        }
        if textField == endTimeText {
            textFieldSelected = endTimeText
       //     datePicker(textfeild: endTimeText)

        }
     //   textFieldSelected.isUserInteractionEnabled = false
    }

    func datePicker (textfeild : UITextField){
        let screenSize = UIScreen.main.bounds
        let screenWidth = screenSize.width
        let origin = (screenWidth/4) - 100
       
            
       
        inputViewObj = UIView(frame: CGRect.init(x: origin, y: self.view.frame.height - 240, width: screenWidth , height: 240))
        
      //  inputViewObj.backgroundColor = UIColor.gray
        let datePickerView  : UIDatePicker = UIDatePicker(frame:CGRect.init(x: 50, y: 50, width: 0, height: 0))
        datePickerView.datePickerMode = UIDatePickerMode.countDownTimer
        inputViewObj.addSubview(datePickerView) // add date picker to UIView
        
        let doneButton = UIButton(frame: CGRect.init(x: (screenWidth/2) + 70, y: 20, width: 100, height: 50))
        doneButton.setTitle("Done", for: UIControlState.normal)
        doneButton.setTitle("Done", for: UIControlState.highlighted)
        doneButton.setTitleColor(UIColor.black, for: UIControlState.normal)
        doneButton.setTitleColor(UIColor.gray, for: UIControlState.highlighted)
        inputViewObj.addSubview(doneButton) // add Button to UIView
        
        doneButton.addTarget(self, action: #selector(doneButton(_:)), for: UIControlEvents.touchUpInside) // set button click event
        
        textfeild.inputView = inputView
        datePickerView.addTarget(self, action: #selector(handleDatePicker(_:)), for: UIControlEvents.valueChanged)
        self.view.addSubview(inputViewObj)
        handleDatePicker(datePickerView)
        
    }
    func handleDatePicker(_ sender: UIDatePicker) {
        let fireDate = sender.date
        
        datePickerObject = sender
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "HH:mm"
        textFieldSelected.text = dateFormatter.string(from: sender.date)
        
        doneButton(UIButton());
    }
    
    func doneButton(_ sender:UIButton)
    {
        if !self.validateTime() {
            return
        }
        
        var setting = self.arrayData![segmentCount]
        if segmentCount == 0 {
            if textFieldSelected == startTimeText{
              setting.from = textFieldSelected.text
                
                
            }else{setting.to = textFieldSelected.text}
            
        }
        if segmentCount == 1 {
            if textFieldSelected == startTimeText{
            setting.from = textFieldSelected.text
            }else{setting.to = textFieldSelected.text}
        }
        if segmentCount == 2 {
            if textFieldSelected == startTimeText{
            setting.from = textFieldSelected.text
           }else{setting.to = textFieldSelected.text}
        }
        //textFieldSelected.isUserInteractionEnabled = true
       // textFieldSelected.resignFirstResponder()
        //inputViewObj.removeFromSuperview()// To resign the inputView on clicking done.
    }
   
    func validateTime()  -> Bool{
        let formatter = DateFormatter()
        formatter.dateFormat = "HH:mm"
       let firedate =  datePickerObject.date
        let date1 = formatter.date(from: startTimeText.text!)
        let date2 = formatter.date(from: endTimeText.text!)
        if date2! < date1! {
            print("selected date is smaller than ")
            
            utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.dateValidation.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
            return false
        }
        return true
    }
    func datePickerFromValueChanged(sender:UIDatePicker) {
        let dateFormatter = DateFormatter()
        dateFormatter.dateFormat = "HH : mm"
        textFieldSelected.text = dateFormatter.string(from: sender.date)
    }
    func appendTimeString (timeString: String) -> String {
        
        let appendString = timeString  + ":00"
        print(appendString)
        return appendString
    }
    func updateTrackingTimeData(paramDict  : Dictionary<String, AnyObject>)  {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
       print(paramDict)
        
        generalApiobj.hitApiwith(paramDict as! Dictionary<String, AnyObject>, serviceType: .strApiUpdateTrackingSetting, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                let dataDictionary = response["data"] as? [String : AnyObject]
               // self.dataFeeding()
                let description = response["description"] as? String
                utility.createAlert("", alertMessage: description!, alertCancelTitle: "OK", view: self.view);
                self.setUpData(data: dataDictionary!)
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                NSLog(" %@", err)
            }
        }
    }
    
}
extension SettingViewController: UIPickerViewDelegate{
    
}
