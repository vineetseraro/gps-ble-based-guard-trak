//
//  BeaconScanner.swift
//  EmpTrak
//
//  Created by Nitin Singh on 21/11/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit
import RealmSwift
import AKLog
import AKSync
import AKProximity
import AKTrack
import CoreLocation
class BeaconScanner: NSObject {

   
    
    
    func initiateBeaconScanning(beaconUdid : String)
    {
        print(beaconUdid)
        
        var beaconHandler = appDelegate.beaconHandler
        /*new code for location tracking*/
        let locValue:CLLocationCoordinate2D = CLLocationCoordinate2DMake(0.0, 0.0);
        beaconHandler = BeaconHandler.sharedHandler
        beaconHandler?.setBeaconUdid(beaconUdid)
        beaconHandler?.isEnabledKontaktSDK = true
        beaconHandler?.dummy(locValue)
        
        beaconHandler?.initiateRegion(beaconHandler!)
       
        beaconHandler?.initiateResponseBlocks({
            //stop
            AKApplicationState.sharedHandler.setRecordTime("\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))")
            AKApplicationState.sharedHandler.logEvent()
            // AKApplicationState.sharedHandler.setRecordTime("")
            AKApplicationState.sharedHandler.setDeivceid(utility.getDevice()!)
            
        }, authenticationChanged: {
            //auth change
            AKLocationUpdateHandler.sharedHandler.AKScannerstate()
        }, updateBeaconInformation: { (beacon, PKSyncObj, coordinate) in
            //realm update
          
            DispatchQueue(label: "background_update", attributes: []).async(execute: {
                self.updateSyncBeaconData(beacon,primaryKey: PKSyncObj,coordinate: coordinate)
            })
        })
        
    }
    
    
func updateSyncBeaconData(_ beacons: [CLBeacon],primaryKey:String!,coordinate:CLLocationCoordinate2D!){
     let deviceRegistration = DeviceRegistration.sharedHandler
        var count = 0
        let realm = try! Realm()
        var syncObj: AKSyncObject?
        syncObj = realm.object(ofType: AKSyncObject.self, forPrimaryKey: primaryKey! as AnyObject)
        if(syncObj == nil)
        {
            AKApplicationState.sharedHandler.setRole = roleLog
            syncObj = AKSyncObject()
            try! realm.write {
                syncObj!.id = primaryKey!
                syncObj!.synced=false
                
                syncObj!.lat = String(format:"%.6f",coordinate!.latitude )   // "\(coordinate!.latitude)"
                syncObj!.lng = String(format:"%.6f",coordinate!.longitude )  // "\(coordinate!.longitude)"
                syncObj!.alt = AKApplicationState.sharedHandler.getAltitude()
                syncObj!.speed = AKApplicationState.sharedHandler.getSpeed()
                syncObj!.accuracy = AKApplicationState.sharedHandler.getAccuracy()
                syncObj!.direction =  AKApplicationState.sharedHandler.getDirection()
                syncObj!.pkid =  utility.getDevice()! + "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                // If Beacon
               // if (count == 0){
                    let beaconInfo = AKBeaconInfo()
                    count = count + 1
                    beaconInfo.cid = ""
                    beaconInfo.data = ""
                    beaconInfo.lat = String(format:"%.6f",coordinate!.latitude )
                    beaconInfo.long = String(format:"%.6f",coordinate!.longitude )
                    beaconInfo.timestamp = "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                    beaconInfo.uuid =  deviceRegistration.deviceUUID
                    beaconInfo.major =  deviceRegistration.deviceMajor
                    beaconInfo.minor = deviceRegistration.deviceMinor
                    beaconInfo.distance = "0.0"
                    beaconInfo.rssi = "11"
                    beaconInfo.synced = false
                    beaconInfo.proximity = "0.0"
                    beaconInfo.id = "\("1")\(deviceRegistration.deviceMinor)\(syncObj!.id)"
                    let sampleBeacon = realm.create(AKBeaconInfo.self, value: beaconInfo, update: true)
                    syncObj!.event.append(sampleBeacon)
                    realm.add(syncObj!, update: true)
           //     }
                
                for becn in beacons {
                    let state = AKSensorStateModel()
                    state.major = "\(becn.major)"
                    state.minor = "\(becn.minor)"
                    state.proximity = "\(becn.proximity.rawValue)"
                    state.longitude = String(format:"%.6f",coordinate!.longitude )
                    state.lattitude = String(format:"%.6f",coordinate!.latitude )
                    state.UDIDBeacon = becn.proximityUUID.uuidString
                     AKApplicationState.sharedHandler.setRole = roleLog
                    AKApplicationState.sharedHandler.setSensorData(state)
                    
                    
                    let beaconInfo = AKBeaconInfo()
                    beaconInfo.cid = ""
                    beaconInfo.data = ""
                    beaconInfo.lat = String(format:"%.6f",coordinate!.latitude )
                    beaconInfo.long = String(format:"%.6f",coordinate!.longitude ) 
                    beaconInfo.timestamp = "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                    beaconInfo.uuid =  becn.proximityUUID.uuidString
                    beaconInfo.major = "\(becn.major)"
                    beaconInfo.minor = "\(becn.minor)"
                    beaconInfo.distance = "\(becn.accuracy)"
                    beaconInfo.rssi = "\(becn.rssi)"
                    beaconInfo.synced = false
                    beaconInfo.proximity = "\(becn.proximity.rawValue)"
                    beaconInfo.id = "\(becn.major)\(becn.minor)\(syncObj!.id)"
        
                    AKApplicationState.sharedHandler.logEvent()
                    let beaconData = realm.create(AKBeaconInfo.self, value: beaconInfo, update: true)
                   syncObj!.event.append(beaconData)
                    realm.add(syncObj!, update: true)
                }
            }
           AKApplicationState.sharedHandler.logEvent()
        }
        else{
            AKApplicationState.sharedHandler.setRole = roleLog
            try! realm.write {
                syncObj!.lat = String(format:"%.6f",coordinate!.latitude )//"\(coordinate!.latitude)"
                syncObj!.lng = String(format:"%.6f",coordinate!.longitude )// "\(coordinate!.longitude)"
                syncObj!.alt = AKApplicationState.sharedHandler.getAltitude()
                syncObj!.speed = AKApplicationState.sharedHandler.getSpeed()
                syncObj!.accuracy = AKApplicationState.sharedHandler.getAccuracy()
                syncObj!.direction =  AKApplicationState.sharedHandler.getDirection()
                syncObj!.pkid =  utility.getDevice()! + "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                

                for becn in beacons {
                    let state = AKSensorStateModel()
                    state.major = "\(becn.major)"
                    state.minor = "\(becn.minor)"
                    state.proximity = "\(becn.proximity.rawValue)"
                    state.longitude = String(format:"%.6f",coordinate!.longitude )
                    state.lattitude = String(format:"%.6f",coordinate!.latitude )
                    state.UDIDBeacon = becn.proximityUUID.uuidString
                    AKApplicationState.sharedHandler.setSensorData(state)
                    
                    let beaconInfo = AKBeaconInfo()
                    beaconInfo.cid = ""
                    beaconInfo.data = ""
                    beaconInfo.lat = String(format:"%.6f",coordinate!.latitude )// "\(coordinate!.latitude)"
                    beaconInfo.long = String(format:"%.6f",coordinate!.longitude )// "\(coordinate!.longitude)"
                    beaconInfo.timestamp = "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                    beaconInfo.uuid =  becn.proximityUUID.uuidString
                    beaconInfo.major = "\(becn.major)"
                    beaconInfo.minor = "\(becn.minor)"
                    beaconInfo.synced = false
                    beaconInfo.distance = "\(becn.accuracy)"
                    beaconInfo.rssi = "\(becn.rssi)"
                    beaconInfo.proximity = "\(becn.proximity.rawValue)"
                    beaconInfo.id = "\(becn.major)\(becn.minor)\(syncObj!.id)"
                    
                    
                    if let sampleBeacon = syncObj!.event.filter("id = '\(becn.major)\(becn.minor)\(syncObj!.id)'").first{//realm.create(OSSBeaconInfo.self, value: beaconInfo, update: true)
                        sampleBeacon.lat = String(format:"%.6f",coordinate!.latitude )//"\(coordinate!.latitude)"
                        sampleBeacon.long = String(format:"%.6f",coordinate!.longitude )//"\(coordinate!.longitude)"
                        sampleBeacon.timestamp = "\(Int64(floor(NSDate().timeIntervalSince1970 * 1000.0)))"
                        //syncObj!.event.append(sampleBeacon)
                    }
                    else{
                        let sampleBeacon=realm.create(AKBeaconInfo.self, value: beaconInfo, update: true)
                        syncObj!.event.append(sampleBeacon)
                    }
                    realm.add(syncObj!, update: true)
                }
            }
            
            AKApplicationState.sharedHandler.logEvent()
        }
    
    
    }

    
}
