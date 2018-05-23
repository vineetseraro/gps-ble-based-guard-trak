package io.akwa.traquer.guardtrack.ui.contactsettings;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.ContactSettingRequest;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;

public interface ContactSettingContract {

    interface View {
        void onGetSettingsResponseReceive(GetContactSettingsResponse response, NicbitException e);
        void onUpdateSettingsResponseReceive(GetContactSettingsResponse response, NicbitException e);
    }

    interface UserActionsListener {
        void getSettings();
        void updateSettings(ContactSettingRequest updateSettingsRequest);
    }
}
