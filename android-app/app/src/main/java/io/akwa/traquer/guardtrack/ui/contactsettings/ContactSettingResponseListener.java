package io.akwa.traquer.guardtrack.ui.contactsettings;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface ContactSettingResponseListener {
    void onSettingsResponseReceive(GetContactSettingsResponse response, NicbitException e);
}
