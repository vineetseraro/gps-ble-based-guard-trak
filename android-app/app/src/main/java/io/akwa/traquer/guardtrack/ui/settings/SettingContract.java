package io.akwa.traquer.guardtrack.ui.settings;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.UpdateSettingsRequest;

public interface SettingContract {

    interface View {
        void onGetSettingsResponseReceive(ApiResponseModel response, NicbitException e);
        void onUpdateSettingsResponseReceive(ApiResponseModel response, NicbitException e);
    }

    interface UserActionsListener {

        void getSettings();
        void updateSettings(UpdateSettingsRequest updateSettingsRequest);
    }
}
