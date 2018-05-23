//
//  QRScannerViewController.swift
//  GuardTrak
//
//  Created by Amarendra on 1/3/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import UIKit
protocol QRScannerViewControllerDelegate {
    func didScanTag()
}
class QRScannerViewController: UIViewController{
    let codeReader = QRCodeReader(metadataObjectTypes: [AVMetadataObjectTypeQRCode])
    var lat:Double?
    var long: Double?
    var location : OneTimeLocation?
    var tourId:String!
    var name:String!
    var delegate:QRScannerViewControllerDelegate?
    @IBOutlet weak var txtCode: UITextField!
    
    @IBAction func btnSubmit(_ sender: Any) {
        submit()
    }
    @IBAction func scanNFC(_ sender: Any) {
        
        if #available(iOS 11.0, *) {
            let VW = NFCViewController(nibName: "NFCViewController", bundle: nil)
            VW.delegate=self
            self.navigationController?.pushViewController(VW, animated: true)
        } else {
            utility.createAlert("", alertMessage: "Device does not support NFC", alertCancelTitle: "OK", view: self.view)
        }
        
        
    }

    override func viewDidLoad() {
        super.viewDidLoad()
        //self.title = TitleName.TagScan.rawValue
      
        customizeNavigationforAll(self)
        self.navigationController?.navigationBar.isHidden = false
        self.navigationController?.navigationBar.isTranslucent = false
        location = OneTimeLocation(block: { (lat, long) in
           self.lat = lat
           self.long = long
        })
        setUpScanner()
        // Do any additional setup after loading the view.
    }
    func backToDashbaord(_ sender: AnyObject) {
        self.dismiss(animated: true, completion: nil)
    }
    func setUpScanner(){
        self.codeReader.previewLayer.frame = CGRect(x: 0, y: 0, width:self.view.frame.size.width , height: self.view.frame.size.height)
        if (self.codeReader.previewLayer.connection.isVideoOrientationSupported){
            let orientation = UIApplication.shared.statusBarOrientation
            codeReader.previewLayer.connection.videoOrientation = QRCodeReader.videoOrientation(from: orientation)
        }
        self.view.layer.insertSublayer(codeReader.previewLayer, at: 0)
       
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    override func viewWillLayoutSubviews() {
        super .viewWillLayoutSubviews()
        codeReader.previewLayer.frame = self.view.bounds
    }

    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(true)
         self.codeReader.startScanning()
        self.codeReader.setCompletionWith { (data) in
            if (data != nil){
            self.txtCode.text = data
            }
        }
    }
    override func viewDidAppear(_ animated: Bool) {
        let vw = STRNavigationTitle.setTitle(TitleName.TagScan.rawValue, subheading:"\(self.name!)")
        vw.translatesAutoresizingMaskIntoConstraints = false
        vw.frame = CGRect(x: 0, y: -(self.navigationController?.navigationBar.frame.origin.y)!, width: (self.navigationController?.navigationBar.frame.size.width)!, height: (self.navigationController?.navigationBar.frame.size.height)!)
        self.navigationItem.titleView = vw
    }
    override func viewDidDisappear(_ animated: Bool) {
        self.codeReader.stopScanning()
    }
    func validate()->Bool{
        if txtCode.text?.count == 0{
            utility.showAlertSheet("Error", message: "Please input code", viewController: self)
            return false
        }
        return true
    }
    func formData()->Dictionary<String,AnyObject>{
        let generateToken = utility.getIdToken() + "::" + utility.getAccessToken()

        let ts = Int64(floor(NSDate().timeIntervalSince1970 * 1000.0))
        var dict = [String:AnyObject]()
        dict["acc"] = 0 as AnyObject
        dict["alt"] = 0 as AnyObject
        dict["clientid"] = "" as AnyObject // aws account id
        dict["did"] = utility.getDevice() as AnyObject
        dict["dir"] = 0 as AnyObject
        dict["ht"] = 0 as AnyObject
        dict["lat"] = lat as AnyObject
        dict["lon"] = long as AnyObject
        dict["pkid"] = (utility.getDevice()! + "\(ts)") as AnyObject
        dict["projectid"] = projectIdConst as AnyObject
        dict["prv"] = "ios_locationmanager" as AnyObject
        dict["sensors"] = [["type":"nfcTag",
                           "uid":"\(self.txtCode.text ?? "")"] ] as AnyObject
        dict["spd"] = 0 as AnyObject
        dict["ts"] = ts as AnyObject
        dict["additionalInfo"] = ["tourId":self.tourId,
                                  "sessionToken":generateToken] as AnyObject
        return dict
    }
    func submit(){
        if validate(){
            let dict = formData()
            var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
            loadingNotification?.mode = MBProgressHUDMode.indeterminate
            loadingNotification?.labelText = "Loading"
            let generalApiobj = GeneralAPI()
            generalApiobj.hitApiwith(dict, serviceType: .strPostScan, success: { (response) in
                DispatchQueue.main.async {
                    print(response)
                    if(response["code"] as! Int !=  200)
                    {
                        MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                        loadingNotification = nil
                        utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                        return
                    }
                    guard let _ = response["data"] as? [String:AnyObject]else{
                        MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                        utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                        return
                    }
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    self.delegate?.didScanTag()
                    self.dismiss(animated: true, completion: nil)
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
}
extension QRScannerViewController:UITextFieldDelegate{
    func textFieldShouldReturn(_ textField: UITextField) -> Bool {
        textField.resignFirstResponder()
        return true
    }
}
extension QRScannerViewController:NFCViewControllerDelegate{
    func scannedNFC(tag: String) {
        self.txtCode.text = tag
    }
}
