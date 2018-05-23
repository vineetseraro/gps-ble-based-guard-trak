package io.akwa.traquer.guardtrack.ui.editProfile;

import android.support.annotation.NonNull;



import java.io.File;

import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.listener.CountriesListener;
import io.akwa.traquer.guardtrack.listener.EditProfileResponseListener;
import io.akwa.traquer.guardtrack.listener.UserProfileResponseListener;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.CountryApiResponse;

public class EditProfilePresenter implements EditProfileContract.UserActionsListener,EditProfileResponseListener,CountriesListener,UserProfileResponseListener {

    private final EditProfileContract.View mEditProfileView;

    public EditProfilePresenter(@NonNull EditProfileContract.View mEditProfileView) {
        this.mEditProfileView = mEditProfileView;
    }


    @Override
    public void onEditProfileResponse(ApiResponseModel response, NicbitException e) {
        mEditProfileView.onEditProfileDone(response, e);

    }


    @Override
    public void onCountriesResponse(CountryApiResponse response, NicbitException e) {
        mEditProfileView.onCountriesDone(response, e);
    }


    @Override
    public void doEditProfile(Integer isImageRemove, String city, String password, String firstName, String lastName, String mobileNo, String countryCode, File profileImage) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setEditProfileResponseListener(this);
        apiHandler.doEditRequest(isImageRemove,city, password, firstName, lastName, mobileNo, countryCode,profileImage);
    }

    @Override
    public void doCountries() {
        ApiHandler apiHandler = new ApiHandler();
        apiHandler.setCountriesListener(this);
        apiHandler.getCountries();
    }

    @Override
    public void getProfile() {

    }


    @Override
    public void onUserProfileResponse(ApiResponseModel response, NicbitException e) {

    }
}
