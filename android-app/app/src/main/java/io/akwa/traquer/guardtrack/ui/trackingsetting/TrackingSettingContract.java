package io.akwa.traquer.guardtrack.ui.trackingsetting;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;
import io.akwa.traquer.guardtrack.ui.trackingsetting.model.UpdateTrackingSetting;

public interface TrackingSettingContract {

    interface View {
        void onGetSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e);
        void onUpdateSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e);
    }

    interface UserActionsListener {
        void getSettings();
        void updateSettings(UpdateTrackingSetting updateSettingsRequest);
    }
}
