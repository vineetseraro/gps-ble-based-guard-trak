//
//  SOSViewController.swift
//  STRCourier
//
//  Created by Nitin Singh on 31/10/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit
import APAddressBook

class ContactModel {
    
    var number: String?
    var name : String?
    
    init(name: String?,number : String?){
        self.name = name
        self.number = number
       
        
    }
}


class SOSViewController: UIViewController, UITableViewDelegate, UITableViewDataSource {
    var contactSOS = [APContact]()
    var arrayData: [ContactModel]! = []
    @IBOutlet var tableView: UITableView!
    @IBOutlet weak var addContactBtn: UIButton!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.ContactSettings.rawValue
        customizeNavigationforAll(self)
        let nib = UINib(nibName: "SOSTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "sosTableViewCell")
        tableView.tableFooterView = UIView()
        // Do any additional setup after loading the view.
        dataFeeding()
    }

    override func viewWillAppear(_ animated: Bool) {
        print(contactSOS)
        tableView.reloadData()
    }
    func dataFeeding()  {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        
        
        generalApiobj.hitApiwith([:], serviceType: .strApigetContactSettings, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                let dataDictionary = response["data"] as? [[String : AnyObject]]

                for data in dataDictionary!{
                    let contactObj = ContactModel.init(name:  (data["name"] as! String), number: data["number"] as! String)
                    self.arrayData.append(contactObj)
                   
                }
                
                self.tableView .reloadData()
                
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
                NSLog(" %@", err)
            }
        }
    }
        
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func addContactBtnClicked(_ sender: Any){
       
        
        let vc =  ContactViewController(nibName: "ContactViewController", bundle: nil)
        vc.selectedContacts = contactSOS
       
        vc.blockSelectContact = {(cntactSOS) in
            
            self.contactSOS = cntactSOS
            print(self.contactSOS)
            let contactObj = ContactModel.init(name:  self.contactName(cntactSOS.last!), number: self.contactPhones(cntactSOS.last!))
            self.arrayData.append(contactObj)
            self.updateSOSContacts(with: self.arrayData)
        }
        self.navigationController?.pushViewController(vc, animated: true)
    }
    
    func sortButtonClicked(_ sender : AnyObject){
        
//        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
//        self.navigationController?.pushViewController(VW, animated: true)
        
    }
    func backToDashbaord(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return self.arrayData.count
        
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: SOSTableViewCell = self.tableView.dequeueReusableCell(withIdentifier: "sosTableViewCell") as! SOSTableViewCell
        cell.update(with: arrayData[indexPath.row])
        cell.deleteButton.tag = indexPath.row
        cell.deleteButton.addTarget(self, action: #selector(deleteSOSNumber(_:)), for: UIControlEvents.touchUpInside)
        cell.selectionStyle =  UITableViewCellSelectionStyle.none
        return cell
    }
    func deleteSOSNumber(_ sender : UIButton) {
        arrayData.remove(at: sender.tag)
        self.updateSOSContacts(with: self.arrayData)
        
    }
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 63
    }
    
    func updateSOSContacts(with contacts: [ContactModel])  {
        let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        var paramDictArr  = [[String : AnyObject]]()
        for contact in contacts {

            let   paramDict : [String :String] = ["name":contact.name!, "number":contact.number!]
            paramDictArr.append(paramDict as [String : AnyObject])
        }
        let   paramDict = ["emergencyContacts": paramDictArr]
        print(paramDict)
        
        generalApiobj.hitApiwith(paramDict as! Dictionary<String, AnyObject>, serviceType: .strApiUpdateContactSettings, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                
                let description = response["description"] as? String
                utility.createAlert("", alertMessage: description!, alertCancelTitle: "OK", view: self.view);
                
                self.tableView .reloadData()
                
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
            }
            
        }) { (err) in
            DispatchQueue.main.async {
                
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                utility.createAlert("", alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: "OK", view: self.view);
                NSLog(" %@", err)
            }
        }
    }
    
    // MARK: - prviate
    
    func contactName(_ contact :APContact) -> String {
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
