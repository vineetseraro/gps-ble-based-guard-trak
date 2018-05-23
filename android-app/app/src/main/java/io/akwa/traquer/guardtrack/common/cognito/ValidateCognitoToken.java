package io.akwa.traquer.guardtrack.common.cognito;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoDevice;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUser;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserPool;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserSession;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.AuthenticationContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.ChallengeContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.MultiFactorAuthenticationContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.handlers.AuthenticationHandler;

import io.akwa.traquer.guardtrack.common.utils.PrefUtils;


public class ValidateCognitoToken implements AuthenticationHandler{
    UserTokenListener userTokenListener;
    private String username;
   public ValidateCognitoToken(UserTokenListener userTokenListener)
   {
       this.userTokenListener=userTokenListener;
       CognitoUserPool cognitoUserPool=AppHelper.getPool();
       CognitoUser user = AppHelper.getPool().getCurrentUser();
       username = user.getUserId();
       if(username!=null)
       cognitoUserPool.getUser(username).getSessionInBackground(this);
       else
           userTokenListener.onValidateToken(false);

   }

    @Override
    public void onSuccess(CognitoUserSession cognitoUserSession, CognitoDevice newDevice) {
        AppHelper.setCurrSession(cognitoUserSession);
        AppHelper.newDevice(newDevice);
        PrefUtils.setAccessToken(cognitoUserSession.getIdToken().getJWTToken()+"::"+cognitoUserSession.getAccessToken().getJWTToken());
        userTokenListener.onValidateToken(true);

    }

    @Override
    public void getAuthenticationDetails(AuthenticationContinuation authenticationContinuation, String UserId) {
        userTokenListener.onValidateToken(false);
    }

    @Override
    public void getMFACode(MultiFactorAuthenticationContinuation continuation) {
        userTokenListener.onValidateToken(false);
    }

    @Override
    public void authenticationChallenge(ChallengeContinuation continuation) {
        userTokenListener.onValidateToken(false);
    }

    @Override
    public void onFailure(Exception exception) {
        userTokenListener.onValidateToken(false);
    }


    public interface UserTokenListener
    {
         void onValidateToken(boolean isValidate);
    }


}
