package io.akwa.traquer.guardtrack.ui.contactsettings.model;

import java.util.List;

/**
 * Created by rohitkumar on 11/2/17.
 */

public class ContactSettingRequest {

    List<GetContactSettingsResponse.Contact> emergencyContacts;

    public List<GetContactSettingsResponse.Contact> getEmergencyContacts() {
        return emergencyContacts;
    }

    public void setEmergencyContacts(List<GetContactSettingsResponse.Contact> emergencyContacts) {
        this.emergencyContacts = emergencyContacts;
    }
}
