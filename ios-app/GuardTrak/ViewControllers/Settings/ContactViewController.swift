//
//  ContactViewController.swift
//  STRCourier
//
//  Created by Nitin Singh on 31/10/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit
import APAddressBook


fileprivate let cellIdentifier = String(describing: TableViewCell.self)


class ContactViewController: UIViewController {
var arrayData: [Dictionary<String,AnyObject>]?
    @IBOutlet weak var tableView: UITableView!
    @IBOutlet weak var activity: UIActivityIndicatorView!
    var blockSelectContact:(([APContact])->())?
    let addressBook = APAddressBook()
    var contacts = [APContact]()
    var selectedContacts = [APContact]()
    
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.ContactSettings.rawValue
        customizeNavigationforAll(self)
        tableView.register(TableViewCell.self, forCellReuseIdentifier: cellIdentifier)
        loadContacts()
        addressBook.fieldsMask = [APContactField.default, APContactField.thumbnail]
        addressBook.sortDescriptors = [NSSortDescriptor(key: "name.firstName", ascending: true),
                                       NSSortDescriptor(key: "name.lastName", ascending: true)]
        addressBook.filterBlock =
            {
                (contact: APContact) -> Bool in
                if let phones = contact.phones
                {
                    return phones.count > 0
                }
                return false
        }
        addressBook.startObserveChanges
            {
                [unowned self] in
                self.loadContacts()
        }
        // Do any additional setup after loading the view.
    }

    func sortButtonClicked(_ sender : AnyObject){
        
//        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
//        self.navigationController?.pushViewController(VW, animated: true)
        
    }
    func backToDashbaord(_ sender: AnyObject) {
        self.navigationController?.popViewController(animated: true)
    }
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func loadContacts()
    {
      //  activity.startAnimating();
        addressBook.loadContacts
            {
                [unowned self] (contacts: [APContact]?, error: Error?) in
              //  self.activity.stopAnimating()
                self.contacts = [APContact]()
                if let contacts = contacts
                {
                    self.contacts = contacts
                    self.tableView.reloadData()
                }
                else if let error = error
                {
                    let alert = UIAlertView(title: "Error", message: error.localizedDescription,
                                            delegate: nil, cancelButtonTitle: "OK")
                    alert.show()
                }
        }
    }

   

}
extension ContactViewController: UITableViewDataSource {
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return contacts.count
    }
    
    func tableView(_ tableView: UITableView,
                   cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: cellIdentifier,
                                                 for: indexPath)
        if let cell = cell as? TableViewCell {
            cell.update(with: contacts[indexPath.row])
        }
        return cell
    }
}

extension ContactViewController: UITableViewDelegate {
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
       // tableView.deselectRow(at: indexPath as IndexPath, animated: true)
        let selectdContact  = contacts[indexPath.row]
        selectedContacts.append(selectdContact)
        print(selectedContacts)
        if(self.blockSelectContact != nil)
        {
            self.blockSelectContact!(selectedContacts)
        }
        self.navigationController?.popViewController(animated: true)
    }
}
