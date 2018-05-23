package io.akwa.traquer.guardtrack.updatedevice;

import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;

public interface RegisterDeviceInformationResponseListener {

    void onDeviceUpdate(ApiBaseResponse response, NicbitException e);
}
