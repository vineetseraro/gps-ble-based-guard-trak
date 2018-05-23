import UIKit

class STRSettingSectionHeader: UIView {

    @IBOutlet var LblTitle: UILabel!
    override func awakeFromNib() {
        LblTitle.font = UIFont(name: "SourceSansPro-Semibold", size: 14.0);
    }
}
