//
//  LocalNotification.swift
//  STRCourier
//
//  Created by Nitin Singh on 31/08/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit
import UserNotifications

class LocalNotification: NSObject, UNUserNotificationCenterDelegate {
    
    class func registerForLocalNotification(on application:UIApplication) {
        if (UIApplication.instancesRespond(to: #selector(UIApplication.registerUserNotificationSettings(_:)))) {
            let notificationCategory:UIMutableUserNotificationCategory = UIMutableUserNotificationCategory()
            notificationCategory.identifier = "NOTIFICATION_CATEGORY"
            
            //registerting for the notification.
            application.registerUserNotificationSettings(UIUserNotificationSettings(types:[.sound, .alert, .badge], categories: nil))
        }
    }
    
    class func dispatchlocalNotification(with title: String, body: String, userInfo: [AnyHashable: Any]? = nil, at date:Date) {
        
        if #available(iOS 10.0, *) {
            
            let center = UNUserNotificationCenter.current()
            let content = UNMutableNotificationContent()
            content.title = title
            content.body = body
            content.categoryIdentifier = "Fechou"
            
            if let info = userInfo {
                content.userInfo = info
            }
            
            content.sound = UNNotificationSound.default()//UNNotificationSound.init(named: "notif.mp3")
 //UNNotificationSound.default()
            
            let comp = Calendar.current.dateComponents([.hour, .minute], from: date)
            
            let trigger = UNCalendarNotificationTrigger(dateMatching: comp, repeats: true)
            
            let request = UNNotificationRequest(identifier: UUID().uuidString, content: content, trigger: trigger)
            
            center.add(request)
            
        } else {
            
            let notification = UILocalNotification()
            notification.fireDate = date
            notification.alertTitle = title
            notification.alertBody = body
            
            if let info = userInfo {
                notification.userInfo = info
            }
            
            notification.soundName  =  "notif.mp3" //UILocalNotificationDefaultSoundName
            UIApplication.shared.scheduleLocalNotification(notification)
            
        }
        
        print("WILL DISPATCH LOCAL NOTIFICATION AT ", date)
        
    }
    class func  register(){
           if #available(iOS 10.0, *) {
    UNUserNotificationCenter.current().requestAuthorization(options: [.alert, .sound]) {(accepted, error) in
    if !accepted {
    print("Notification access denied.")
    }
    }
    
    let action = UNNotificationAction(identifier: "remindLater", title: "Remind me later", options: [])
    let category = UNNotificationCategory(identifier: "myCategory", actions: [action], intentIdentifiers: [], options: [])
    UNUserNotificationCenter.current().setNotificationCategories([category])
           }else{
        }
    }
    class func scheduleNotification(at date: Date) {
           if #available(iOS 10.0, *) {
        let calendar = Calendar(identifier: .gregorian)
        let components = calendar.dateComponents(in: .current, from: date)
        let newComponents = DateComponents(calendar: calendar, timeZone: .current, month: components.month, day: components.day, hour: components.hour, minute: components.minute)
        
        let trigger = UNCalendarNotificationTrigger(dateMatching: newComponents, repeats: false)
        
        let content = UNMutableNotificationContent()
        content.title = "Tour Reminder"
        content.body = "Beacon recorded"
        content.sound = UNNotificationSound.default()
        content.categoryIdentifier = "myCategory"
        
        if let path = Bundle.main.path(forResource: "logo", ofType: "png") {
            let url = URL(fileURLWithPath: path)
            
            do {
                let attachment = try UNNotificationAttachment(identifier: "logo", url: url, options: nil)
                content.attachments = [attachment]
            } catch {
                print("The attachment was not loaded.")
            }
        }
        
        let request = UNNotificationRequest(identifier: "textNotification", content: content, trigger: trigger)
        
            UNUserNotificationCenter.current().delegate = UIApplication.shared.delegate as! UNUserNotificationCenterDelegate
        UNUserNotificationCenter.current().removeAllPendingNotificationRequests()
        UNUserNotificationCenter.current().add(request) {(error) in
            if let error = error {
                print("Uh oh! We had an error: \(error)")
            }
        }
    }
           else{
        }
}
}
