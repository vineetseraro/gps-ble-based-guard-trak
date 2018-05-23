//
//  RegionEnterExitDetail.swift
//  EmpTrak
//
//  Created by Amarendra on 12/13/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit

class RegionEnterExitDetail: UIViewController {
    @IBOutlet weak var tvDetail: UITextView!

    override func viewDidLoad() {
        self.title = "Region Information"
        customizeNavigationforAll(self)
        self.navigationController?.navigationBar.isTranslucent = false
        super.viewDidLoad()
        tvDetail.isEditable = false
        if let arr = UserDefaults.standard.array(forKey: regionArray) as? [String]{
            var str = ""
            for (i,text) in arr.enumerated(){
                str.append("\(i+1).\(text)\n")
            }
            tvDetail.text = str
        }

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    func sortButtonClicked(_ sender : AnyObject){
        
        
    }
    func backToDashbaord(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
    
    /*
    // MARK: - Navigation

    // In a storyboard-based application, you will often want to do a little preparation before navigation
    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
        // Get the new view controller using segue.destinationViewController.
        // Pass the selected object to the new view controller.
    }
    */

}
