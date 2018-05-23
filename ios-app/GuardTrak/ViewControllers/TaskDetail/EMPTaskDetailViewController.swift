//
//  EMPTaskDetailViewController.swift
//  EmpTrak
//
//  Created by Amarendra on 11/27/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit
import Cloudinary
import JWTDecode

class EMPTaskDetailViewController: UIViewController,UITextViewDelegate,UIImagePickerControllerDelegate, UINavigationControllerDelegate,UIActionSheetDelegate  {
    @IBOutlet weak var lblName: UILabel!
    
    @IBOutlet weak var lblDescription: UILabel!
    @IBOutlet weak var lblToDate: UILabel!
    
    @IBOutlet weak var lblLocation: UILabel!
    
    @IBOutlet weak var lblDateTime: UILabel!
    @IBOutlet var vwSave: UIView!

    @IBOutlet var fileSlider: CSFileSlideView!
    @IBOutlet var tvComment: UITextView!
    @IBOutlet var botmLayout: NSLayoutConstraint!
    @IBOutlet var lblPlaceHolder: UILabel!
    var config:CLDConfiguration!
    var cloudinary: CLDCloudinary!
    var arrayOfUplodedimageURL:[Dictionary<String,String>]!
    var imagePicker = UIImagePickerController()
    var dataPath: String?
    var selectedImage : UIImage?
    var taskId:String = ""
    var timezone = ""
    override func viewDidLoad() {
        super.viewDidLoad()
        config = CLDConfiguration(cloudName:cloudinaryCloud)
        cloudinary = CLDCloudinary(configuration: config)
        arrayOfUplodedimageURL = [Dictionary<String,String>]();
        imagePicker.delegate = self
        imagePicker.allowsEditing = false
        imagePicker.sourceType = .photoLibrary
        self.createDirectory()
        self.addKeyboardNotifications()
       getTimeZone()
        getHomeData()
        setUpFileSlider()
        setUpFont()
        self.title = "Activity Details"
        self.navigationController?.navigationBar.isHidden = false
        customizeNavigationforAll(self)
       
        
        // Do any additional setup after loading the view.
    }
    func backToDashbaord(_ back:UIButton){
        self.deleteDirectory()
        self.navigationController?.popViewController(animated: true)
    }
    func setUpFileSlider(){
        if let resourcePath = Bundle.main.resourcePath {
            let imgName = "btnAddMedia.png"
            let path = resourcePath + "/" + imgName
            self.fileSlider.addAssetURL(path)
        }
        self.fileSlider.cellSelect = { indexPath in
            if(indexPath?.row == 0)
            {
                self.view.endEditing(true)
                self.perform(#selector(EMPTaskDetailViewController.openCam), with: nil, afterDelay: 0.1);
            }
        }
     self.fileSlider.shocut = true
        self.fileSlider.fileDelete = {IndexPath in
            self.arrayOfUplodedimageURL.remove(at: (IndexPath?.row)! - 1)
        }
    }
    func setUpFont(){
        self.vwSave.layer.cornerRadius = 5.0
        self.tvComment.font = UIFont(name: "SourceSansPro-Regular", size: 14.0)
        self.lblPlaceHolder.font = UIFont(name: "SourceSansPro-Regular", size: 14.0)
    }

    func addKeyboardNotifications() {
        NotificationCenter.default.addObserver(self, selector: #selector(EMPTaskDetailViewController.keyboardWillShow(_:)), name:NSNotification.Name.UIKeyboardWillShow, object: nil)
        NotificationCenter.default.addObserver(self, selector: #selector(EMPTaskDetailViewController.keyboardWillHide(_:)), name:NSNotification.Name.UIKeyboardWillHide, object: nil)
        
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func btnCam(_ sender: AnyObject) {
        self.view.endEditing(true)
        self.perform(#selector(EMPTaskDetailViewController.openCam), with: nil, afterDelay: 0.1);
    }
    func openCam(){
        let actionSheetTitle = "Images";
        let imageClicked = "Take Picture";
        let ImageGallery = "Choose Photo";
        let  cancelTitle = "Cancel";
        let actionSheet = UIActionSheet(title: actionSheetTitle, delegate: self, cancelButtonTitle: cancelTitle, destructiveButtonTitle: nil, otherButtonTitles:imageClicked , ImageGallery)
        actionSheet.show(in: self.view)
        
    }
    func textViewShouldBeginEditing(_ textView: UITextView) -> Bool {
        textView.inputAccessoryView = self.toolBar()
        lblPlaceHolder.isHidden = true
        return true
    }

    func keyboardWillShow(_ notification: Notification) {
        var info = notification.userInfo!
        let keyboardFrame: CGRect = (info[UIKeyboardFrameEndUserInfoKey] as! NSValue).cgRectValue
        
        UIView.animate(withDuration: 1.0, animations: { () -> Void in
            self.botmLayout.constant = keyboardFrame.size.height
                self.view.layoutIfNeeded()

        }, completion: { (completed: Bool) -> Void in
            
        })
    }
    
    func keyboardWillHide(_ notification: Notification) {
        UIView.animate(withDuration: 1.0, animations: { () -> Void in
            self.botmLayout.constant = 0.0
             self.view.layoutIfNeeded()
        }, completion: { (completed: Bool) -> Void in
            
        })
        if(tvComment.text == "")
        {
            self.lblPlaceHolder.isHidden = false
        }
        
    }
    func createDirectory() {
        let paths = NSSearchPathForDirectoriesInDomains(FileManager.SearchPathDirectory.documentDirectory, FileManager.SearchPathDomainMask.userDomainMask, true)
        
        let documentsDirectory = paths.first
        dataPath = (documentsDirectory)! + "/ISSUE"
        if (!FileManager.default.fileExists(atPath: dataPath!))
        {
            try! FileManager.default.createDirectory(atPath: dataPath!, withIntermediateDirectories: false, attributes: nil)
        }
    }
    func deleteDirectory(){
        try! FileManager.default.removeItem(atPath: dataPath!)
    }
    func actionSheet(_ actionSheet: UIActionSheet, clickedButtonAt buttonIndex: Int) {
        if(buttonIndex == 1)
        {
            imagePicker.sourceType = .camera
            self.perform(#selector(presentv), with: nil, afterDelay: 0)
        }
        else if(buttonIndex == 2)
        {
            imagePicker.sourceType = .photoLibrary
            self.perform(#selector(presentv), with: nil, afterDelay: 0)
        }
    }
    
    func presentv(){
        self.present(imagePicker, animated: true, completion: nil)
    }
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingImage image: UIImage!, editingInfo: [AnyHashable: Any]!) {
        
    }
    func imagePickerControllerDidCancel(_ picker: UIImagePickerController) {
        picker.dismiss(animated: true, completion: { () -> Void in
            
        })
    }
    func imagePickerController(_ picker: UIImagePickerController, didFinishPickingMediaWithInfo info: [String : Any]) {
        DispatchQueue(label: "directory_write", attributes: []).async(execute: {
            self.selectedImage = info[UIImagePickerControllerOriginalImage] as? UIImage
            
            self.selectedImage = self.selectedImage?.resizeWithV(120)
            self.selectedImage = self.rotateImage(self.selectedImage!)
            let webData = UIImagePNGRepresentation(self.selectedImage!);
            let  timeStamp = Date().timeIntervalSince1970 * 1000.0
            let time = "\(timeStamp)".replacingOccurrences(of: ".", with: "")
            var fileName = ""
            fileName = fileName + "PIC_\(time).png"
            let localFilePath = (self.dataPath)! + "/\(fileName)"
            try? webData?.write(to: URL(fileURLWithPath: localFilePath), options: [.atomic])
            DispatchQueue.main.async(execute: {
                self.fileSlider.addAssetURL(localFilePath)
            });
        });
        picker.dismiss(animated: true, completion: nil)
    }
    func rotateImage(_ image: UIImage) -> UIImage {
        
        if (image.imageOrientation == UIImageOrientation.up ) {
            return image
        }
        
        UIGraphicsBeginImageContext(image.size)
        
        image.draw(in: CGRect(origin: CGPoint.zero, size: image.size))
        let copy = UIGraphicsGetImageFromCurrentImageContext()
        
        UIGraphicsEndImageContext()
        
        return copy!
    }

    func toolBar()-> UIToolbar {
        let numberToolbar = UIToolbar(frame: CGRect(x: 0, y: 0, width: self.view.frame.size.width, height: 50))
        numberToolbar.barStyle = UIBarStyle.default
        numberToolbar.items = [
            UIBarButtonItem(barButtonSystemItem: UIBarButtonSystemItem.flexibleSpace, target: nil, action: nil),
            UIBarButtonItem(title: "Done", style: UIBarButtonItemStyle.plain, target: self, action: #selector(EMPTaskDetailViewController.done))]
        numberToolbar.sizeToFit()
        return numberToolbar
    }
    func done(){
        self.tvComment?.resignFirstResponder()
    }
    func getHomeData()->(){
        var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        generalApiobj.hitApiwith(["id":self.taskId as AnyObject], serviceType: .strGetTaskDetails, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                if(response["code"] as! NSInteger !=  200)
                {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    loadingNotification = nil
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                guard let data = response["data"] as? [String:AnyObject]else{
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
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
        self.lblName.text =  data["name"] as? String
        self.lblDescription.text = data["description"] as? String
        self.tvComment.text =  data["notes"] as? String
        for dict in data["images"] as! [Dictionary<String,AnyObject>]{
            let obj = ["url":(dict["url"] as! String),"meta":""]
            self.arrayOfUplodedimageURL.append(obj);
        }
        for dict in self.arrayOfUplodedimageURL{
            self.fileSlider.addAssetURL(dict["url"])
        }
        if(tvComment.text != "")
        {
            self.lblPlaceHolder.isHidden = true
        }
        
        if let location = data["location"]{
            if let floor = location["floor"] as? [String:AnyObject] {
                if let zone = floor["zone"] as? [String:AnyObject] {
                    if let zname = zone["name"] as? String{
                     
                        self.lblLocation.text = self.lblLocation.text! + zname + ","
                    }
                    if let fname = floor["name"] as? String{
                        
                        self.lblLocation.text = self.lblLocation.text!+fname + ","
                    }
                    if let lname = location["name"] as? String{
                        
                        self.lblLocation.text = self.lblLocation.text!+lname
                    }
                }
            }
        }
        let to  =  data["to"] as? String
        self.lblToDate.text =  dateString(date:to!)
        let from  =  data["from"] as? String
        self.lblDateTime.text =  dateString(date:from!)
    }
    func dateString(date:String) ->String{
        let dateFormatter1 = DateFormatter()
        dateFormatter1.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        let dt = dateFormatter1.date(from: date)
        let timezone = TimeZone.init(identifier: self.timezone)
        let dateFormatter2 = DateFormatter()
        dateFormatter2.dateFormat = "yyy-MM-dd HH:mm a"
        dateFormatter2.timeZone = timezone
        let strDate =  dateFormatter2.string(from: dt!)
        return strDate
    }
    @IBAction func btnSend(_ sender: AnyObject) {
        if validate(){
           self.uploadIssueCloudinary()
        }
    }
    func validate()->Bool{
        return true
    }
    func uploadIssueCloudinary(){
        var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        imageUploadToCloudinary(dataPath: dataPath!, successBlock:{
            let params = ["id":self.taskId,"notes":self.tvComment.text,"images": self.arrayOfUplodedimageURL] as [String : Any]
            let generalApiobj = GeneralAPI()
            generalApiobj.hitApiwith(params as Dictionary<String, AnyObject>, serviceType: .strPostNotes, success: { (response) in
                DispatchQueue.main.async {
                    print(response)
                    if(response["status"]?.intValue != 1)
                    {
                        MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                        loadingNotification = nil
                        utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                        return
                    }
                    else {
                        self.deleteDirectory()
                        self.navigationController?.popViewController(animated: true)
                    }
                }
                
            }) { (err) in
                DispatchQueue.main.async {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                }
            }
        }) {
            
            MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            loadingNotification = nil
            utility.createAlert(TextMessage.alert.rawValue, alertMessage: "Image upload error", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
        }
    }
    
    func sync(lock: [Dictionary<String,String>], closure: () -> Void) {
        objc_sync_enter(lock)
        closure()
        objc_sync_exit(lock)
    }
    
    func imageUploadToCloudinary(dataPath:String,successBlock:@escaping (()->()),errorBlock:@escaping (()->())){
        let arrayOfFiles = try! FileManager.default.contentsOfDirectory(atPath: dataPath);
        let uploader = cloudinary.createUploader()
        
        for filename in arrayOfFiles
        {
            let path =  NSURL(fileURLWithPath: dataPath).appendingPathComponent(filename)
            uploader.upload(url: path!, uploadPreset: cloudinaryPreset){ result , error in
                if((result) != nil && error == nil)
                {
                    self.sync (lock: self.arrayOfUplodedimageURL) {
                        let obj = ["url":(result?.resultJson["url"])! as! String,"meta":""];
                        self.arrayOfUplodedimageURL.append(obj);
                        if(self.arrayOfUplodedimageURL.count >= arrayOfFiles.count)
                        {
                            successBlock();
                        }
                    }
                }
                else
                {
                    errorBlock()
                }
            }
        }
        if(arrayOfFiles.count == 0)
        {
            successBlock();
        }
    }
    func getTimeZone(){
        do{
            let jwt = try decode(jwt: utility.getIdToken())
            
            let dict:[String:AnyObject] = jwt.body as [String : AnyObject]
            print (dict["zoneinfo"])
            if let zone = dict["zoneinfo"] as? String{
                self.timezone = zone
            }
        }
        catch{
            
        }
        
    }
}
