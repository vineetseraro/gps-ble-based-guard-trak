//
//  OneTimeLocation.swift
//  GuardTrak
//
//  Created by niteshgoel on 1/9/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import UIKit
import CoreLocation
class OneTimeLocation: NSObject {
 let locationManager = CLLocationManager()
 var block:(CLLocationDegrees,CLLocationDegrees)->()
    init(block:@escaping (CLLocationDegrees,CLLocationDegrees)->())  {
        self.block = block
        super.init()
        self.locationManager.desiredAccuracy = kCLLocationAccuracyBestForNavigation
        self.locationManager.distanceFilter = kCLDistanceFilterNone
        self.locationManager.requestAlwaysAuthorization()
        self.locationManager.delegate = self
        self.locationManager.requestLocation()
    }
}
extension OneTimeLocation: CLLocationManagerDelegate{
    func locationManager(_ manager: CLLocationManager, didUpdateLocations locations: [CLLocation]) {
        if (manager.location != nil) {
        self.block((manager.location?.coordinate.latitude)!,(manager.location?.coordinate.longitude)!)
        }
    }
    func locationManager(_ manager: CLLocationManager, didFailWithError error: Error) {
        
    }
}
