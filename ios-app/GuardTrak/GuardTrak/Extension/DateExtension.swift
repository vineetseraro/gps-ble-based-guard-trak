//
//  DateExtension.swift
//  STRCourier
//
//  Created by Nitin Singh on 03/11/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import Foundation


//-------------------------------------------------------------
//NSDate extensions.
extension NSDate
{
    /**
     This adds a new method dateAt to NSDate.
     
     It returns a new date at the specified hours and minutes of the receiver
     
     :param: hours: The hours value
     :param: minutes: The new minutes
     
     :returns: a new NSDate with the same year/month/day as the receiver, but with the specified hours/minutes values
     */
    
    func substringTime (timeString: String) -> Int {
        
        let start = timeString.startIndex
        let end = timeString.index(timeString.endIndex, offsetBy: -3)
        let substring = timeString[start..<end]
        print(substring)
        let time = Int(substring)!
        return time
    }
    
    func substringMinutes (timeString: String) -> Int {
        
        let start = timeString.index(timeString.startIndex, offsetBy: 3)
        
        let end = timeString.endIndex
        let substring = timeString[start..<end]
        print(substring)
        let time = Int(substring)!
        return time
    }
    
    func dateAt(time : String) -> NSDate
    {
        let hours : Int = substringTime(timeString: time)
        var minutes : Int = substringMinutes(timeString: time)
        let calendar = NSCalendar(calendarIdentifier: NSCalendar.Identifier.gregorian)!
        
        //get the month/day/year componentsfor today's date.
        
        print("Now = \(self)")
        
        var date_components = calendar.components(
            NSCalendar.Unit(rawValue: NSCalendar.Unit.RawValue(UInt8(NSCalendar.Unit.year.rawValue) |
                UInt8(NSCalendar.Unit.month.rawValue) |
                UInt8(NSCalendar.Unit.day.rawValue))),
            from: self as Date)
        
        //Create an NSDate for 8:00 AM today.
        date_components.hour = hours
        date_components.minute = minutes
        date_components.second = 0
        
        let newDate = calendar.date(from: date_components)!
        return newDate as NSDate
    }
}
//-------------------------------------------------------------
//Tell the system that NSDates can be compared with ==, >, >=, <, and <= operators
extension NSDate: Equatable {}
extension NSDate: Comparable {}

//-------------------------------------------------------------
//Define the global operators for the
//Equatable and Comparable protocols for comparing NSDates

public func ==(lhs: NSDate, rhs: NSDate) -> Bool
{
    return lhs.timeIntervalSince1970 == rhs.timeIntervalSince1970
}

public func <(lhs: NSDate, rhs: NSDate) -> Bool
{
    return lhs.timeIntervalSince1970 < rhs.timeIntervalSince1970
}
public func >(lhs: NSDate, rhs: NSDate) -> Bool
{
    return lhs.timeIntervalSince1970 > rhs.timeIntervalSince1970
}
public func <=(lhs: NSDate, rhs: NSDate) -> Bool
{
    return lhs.timeIntervalSince1970 <= rhs.timeIntervalSince1970
}
public func >=(lhs: NSDate, rhs: NSDate) -> Bool
{
    return lhs.timeIntervalSince1970 >= rhs.timeIntervalSince1970
}
//-------------------------------------------------------------


