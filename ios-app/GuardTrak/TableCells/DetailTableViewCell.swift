//
//  DetailTableViewCell.swift
//  EmpTrak
//
//  Created by Nitin Singh on 27/11/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit

class DetailTableViewCell: UITableViewCell {

    @IBOutlet weak var nameLabel: UILabel!
    
    @IBOutlet weak var lblID: UILabel!
    
    @IBOutlet weak var lblTo: UILabel!
    
    @IBOutlet weak var lblFrom: UILabel!
    @IBOutlet weak var lblDuration: UILabel!
    var timezone = ""
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        setupFont()
    }
    func setupFont(){
        nameLabel.font = UIFont(name: "SourceSansPro-Semibold", size: 18.0);
        lblID.font =  UIFont(name: "SourceSansPro-Regular", size: 12.0);
        lblTo.font =  UIFont(name: "SourceSansPro-Regular", size: 12.0);
        lblFrom.font =  UIFont(name: "SourceSansPro-Regular", size: 12.0);
        lblDuration.font =  UIFont(name: "SourceSansPro-Regular", size: 12.0);
        
    }
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    func dateString(date:String) ->String{
        let dateFormatter1 = DateFormatter()
        dateFormatter1.dateFormat = "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
        let dt = dateFormatter1.date(from: date)
        let timezone = TimeZone.init(identifier: self.timezone)
        let dateFormatter2 = DateFormatter()
        dateFormatter2.dateFormat = "dd/MM/yyyy hh:mm a"
        dateFormatter2.timeZone = timezone
        let strDate =  dateFormatter2.string(from: dt!)
        return strDate
    }
    func setUpCell(_ dict:Dictionary<String,AnyObject>? ,historyCell:Bool) {
        if historyCell{
            nameLabel.text = dict!["task"]!["name"] as? String
            if let ID = dict!["tourId"] as? NSNumber{
               // lblID.text = "TourId: \(ID)"
                 nameLabel.text = nameLabel.text! + "-\(ID)"
            }
            if let to = dict!["to"] as? String{
                lblTo.text = "To: \(dateString(date: to))"
            }
            if let from = dict!["from"] as? String{
                lblFrom.text = "From: \(dateString(date: from))"
            }
            if let duration = dict!["duration"] as? Double
            {
                let  milliseconds = Int(duration)
                let  seconds = milliseconds / 1000;
                let (h,m,_) = utility.secondsToHoursMinutesSeconds(seconds: seconds)
                lblDuration.text = " \(h)h \(m)min"
            }
        }
        else{
            nameLabel.text = dict!["tour"]!["name"] as? String
            if let ID = dict!["tour"]!["tourId"] as? NSNumber{
               // lblID.text = "TourId: \(ID)"
                nameLabel.text = nameLabel.text! + "-\(ID)"
            }
            if let to = dict!["action"]?["actionDate"] as? String{
                lblTo.text = "Action Time: \(dateString(date: to))"
            }
            if let from = dict!["action"]?["actionType"] as? String{
                lblFrom.text = "Action Type: \(from)"
            }
        }
    }
}
