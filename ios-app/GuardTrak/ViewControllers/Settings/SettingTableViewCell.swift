import UIKit

class SettingTableViewCell: UITableViewCell {

    @IBOutlet var labelName : UILabel?
    @IBOutlet var switchControl : UIButton?
    override func awakeFromNib() {
        super.awakeFromNib()
        // Initialization code
        
        switchControl!.transform = CGAffineTransform(scaleX: 0.75, y: 0.75);
          labelName!.font =  UIFont(name: "SourceSansPro-Semibold", size: 15.0);
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
}
