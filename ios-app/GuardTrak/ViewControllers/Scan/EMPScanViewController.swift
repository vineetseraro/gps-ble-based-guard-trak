//
//  EMPScanViewController.swift
//  EmpTrak
//
//  Created by Amarendra on 12/27/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit

class EMPScanViewController: UIViewController {
    var vc : QRCodeReaderViewController?
    @IBAction func nfcScan(_ sender: Any) {
    }
    @IBAction func beaconScan(_ sender: Any) {
    }
    @IBAction func qrCodeScan(_ sender: Any) {
     let vw = QRScannerViewController.init(nibName: "QRScannerViewController", bundle: nil)
        self.navigationController?.pushViewController(vw, animated: false)
    }
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.ScanView.rawValue
        customizeNavigationforAll(self)
        self.navigationController?.navigationBar.isTranslucent = false
        let reader = QRCodeReader(metadataObjectTypes: [AVMetadataObjectTypeQRCode])
        vc = QRCodeReaderViewController(cancelButtonTitle: "Cancel", codeReader: reader, startScanningAtLoad: true, showSwitchCameraButton: true, showTorchButton: true)
        vc?.modalPresentationStyle = .formSheet
        vc?.delegate = self
       
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    
    func backToDashbaord(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
 
}
extension EMPScanViewController:QRCodeReaderDelegate{
    func reader(_ reader: QRCodeReaderViewController!, didScanResult result: String!) {
        self.dismiss(animated: true) {
            print(result)
        }
    }
    func readerDidCancel(_ reader: QRCodeReaderViewController!) {
        self.dismiss(animated: true) {
            
        }
    }
}

