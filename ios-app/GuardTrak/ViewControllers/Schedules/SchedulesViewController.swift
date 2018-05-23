//
//  SchedulesViewController.swift
//  GuardTrak
//
//  Created by niteshgoel on 1/9/18.
//  Copyright © 2018 Akwa. All rights reserved.
//

import UIKit
protocol SchedulesViewControllerDelegate {
    func didStartTour(id:String,name:String,tourId:String)
}
class SchedulesViewController: UIViewController {
    var data:[Dictionary<String,AnyObject>]?
    var row = -1
    var timezone = ""
    var delegate:SchedulesViewControllerDelegate?
    var lat:Double? = 0
    var long: Double? = 0
    var location : OneTimeLocation?

    @IBAction func btnStartTour(_ sender: Any) {
        if row != -1 {
            let dict = self.data![row]
            self.startTour(scheduleID: dict["id"] as! String)
        }
    }
    @IBOutlet weak var tblSchedules: UITableView!
    override func viewDidLoad() {
        super.viewDidLoad()
        location = OneTimeLocation(block: { (lat, long) in
            self.lat = lat
            self.long = long
        })
        self.title = TitleName.Schedule.rawValue
        customizeNavigationforAll(self)
        self.navigationController?.navigationBar.isTranslucent = false
        tblSchedules.rowHeight = UITableViewAutomaticDimension
        tblSchedules.estimatedRowHeight = 140
        let nib = UINib(nibName: "SchedulesTableViewCell", bundle: nil)
        tblSchedules.register(nib, forCellReuseIdentifier: "SchedulesTableViewCell")

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    func backToDashbaord(_ sender: AnyObject) {
        self.dismiss(animated: true) {
            
        }
    }
    func startTour(scheduleID:String){
            var loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
            loadingNotification?.mode = MBProgressHUDMode.indeterminate
            loadingNotification?.labelText = "Loading"
            let generalApiobj = GeneralAPI()
        generalApiobj.hitApiwith(["taskId":scheduleID as AnyObject,"lat":self.lat as AnyObject,"lon":self.long as AnyObject], serviceType: .strStartSchedule, success: { (response) in
                DispatchQueue.main.async {
                    print(response)
                    if(response["code"] as! Int !=  200)
                    {
                        MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                        loadingNotification = nil
                        utility.createAlert(TextMessage.alert.rawValue, alertMessage: "\(response["message"] as! String)", alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                        return
                    }
                    guard let data = response["data"] as? [String:AnyObject]else{
                        MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                        utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                        return
                    }
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    self.delegate?.didStartTour(id:data["id"] as! String ,name: data["task"]!["name"] as! String,tourId:"\(data["tourId"] as! NSNumber)" )
                    self.dismiss(animated: true, completion: nil)
                }
            }) { (err) in
                DispatchQueue.main.async {
                    MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
                    utility.createAlert(TextMessage.alert.rawValue, alertMessage: TextMessage.tryAgain.rawValue, alertCancelTitle: TextMessage.Ok.rawValue ,view: self)
                    NSLog(" %@", err)
                }
            }
            
        }
   
}

extension SchedulesViewController:UITableViewDelegate,UITableViewDataSource{
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if (self.data != nil){
            return data!.count
        }
        return 0
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: SchedulesTableViewCell = tableView.dequeueReusableCell(withIdentifier: "SchedulesTableViewCell") as! SchedulesTableViewCell
        let infoDictionary = self.data![indexPath.row]
        cell.setUpData(dict: infoDictionary,selected: (row == indexPath.row))
        cell.selectionStyle = UITableViewCellSelectionStyle.none
        return cell
    }
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        row = indexPath.row
        tableView.reloadData()
    }
    
}
