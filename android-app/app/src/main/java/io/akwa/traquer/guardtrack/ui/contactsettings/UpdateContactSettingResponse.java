package io.akwa.traquer.guardtrack.ui.contactsettings;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;

/**
 * Created by rohitkumar on 11/1/17.
 */

public interface UpdateContactSettingResponse {
    void onUpdateContactSetting(GetContactSettingsResponse response, NicbitException e);

}
