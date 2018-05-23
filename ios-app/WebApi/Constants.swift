//
//  Constants.swift
//  STRCourier
//
//  Created by Nitin Singh on 13/10/17.
//  Copyright © 2017 OSSCube. All rights reserved.
//

import Foundation
import AWSCognitoIdentityProvider

//****************************** MQTT Constants ******************************//
let CognitoIdentityPoolId = "" // identity pool id 
let CertificateSigningRequestCommonName = "Trakit"
let CertificateSigningRequestCountryName = "IN"
let CertificateSigningRequestOrganizationName = "akwa"
let CertificateSigningRequestOrganizationalUnitName = "akwaproducts"
let CognitoRegion = AWSRegionType.EUWest1
let PolicyName = "" // IOT Policy
let mqttTopic = "ak_guardtrak_trackPoints"

//****************************** AWS Cognito Constants ***********************//

let projectIdConst = "" // user pool id
let clientIdConst = "" // aws acount id



//****************************** Kontakt Key ********************************//

let kontaktApiKey = "" // kontakt api key


//****************************** Google Key ********************************//

let googleApiKey = ""


//****************************** Log File Key ********************************//


let role = "GuardTrak"
let roleLog = "Grd"
let roleIAM = "role-guardtrak-akguard"
let s3bucketId = "akwa-tracking-logs"
//****************************** Cognito File Key ********************************//

let CognitoIdentityUserPoolRegion: AWSRegionType = .EUWest1
let CognitoIdentityUserPoolId = "" // user pool id
let CognitoIdentityUserPoolAppClientId = "" // user pool app id
let CognitoIdentityUserPoolAppClientSecret = "" // user pool app secret
let AWSCognitoUserPoolsSignInProviderKey = "UserPool"




