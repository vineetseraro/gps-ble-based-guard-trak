//
//  SOSTableViewCell.swift
//  STRCourier
//
//  Created by Nitin Singh on 31/10/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit
import APAddressBook

class SOSTableViewCell: UITableViewCell {
    @IBOutlet var lblName: UILabel!
     @IBOutlet var lblNumber: UILabel!
     @IBOutlet var deleteButton: UIButton!
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
    }

    @IBAction func deleteButtonClicked(_ sender: Any) {
    }
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    func update(with model: ContactModel) {
       
        lblNumber?.text = model.number
        lblName?.text = model.name
        
    }
    // MARK: - prviate
    
    func contactName(_ contact :APContact) -> String {
        print(contact.name)
        if let firstName = contact.name?.firstName, let lastName = contact.name?.lastName {
            return "\(firstName) \(lastName)"
        }
        else if let firstName = contact.name?.firstName {
            return "\(firstName)"
        }
        else if let lastName = contact.name?.lastName {
            return "\(lastName)"
        }
        else {
            return "Unnamed contact"
        }
    }
    
    func contactPhones(_ contact :APContact) -> String {
        if let phones = contact.phones {
            var phonesString = ""
            for phone in phones {
                if let number = phone.number {
                    phonesString = phonesString + " " + number
                }
            }
            return phonesString
        }
        return "No phone"
    }
    
}
