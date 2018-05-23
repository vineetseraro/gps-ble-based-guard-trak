package io.akwa.traquer.guardtrack.common.login;

import android.support.annotation.NonNull;
import android.util.Base64;
import android.util.Log;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoDevice;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserPool;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserSession;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.AuthenticationContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.AuthenticationDetails;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.ChallengeContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.continuations.MultiFactorAuthenticationContinuation;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.handlers.AuthenticationHandler;
import com.auth0.android.jwt.JWT;

import java.io.UnsupportedEncodingException;
import java.util.Locale;

import io.akwa.traquer.guardtrack.common.cognito.AppHelper;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;

public class LoginPresenter implements LoginContract.UserActionsListener {

    private final LoginContract.View mLoginView;
    String email, password;

    public LoginPresenter(@NonNull LoginContract.View mLoginView) {
        this.mLoginView = mLoginView;
    }

    @Override
    public void getUserAuthentication(String email, String password) {
        this.email=email;
        this.password=password;
        AppHelper.setUser(this.email);
        CognitoUserPool cognitoUserPool=AppHelper.getPool();
        cognitoUserPool.getUser(this.email).getSessionInBackground(authenticationHandler);

    }



    AuthenticationHandler authenticationHandler = new AuthenticationHandler() {
        @Override
        public void onSuccess(CognitoUserSession cognitoUserSession, CognitoDevice device) {
            AppHelper.setCurrSession(cognitoUserSession);
            AppHelper.newDevice(device);


            try {
                JWT jwt = new JWT(cognitoUserSession.getIdToken().getJWTToken());
                String userGroup =jwt.getClaim("cognito:preferred_role").asString();


                if(userGroup.contains(Constant.USER_ROLE))
                {
                    PrefUtils.setAccessToken(cognitoUserSession.getIdToken().getJWTToken()+"::"+cognitoUserSession.getAccessToken().getJWTToken());
                    mLoginView.onUserAuthenticationDone(LoginPresenter.this.email,LoginPresenter.this.password,null);
                }
                else
                {
                    mLoginView.onUserAuthenticationDone(LoginPresenter.this.email,LoginPresenter.this.password,Constant.INVALID_MESSAGE);
                }

                Log.i("User Group",userGroup);

            }catch (Exception e)
            {
                e.printStackTrace();
            }


        }

        @Override
        public void getAuthenticationDetails(AuthenticationContinuation authenticationContinuation, String username) {

            Locale.setDefault(Locale.US);
            getUserAuthentication(authenticationContinuation, username);
        }

        @Override
        public void getMFACode(MultiFactorAuthenticationContinuation multiFactorAuthenticationContinuation) {


        }

        @Override
        public void onFailure(Exception e) {
            mLoginView.onUserAuthenticationDone(LoginPresenter.this.email,LoginPresenter.this.password, AppHelper.formatException(e));
        }

        @Override
        public void authenticationChallenge(ChallengeContinuation continuation) {
            /**
             * For Custom authentication challenge, implement your logic to present challenge to the
             * user and pass the user's responses to the continuation.
             */
            if ("NEW_PASSWORD_REQUIRED".equals(continuation.getChallengeName())) {
                mLoginView.onUserAuthenticationDone(LoginPresenter.this.email,LoginPresenter.this.password,"NEW_PASSWORD_REQUIRED");

            }
        }
    };


    private void getUserAuthentication(AuthenticationContinuation continuation, String username) {
        AppHelper.setUser(username);

        AuthenticationDetails authenticationDetails = new AuthenticationDetails(username, password, null);

        continuation.setAuthenticationDetails(authenticationDetails);
        continuation.continueTask();
    }

    private static String getJson(String strEncoded) throws UnsupportedEncodingException {
        byte[] decodedBytes = Base64.decode(strEncoded, Base64.URL_SAFE);
        return new String(decodedBytes, "UTF-8");
    }


}
