//
//  AKHomeEmpTrackViewController.swift
//  STRCourier
//
//  Created by Amarendra on 10/16/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import UIKit

class AKHomeEmpTrackViewController: UIViewController {
@IBOutlet var lblNavigation: UILabel!
    @IBOutlet var lblTitle: UILabel!
@IBOutlet weak var mapView: UIWebView!
    override func viewDidLoad() {
        super.viewDidLoad()
       self.navigationController?.navigationBar.isHidden = true
         self.revealViewController().panGestureRecognizer().isEnabled = true
         customizeNavigationforAll(self)
        setUpFont()
        
        // Do any additional setup after loading the view.
    }

    override var preferredStatusBarStyle: UIStatusBarStyle {
        return .lightContent
    }
    
    override func viewWillAppear(_ animated: Bool) {
        super.viewWillAppear(animated)
        setNeedsStatusBarAppearanceUpdate()
        self.navigationController?.navigationBar.isHidden = true
       
        if(utility.getIdToken() == nil || utility.getIdToken() == " ")
        {
            utility.setflagSession(true)
            self.presentLogin()
            utility.setBeaconServices(true)
        }
        else{
            
            mapView.scalesPageToFit = true
            mapView.autoresizesSubviews = true
           //. mapView.autoresizingMask = [.flexibleWidth, .flexibleHeight]
            let mapUrlObj = String(format: "%@%@", mapUrl ,utility.getSubCode()!)
            
            mapView.loadRequest(URLRequest(url: URL(string: mapUrlObj)!))
//            let loadingNotification = MBProgressHUD.showAdded(to: self.view, animated: true)
//            loadingNotification?.mode = MBProgressHUDMode.indeterminate
//            loadingNotification?.labelText = "Loading"
        }
    }
    func webViewDidFinishLoad(_ webView: UIWebView) {
       // MBProgressHUD.hideAllHUDs(for: self.view, animated: true)
    }
    @IBAction func btnSideMenu(_ sender: AnyObject) {
        let appDelegate = UIApplication.shared.delegate as! AppDelegate
        appDelegate.initSideBarMenu()
    }
    func poptoPreviousScreen(){
        
    }
    
    func presentLogin() -> () {
        let login = STRLoginViewController(nibName: "STRLoginViewController", bundle: nil)
        let nav = UINavigationController(rootViewController: login)
        self.navigationController?.present(nav, animated: false, completion: {
            
        })
    }
    
    func customizeNavigation(_ ref : UIViewController) {
        
        ref.navigationController?.navigationBar.isTranslucent = false
        let button: UIButton = UIButton.init()
        
        button.setImage(UIImage(named: "sidemenu"), for: UIControlState())
        button.addTarget(ref, action: #selector(AKHomeEmpTrackViewController.toggleSideMenu(_:)), for: UIControlEvents.touchUpInside)
        button.frame = CGRect(x: 0, y: 0, width: 25, height: 25)
        
        let barButton = UIBarButtonItem(customView: button)
        ref.navigationItem.leftBarButtonItem = barButton
        
        
        let buttonSearch: UIButton = UIButton.init()
        buttonSearch .setTitle("", for: UIControlState())
        buttonSearch.titleLabel!.font =  UIFont(name: "SourceSansPro-Regular", size: 10)
        
        buttonSearch.addTarget(ref, action: #selector(AKHomeEmpTrackViewController.barButtonItemClicked(_:)), for: UIControlEvents.touchUpInside)
        //set frame
        buttonSearch.frame = CGRect(x: 0, y: 0, width: 25, height: 25)
        
        let buttonSort: UIButton = UIButton.init()
        
        buttonSort.setImage(UIImage(named: ""), for: UIControlState())
        //add function for button
        buttonSort.addTarget(ref, action: #selector(AKHomeEmpTrackViewController.sortButtonClicked(_:)), for: UIControlEvents.touchUpInside)
        buttonSort.frame = CGRect(x: 0, y: 0, width: 25, height: 25)
        
        
        let barButtonSearch = UIBarButtonItem(customView: buttonSearch)
        let barButtonSort = UIBarButtonItem(customView: buttonSort)
        //assign button to navigationbar
      //  ref.navigationItem.rightBarButtonItems = [barButtonSearch , barButtonSort]
        
        
        
        
        
    }
    func setUpFont(){
        self.lblNavigation.font =  UIFont(name: "Roboto-Light", size: 20)!
     //n   self.lblTitle.font =  UIFont(name: "SourceSansPro-Semibold", size:22)
        
    }
    
    func barButtonItemClicked(_ sender : AnyObject){
        
    }
    
    func sortButtonClicked(_ sender : AnyObject){
        
        
        
//        let VW = STRSearchViewController(nibName: "STRSearchViewController", bundle: nil)
//        self.navigationController?.pushViewController(VW, animated: true)
        
    }
    
    func toggleSideMenu(_ sender: AnyObject) {
        
        self.revealViewController().revealToggle(animated: true)
        
    }
    
    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    

   

}
