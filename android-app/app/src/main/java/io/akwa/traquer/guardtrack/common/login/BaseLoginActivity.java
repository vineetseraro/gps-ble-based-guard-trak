package io.akwa.traquer.guardtrack.common.login;

import android.os.Bundle;


import com.urbanairship.UAirship;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.cognito.OnUserDetails;
import io.akwa.traquer.guardtrack.common.cognito.UserDetail;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.ReaderGetProfileResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetSettingsResponse;

public abstract class BaseLoginActivity extends BaseActivity implements LoginContract.View,OnUserDetails {

    public LoginContract.UserActionsListener mActionsListener;

    public abstract void goToNextActivity(String message);

    public abstract void setSetting(ReaderGetSettingsResponse readerGetSettingsResponse);

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActionsListener = new LoginPresenter(this);

    }


    public void customLogin(String email, String password) {
        DialogClass.showDialog(this, getString(R.string.msg_wait));
        mActionsListener.getUserAuthentication(email, password);

    }

    @Override
    public void onUserDetails(ReaderGetProfileResponse data, Exception exception) {
        if(data!=null) {
            saveUserProfile(data);
            PrefUtils.setUserLogin(true);
            goToNextActivity("Login Successfully ");

        }
      else
        {
            DialogClass.alerDialog(this,exception.getMessage());
        }



    }

    @Override
    public void onUserAuthenticationDone(String user,String password, String message) {
        DialogClass.dismissDialog(this);
        if (message == null) {
             /*   ReaderSignInResponse signInResponse = loginResponse.getData().getReaderSignInResponse();
                EventsLog.login(true,signInResponse.getReaderGetProfileResponse().getEmail(),loginResponse.getCode());
                PrefUtils.setAccessToken(signInResponse.getToken());
                PrefUtils.setAccessToken(signInResponse.getToken());
                PrefUtils.setSessionToken(signInResponse.getSessionToken());
                saveUserProfile(signInResponse.getReaderGetProfileResponse());
                setSetting(signInResponse.getReaderGetSettingsResponse());*/

            UserDetail userDetail=new UserDetail(this);
            userDetail.getCognitoUser(user);


        }
        else if(message.equals("NEW_PASSWORD_REQUIRED"))
        {
            DialogClass.alerDialog(this, "New Password Required");
        }
        else {
            DialogClass.alerDialog(this, message);
        }
    }

    private void saveUserProfile(ReaderGetProfileResponse data) {
        if(data!=null) {
            UAirship.shared().getNamedUser().setId(data.getEmail());
            PrefUtils.setEmail(data.getEmail());
            PrefUtils.setFirstName(data.getFirstName());
            PrefUtils.setLastName(data.getLastName());
            PrefUtils.setMobile(data.getMobile());
            PrefUtils.setCountryCode(data.getCountryCode() + "(+" + data.getCountryDialCode() + ")");
            PrefUtils.setCountry(data.getCountryCode());
            PrefUtils.setCity(data.getCity());
            PrefUtils.setUserImageUrl(data.getProfileImage());
            PrefUtils.setUserRole(data.getRoleCode());
        }

    }


}
