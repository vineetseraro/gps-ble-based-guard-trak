package io.akwa.traquer.guardtrack.ui.trackingsetting;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;

/**
 * Created by rohitkumar on 11/1/17.
 */

public interface UpdateTrackingSettingResponseListener {
    void onUpdateSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e);

}
