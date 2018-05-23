//
//  NFCViewController.swift
//  EmpTrak
//
//  Created by Nitin Singh on 28/12/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit
import CoreNFC
@available(iOS 11.0, *)
protocol NFCViewControllerDelegate {
    func scannedNFC(tag:String)
}
@available(iOS 11.0, *)

class NFCViewController: UIViewController {
    var nfcSession: NFCNDEFReaderSession!
    var delegate:NFCViewControllerDelegate?
    @IBOutlet var tableView : UITableView!
    // Reference the found NFC messages
    var nfcMessages: [[NFCNDEFMessage]] = []
    override func viewDidLoad() {
        super.viewDidLoad()
        let nib = UINib(nibName: "NFCTableViewCell", bundle: nil)
        tableView.register(nib, forCellReuseIdentifier: "nFCTableViewCell")
        tableView.tableFooterView = UIView()
       self.initializeNFCSession()
       self.nfcSession.begin()

        // Do any additional setup after loading the view.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }
    
    @IBAction func startNFCSearchButtonTapped(_ sender: Any) {
    }
    func initializeNFCSession() {
        
        // Create the NFC Reader Session when the app starts
        self.nfcSession = NFCNDEFReaderSession(delegate: self, queue: DispatchQueue.main, invalidateAfterFirstRead: false)
        self.nfcSession.alertMessage = "You can scan NFC-tags by holding them behind the top of your iPhone."
    }
    class func formattedTypeNameFormat(from typeNameFormat: NFCTypeNameFormat) -> String {
        switch typeNameFormat {
        case .empty:
            return "Empty"
        case .nfcWellKnown:
            return "NFC Well Known"
        case .media:
            return "Media"
        case .absoluteURI:
            return "Absolute URI"
        case .nfcExternal:
            return "NFC External"
        case .unchanged:
            return "Unchanged"
        default:
            return "Unknown"
        }
    }

}

@available(iOS 11.0, *)
extension NFCViewController : UITableViewDataSource, UITableViewDelegate
{
     func numberOfSections(in tableView: UITableView) -> Int {
        return self.nfcMessages.count
    }
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
       return self.nfcMessages[section].count
        
    }
     func tableView(_ tableView: UITableView, titleForHeaderInSection section: Int) -> String? {
        let numberOfMessages = self.nfcMessages[section].count
        let headerTitle = numberOfMessages == 1 ? "One Message" : "\(numberOfMessages) Messages"
        
        return headerTitle
    }
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell = tableView.dequeueReusableCell(withIdentifier: "nFCTableViewCell", for: indexPath) as! NFCTableViewCell
        let nfcTag = self.nfcMessages[indexPath.section][indexPath.row]
        
        cell.textLabel?.text = "\(nfcTag.records.count) Records"
        cell.accessoryType = .disclosureIndicator
        
        return cell
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 63
    }
     func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        let nfcTag = self.nfcMessages[indexPath.section][indexPath.row]
        let records = nfcTag.records.map({ String(describing: String(data: $0.payload, encoding: .utf8)!) })
        
        let alertTitle = " \(nfcTag.records.count) Records found in Message"
        let alert = UIAlertController(title: alertTitle, message: records.joined(separator: "\n"), preferredStyle: .alert)
        
        alert.addAction(UIAlertAction(title: "OK", style: .default, handler: nil))
        
        self.present(alert, animated: true, completion: nil)
        self.tableView.deselectRow(at: indexPath, animated: true)
    }
}
// MARK: NFCNDEFReaderSessionDelegate

@available(iOS 11.0, *)
extension NFCViewController : NFCNDEFReaderSessionDelegate {
    
    // Called when the reader-session expired, you invalidated the dialog or accessed an invalidated session
    func readerSession(_ session: NFCNDEFReaderSession, didInvalidateWithError error: Error) {
        print("NFC-Session invalidated: \(error.localizedDescription)")
        // initialize a new session
        self.initializeNFCSession()
    }
    
    // Called when a new set of NDEF messages is found
    func readerSession(_ session: NFCNDEFReaderSession, didDetectNDEFs messages: [NFCNDEFMessage]) {
        print("New NFC Messages (\(messages.count)) detected:")
        
//        for message in messages {
//            print(" - \(message.records.count) Records:")
//            for record in message.records {
//                print("\t- TNF (TypeNameFormat): \(NFCViewController.formattedTypeNameFormat(from: record.typeNameFormat))")
//                print("\t- Payload: \(String(data: record.payload, encoding: .utf8)!)")
//                print("\t- Type: \(record.type)")
//                print("\t- Identifier: \(record.identifier)\n")
//            }
//        }
        
//        // Add the new messages to our found messages
        if(messages.count > 0)
        {
       
         // self.nfcMessages.append(messages)
        // Reload our table-view on the main-thread to display the new data-set
        DispatchQueue.main.async {
            let ID = String(data: messages[0].records[0].payload, encoding: .utf8)!.trimmingCharacters(in: CharacterSet.whitespacesAndNewlines)
            self.delegate?.scannedNFC(tag:String(ID.characters.dropFirst(3)))
            self.nfcSession.invalidate()
            self.navigationController?.popViewController(animated: true)
            }
        }
    }
}

