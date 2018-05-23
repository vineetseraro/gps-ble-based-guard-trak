package io.akwa.traquer.guardtrack.ui.trackingsetting;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;

/**
 * Created by rohitkumar on 10/31/17.
 */

public interface TrackingSettingResponseListener {
    void onSettingsResponseReceive(GetTrackingSettingResponse response, NicbitException e);
}
