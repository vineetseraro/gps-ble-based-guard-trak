package io.akwa.traquer.guardtrack.ui.editProfile;

import android.os.Bundle;
import android.view.Menu;
import android.view.MenuItem;

import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserDetails;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.CognitoUserSession;
import com.amazonaws.mobileconnectors.cognitoidentityprovider.handlers.GetDetailsHandler;


import java.io.File;
import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.BaseActivity;
import io.akwa.traquer.guardtrack.common.cognito.AppHelper;
import io.akwa.traquer.guardtrack.common.cognito.UserDetail;
import io.akwa.traquer.guardtrack.common.utils.DialogClass;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.exception.ErrorMessage;
import io.akwa.traquer.guardtrack.exception.ErrorMessageHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.CountryApiResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetCountriesResponse;
import io.akwa.traquer.guardtrack.model.ReaderGetProfileResponse;

public abstract class BaseEditProfileActivity extends BaseActivity implements EditProfileContract.View{


    private CognitoUserSession session;
    private CognitoUserDetails details;

    // User details
    private String username;

    public EditProfileContract.UserActionsListener mActionsListener;

    protected abstract void setValuesInPreference(String profileImageUrl);

    protected abstract void setCountries(List<ReaderGetCountriesResponse> readerGetCountriesResponse);
    protected abstract void setProfile(ReaderGetProfileResponse profileResponse);

    @Override
    public void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);
        mActionsListener = new EditProfilePresenter(this);
    }

    public void editProfile(Integer isImageRemove, String city, String password, String firstName, String lastName, String mobileNo, String countryCode, File profileImage){
        DialogClass.showDialog(this, getString(R.string.msg_wait));
        mActionsListener.doEditProfile(isImageRemove,city,password,firstName,lastName,mobileNo,countryCode,profileImage);
    }

    public void getCountriesList(boolean isDialogDisplay){
        DialogClass.showDialog(this,getString(R.string.msg_wait));
        mActionsListener.doCountries();
    }

    public void getProfile(){
       DialogClass.showDialog(this,getString(R.string.msg_wait));
        getDetails();
       // mActionsListener.getProfile();



    }
    @Override
    public void onEditProfileDone(ApiResponseModel editResponse, NicbitException e) {
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (editResponse.getCode() == 200) {
              /*  ReaderUpdateProfileResponse response= editResponse.getData().getReaderUpdateProfileResponse();
                setValuesInPreference(response.getProfileImageUrl());*/
                DialogClass.alerDialog(this, getResources().getString(R.string.profile_edit_successfully));
            }
            else{
                ErrorMessageHandler.handleErrorMessage(editResponse.getCode(), this);
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }

    @Override
    public void onCountriesDone(CountryApiResponse responseModel, NicbitException e){
        DialogClass.dismissDialog(this);
        if (e == null) {
            if (responseModel.getCode() == StringUtils.SUCCESS_CODE) {
                setCountries(responseModel.getReaderGetCountriesResponse());
            }else{
                ErrorMessageHandler.handleErrorMessage(responseModel.getCode(), this);
            }
        } else {
            if(e.getErrorMessage().equals(ErrorMessage.SYNC_TOKEN_ERROR))
                ErrorMessageHandler.handleErrorMessage(208, this);
            else
                DialogClass.alerDialog(this, getResources().getString(R.string.check_internet_connection));
        }
    }



    @Override
    public boolean onOptionsItemSelected(MenuItem item) {
        super.onOptionsItemSelected(item);

        int id = item.getItemId();
        switch (id) {
            case android.R.id.home:
                onBackPressed();
                break;
            case R.id.menu_search:
             /*   Intent intent = new Intent(BaseEditProfileActivity.this, getSearchActivity());
                startActivity(intent);*/
                break;
        }

        return true;
    }

    @Override
    public boolean onCreateOptionsMenu(Menu menu) {
        getMenuInflater().inflate(R.menu.menu_settings, menu);
        return true;
    }

    // Get user details from CIP service
    private void getDetails() {

        AppHelper.getPool().getUser(PrefUtils.getEmail()).getDetailsInBackground(detailsHandler);
    }


    GetDetailsHandler detailsHandler = new GetDetailsHandler() {
        @Override
        public void onSuccess(CognitoUserDetails cognitoUserDetails) {

            DialogClass.dismissDialog(BaseEditProfileActivity.this);
            // Store details in the AppHandler
            AppHelper.setUserDetails(cognitoUserDetails);
            setProfile(UserDetail.getUserDetails(cognitoUserDetails));

        }

        @Override
        public void onFailure(Exception exception) {
            DialogClass.dismissDialog(BaseEditProfileActivity.this);
            DialogClass.alerDialog(BaseEditProfileActivity.this, AppHelper.formatException(exception));
        }
    };


}
