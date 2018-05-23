package io.akwa.traquer.guardtrack.common.updatedevice;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface DeviceInformationResponseListener {

    void onDeviceUpdate(ApiResponseModel response, NicbitException e);
}
