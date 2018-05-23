//
//  DeviceRegistration.swift
//  EmpTrak
//
//  Created by Nitin Singh on 21/11/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit
import AKLog
import AKSync
import AKProximity
import AKTrack

class DeviceRegistration: NSObject {
    var  newUdid :String?
    var deviceMajor : String! = ""
    var deviceMinor : String! = ""
    var deviceUUID : String! = ""
    
    
    open static let sharedHandler:DeviceRegistration = DeviceRegistration()
    
    
    func registerDevice() {
        
        let generalApiobj = GeneralAPI()
        let systemVersion = UIDevice.current.name
        print("iOS\(systemVersion)")
        
        let model = UIDevice.current.model
        print("device type=\(model)")
        
        let Version = UIDevice.current.systemVersion
        print("device type=\(Version)")
        
        let systemName = UIDevice.current.systemName
        print("systemName =\(systemName)")
        
        let identifierForVendor = UIDevice.current.identifierForVendor
        print("device type=\(identifierForVendor)")
        let uuid = identifierForVendor!.uuidString
        print(uuid)
        let str :String = "Apple" + " " + Version
        let locationStatus = NSInteger(AKApplicationState.sharedHandler.getGPSAvailable())
        
        
        let clientDic : [String :String] = ["clientId" : clientIdConst, "projectId" : projectIdConst]
        let paramDict:[String:Any] = ["deviceId":uuid, "name": systemVersion,"status" : 1,  "manufacturer":str, "model": model, "os":"ios", "version":Version,"appName" : "guardtrak", "appVersion" : utility.getAppVersion(),"channelId" : utility.getChannelId(), "locationStatus": locationStatus,"bluetoothStatus": utility.getBlueToothState(), "client" : clientDic]
        
        generalApiobj.hitApiwith(paramDict as Dictionary<String, AnyObject>, serviceType: .strDeviceInformation, success: { (response) in
            DispatchQueue.main.async {
                
                print(response)
                
                let dataDictionary = response["data"] as? [String : AnyObject]
                
                self.newUdid  =  dataDictionary?["code"] as? String
                self.deviceMajor = String(describing: dataDictionary?["major"] as! NSInteger)
                self.deviceMinor = String(describing: dataDictionary?["minor"] as! NSInteger)
                self.deviceUUID = (dataDictionary?["uuid"])?.uppercased as! String
                print(self.deviceUUID)
                utility.setDevice(self.newUdid!)
                AKApplicationState.sharedHandler.setDeivceid(utility.getDevice()!)
                let beaconScanner = BeaconScanner()
                NotificationCenter.default.post(name: NSNotification.Name(rawValue: "CODE_UPDATE"), object: nil)
                beaconScanner.initiateBeaconScanning(beaconUdid: self.deviceUUID!)
                appDelegate.locationTracker?.beaconUUDI = self.deviceUUID
                appDelegate.locationTracker?.initiateBeaconRegion(major:0,minor:0,uuid:self.deviceUUID)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                
                NSLog(" %@", err)
            }
        }
    }
}
