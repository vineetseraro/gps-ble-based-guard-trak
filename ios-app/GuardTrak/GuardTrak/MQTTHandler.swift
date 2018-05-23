//
//  MQTTHandler.swift
//  EmpTrak
//
//  Created by Nitin Singh on 17/11/17.
//  Copyright © 2017 Akwa. All rights reserved.
//

import UIKit
import AWSCore
import AWSCognitoIdentityProvider
import AWSIoT

class MQTTHandler: NSObject {

    var iotDataManager: AWSIoTDataManager!;
    var iotData: AWSIoTData!
    var connected = false;
    var iotManager: AWSIoTManager!;
    var iot: AWSIoT!
    var userPool: AWSCognitoIdentityUserPool?
    // Initiate MQTT
    func initiateMQTT()
    {
        let credentialsProvider = AWSCognitoCredentialsProvider(regionType: CognitoRegion, identityPoolId: CognitoIdentityPoolId)
        let configuration = AWSServiceConfiguration(region: CognitoRegion, credentialsProvider: credentialsProvider)
        
        
        AWSServiceManager.default().defaultServiceConfiguration = configuration
        
        iotManager = AWSIoTManager.default()
        iot = AWSIoT.default()
        
        iotDataManager = AWSIoTDataManager.default()
        iotData = AWSIoTData.default()
        
        connectMqtt()
        
    }
    
    
   internal func connectMqtt() {
        
        
        func mqttEventCallback( _ status: AWSIoTMQTTStatus )
        {
            DispatchQueue.main.async {
                print("connection status = \(status.rawValue)")
                
                switch(status)
                {
                case .connecting:
                    
                    print("Connecting...")
                    
                case .connected:
                    
                    
                    self.connected = true
                    
                    let uuid = UUID().uuidString;
                    let defaults = UserDefaults.standard
                    let certificateId = defaults.string( forKey: "certificateId")
                    
                    
                    print("Using certificate:\n\(certificateId!)\n\n\nClient ID:\n\(uuid)")
                    
                    
                case .disconnected:
                    
                    print("Disconnected...")
                    
                    
                case .connectionRefused:
                    
                    print("Connection Refused")
                    
                case .connectionError:
                    
                    print("Connection Error")
                    
                case .protocolError:
                    
                    print("protocol Error")
                    
                default:
                    print("Unknown State")
                    
                }
                NotificationCenter.default.post( name: Notification.Name(rawValue: "connectionStatusChanged"), object: self )
            }
            
        }
        
        if (connected == false)
        {
            
            
            let defaults = UserDefaults.standard
            var certificateId = defaults.string( forKey: "certificateId")
            
            if (certificateId == nil)
            {
                DispatchQueue.main.async {
                    print("No identity available, searching bundle...")
                    
                }
             
                let myBundle = Bundle.main
                let myImages = myBundle.paths(forResourcesOfType: "p12" as String, inDirectory:nil)
                let uuid = UUID().uuidString;
                
                if (myImages.count > 0) {
              
                    if let data = try? Data(contentsOf: URL(fileURLWithPath: myImages[0])) {
                      
                        if AWSIoTManager.importIdentity( fromPKCS12Data: data, passPhrase:"", certificateId:myImages[0]) {

                            defaults.set(myImages[0], forKey:"certificateId")
                            defaults.set("from-bundle", forKey:"certificateArn")
                            DispatchQueue.main.async {

                                self.iotDataManager.connect( withClientId: uuid, cleanSession:true, certificateId:myImages[0], statusCallback: mqttEventCallback)
                            }
                        }
                    }
                }
                certificateId = defaults.string( forKey: "certificateId")
                if (certificateId == nil) {
           
                    let csrDictionary = [ "commonName":CertificateSigningRequestCommonName, "countryName":CertificateSigningRequestCountryName, "organizationName":CertificateSigningRequestOrganizationName, "organizationalUnitName":CertificateSigningRequestOrganizationalUnitName ]
                    
                    
                    
                    
                    
                    self.iotManager.createKeysAndCertificate(fromCsr: csrDictionary, callback: {  (response ) -> Void in
                        if (response != nil)
                        {
                            defaults.set(response?.certificateId, forKey:"certificateId")
                            defaults.set(response?.certificateArn, forKey:"certificateArn")
                            certificateId = response?.certificateId
                            print("response: [\(response)]")
                            
                            let attachPrincipalPolicyRequest = AWSIoTAttachPrincipalPolicyRequest()
                            attachPrincipalPolicyRequest?.policyName =  PolicyName
                            attachPrincipalPolicyRequest?.principal = response?.certificateArn
                       self.iot.attachPrincipalPolicy(attachPrincipalPolicyRequest!).continueWith (block: { (task) -> AnyObject? in
                                if let error = task.error {
                                    print("failed: [\(error)]")
                                }
                                print("result: [\(task.result)]")
                      
                                if (task.error == nil)
                                {
                                    DispatchQueue.main.asyncAfter(deadline: .now()+2, execute: {
                                        self.iotDataManager.connect( withClientId: uuid, cleanSession:true, certificateId:certificateId!, statusCallback: mqttEventCallback)
                                        
                                    })
                                }
                                return nil
                            })
                        }
                        else
                        {
                            print("Error")
                        }
                    } )
                }
            }
            else
            {
                let uuid = UUID().uuidString;
                
                //
                // Connect to the AWS IoT service
                //
                iotDataManager.connect( withClientId: uuid, cleanSession:true, certificateId:certificateId!, statusCallback: mqttEventCallback)
            }
        }
        else
        {
            
            
            DispatchQueue.global(qos: DispatchQoS.QoSClass.default).async {
                self.iotDataManager.disconnect();
                DispatchQueue.main.async {
                    
                    self.connected = false
                    
                }
            }
        }
        
    }
    
    
    
}
