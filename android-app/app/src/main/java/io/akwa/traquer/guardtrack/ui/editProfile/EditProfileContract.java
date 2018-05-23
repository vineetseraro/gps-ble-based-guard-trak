package io.akwa.traquer.guardtrack.ui.editProfile;


import java.io.File;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.CountryApiResponse;

public interface EditProfileContract {
    interface View {
        void onEditProfileDone(ApiResponseModel loginResponse, NicbitException e);
        void onCountriesDone(CountryApiResponse responseModel, NicbitException e);

    }
    interface UserActionsListener {
        void doEditProfile(Integer isImageRemove, String city, String password, String firstName, String lastName, String mobileNo, String countryCode, File profileImage);
        void doCountries();
        void getProfile();
    }
}
