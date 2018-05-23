package io.akwa.traquer.guardtrack.common.cognito;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUser;

/**
 * Created by rohitkumar on 11/16/17.
 */

public class CognitoServices {

    public static void logOut()
    {
        String userName=AppHelper.getCurrUser();
        if(userName!=null) {
            CognitoUser cognitoUser = AppHelper.getPool().getUser(userName);
            cognitoUser.signOut();
        }

    }
}
