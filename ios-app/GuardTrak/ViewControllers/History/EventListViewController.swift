//
//  EventListViewController.swift
//  GuardTrak
//
//  Created by niteshgoel on 1/16/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import UIKit
import JWTDecode

class EventListViewController: UIViewController {
    @IBOutlet weak var tblHistory: UITableView!
    var arrayData:[Dictionary<String,AnyObject>]?
    var timezone = ""
    var tourId = ""
    var name:String!
    override func viewDidLoad() {
        super.viewDidLoad()
        self.title = TitleName.Event.rawValue
        customizeNavigationforAll(self)
        self.navigationController?.navigationBar.isTranslucent = false
        // Do any additional setup after loading the view.
        let nib = UINib(nibName: "DetailTableViewCell", bundle: nil)
        tblHistory.register(nib, forCellReuseIdentifier: "detailTableViewCell")
        tblHistory.rowHeight = UITableViewAutomaticDimension
        tblHistory.estimatedRowHeight = 140
        arrayData = [Dictionary<String,AnyObject>]()
        getTimeZone()
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        //self.navigationItem.titleView = STRNavigationTitle.setTitle(TitleName.Tours.rawValue, subheading:"\(self.name!)-\(self.tourId)")
        getData()
    }
    
    func sortButtonClicked(_ sender : AnyObject){
        
        //        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)//        self.navigationController?.pushViewController(VW, animated: true)
    }
    func toggleSideMenu(_ sender: AnyObject) {
        self.revealViewController().revealToggle(animated: true)
        
        
    }
    func backToDashbaord(_ sender: AnyObject) {
       self.navigationController?.popViewController(animated: true)
    }
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func getData()->(){
        var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
        loadingNotification?.mode = MBProgressHUDMode.indeterminate
        loadingNotification?.labelText = "Loading"
        let generalApiobj = GeneralAPI()
        generalApiobj.hitApiwith(["tourId":self.tourId as AnyObject ,"sort":"-actionDate" as AnyObject], serviceType: .strEventList, success: { (response) in
            DispatchQueue.main.async {
                print(response)
                if(response["code"] as! NSInteger !=  200)
                {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    loadingNotification = nil
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                guard let data = response["data"] as? [Dictionary<String,AnyObject>]else{
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    return
                }
                self.arrayData?.removeAll()
                self.arrayData?.append(contentsOf: data)
                self.tblHistory.reloadData()
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                
            }
        }) { (err) in
            DispatchQueue.main.async {
                MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                NSLog(" %@", err)
            }
        }
        
    }
    func getTimeZone(){
        do{
            let jwt = try decode(jwt: utility.getIdToken())
            
            let dict:[String:AnyObject] = jwt.body as [String : AnyObject]
            print (dict["zoneinfo"])
            if let zone = dict["zoneinfo"] as? String{
                self.timezone = zone
            }
        }
        catch{
            
        }
        
    }
    func addNodata(){
        let noData = Bundle.main.loadNibNamed("STRNoDataFound", owner: nil, options: nil)!.last as! STRNoDataFound
        noData.tag = 10002
        self.view.addSubview(noData)
        noData.translatesAutoresizingMaskIntoConstraints = false
        self.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "V:|-(0)-[noData]-(0)-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["noData" : noData]))
        self.view.addConstraints(NSLayoutConstraint.constraints(withVisualFormat: "H:|-(0)-[noData]-(0)-|", options: NSLayoutFormatOptions(rawValue: 0), metrics: nil, views: ["noData" : noData]))
        
    }
}



extension EventListViewController : UITableViewDataSource,UITableViewDelegate{
    func numberOfSections(in tableView: UITableView) -> Int
    {
        return 1
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        
        if arrayData == nil || arrayData?.count == 0 {
            addNodata()
            return 0
        }
        for view in self.view.subviews{
            if(view.tag == 10002)
            {
                view.removeFromSuperview()
            }
            self.view.viewWithTag(10002)?.removeFromSuperview()
        }
        return (arrayData?.count)!
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: DetailTableViewCell = self.tblHistory.dequeueReusableCell(withIdentifier: "detailTableViewCell") as! DetailTableViewCell
        cell.timezone = self.timezone
        cell.setUpCell(arrayData?[indexPath.row],historyCell: false)
        cell.selectionStyle  = UITableViewCellSelectionStyle.none
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        
        
    }

}
