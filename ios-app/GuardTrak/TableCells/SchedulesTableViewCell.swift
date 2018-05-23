//
//  SchedulesTableViewCell.swift
//  GuardTrak
//
//  Created by niteshgoel on 1/9/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import UIKit

class SchedulesTableViewCell: UITableViewCell {
var timezone = ""
    @IBOutlet weak var lbl1: UILabel!
    @IBOutlet weak var lbl2: UILabel!
    @IBOutlet weak var imgSelect: UIImageView!
    
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
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
    
    func setUpData(dict:[String:AnyObject], selected:Bool){
        lbl1.text = dict["name"] as? String
        let from = dateString(date: (dict["from"] as? String)!)
        let to = dateString(date:  (dict["to"] as? String)!)
        lbl2.text = "\(from)   \(to)"
        if selected{
            
            imgSelect.image = UIImage(named: "rbselected")
        }
        else{
            imgSelect.image = nil//UIImage(named: "rbunselected")
        }
            
    }
    
}
