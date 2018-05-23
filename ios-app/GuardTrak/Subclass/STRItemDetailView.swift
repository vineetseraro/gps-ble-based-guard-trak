import UIKit
import Crashlytics
class STRItemDetailView: UIView,UITableViewDataSource,UITableViewDelegate {
    var tableData: [Dictionary<String,AnyObject>]?
    
    func setTableData(){
    }
    @IBOutlet internal var tblItemDetail: UITableView!
    
    var blockForItemClicked: ((Dictionary<String,AnyObject>)->())?
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        if(self.tableData != nil)
        {
            return (self.tableData?.count)!
        }
        return 0
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell: STRCaseDetailNewTableViewCell = self.tblItemDetail.dequeueReusableCell(withIdentifier: "STRCaseDetailNewTableViewCell") as! STRCaseDetailNewTableViewCell
        cell.setUpData(self.tableData![indexPath.row],IndexPath: indexPath.row)
        cell.selectionStyle =  UITableViewCellSelectionStyle.none
        return cell
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        if(self.blockForItemClicked != nil)
        {
            self.blockForItemClicked!(self.tableData![indexPath.row])
        }
     
    }
    override func awakeFromNib() {
        let nib = UINib(nibName: "STRCaseDetailNewTableViewCell", bundle: nil)
        tblItemDetail.register(nib, forCellReuseIdentifier: "STRCaseDetailNewTableViewCell")
        tblItemDetail.rowHeight = UITableViewAutomaticDimension
        tblItemDetail.estimatedRowHeight = 86
    }
}
