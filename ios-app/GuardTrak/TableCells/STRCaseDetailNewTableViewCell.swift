import UIKit
import AKProximity
class STRCaseDetailNewTableViewCell: UITableViewCell {
    @IBOutlet var lblCode: UILabel!
    @IBOutlet var lblItem: UILabel!
    @IBOutlet var lblLocation: UILabel!

    @IBOutlet var imgIcon: UIImageView!
    @IBOutlet var imgStatus: UIImageView!
    
    @IBAction func btnMap(_ sender: Any) {
        if(self.coordinates.count == 2)
        {
            let url : NSString = "http://maps.google.com/maps?saddr=\(BeaconHandler.sharedHandler.coordinate!.latitude),\(BeaconHandler.sharedHandler.coordinate!.longitude)&daddr=\(String(describing: self.coordinates["latitude"])),\(String(describing: self.coordinates["longitude"]))" as NSString
            
            
            let urlStr : NSString = url.addingPercentEscapes(using: String.Encoding.utf8.rawValue)! as NSString
            let searchURL : NSURL = NSURL(string: urlStr as String)!
            print(searchURL)
            
            //
            //        let pathURL: URL? = Foundation.URL(string: address)
            
            UIApplication.shared.openURL(searchURL as URL)        }
        
    }
    var coordinates = [String:AnyObject]()
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
         setUpFont()
        
    }
  
    func setUpFont(){
         lblCode.font = UIFont(name: "SourceSansPro-Regular", size: 14.0);
         lblItem.font = UIFont(name: "SourceSansPro-Semibold", size: 18.0);
         lblLocation.font = UIFont(name: "SourceSansPro-Semibold", size: 18.0);
           }
    
    func setUpData(_ dict:Dictionary<String,AnyObject>,IndexPath index:NSInteger){
        lblCode.text = (dict["name"] as? String)?.uppercased()
        lblItem.text = dict["code"] as? String
        self.lblLocation.text = "";
        if let location = dict["location"]{
            if let floor = location["floor"] as? [String:AnyObject] {
                if let zone = floor["zone"] as? [String:AnyObject] {
                    if let zname = zone["name"] as? String{
                        
                        self.lblLocation.text = self.lblLocation.text! + zname + ","
                    }
                    if let fname = floor["name"] as? String{
                        
                        self.lblLocation.text = self.lblLocation.text!+fname + ","
                    }
                    if let lname = location["name"] as? String{
                        
                        self.lblLocation.text = self.lblLocation.text!+lname
                    }
                }
            }
            if  let temp = location["coordinates"] as? [String : AnyObject]{
                self.coordinates = temp
            }
        }
        self.imgStatus.isHidden = false
      

    }
    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
