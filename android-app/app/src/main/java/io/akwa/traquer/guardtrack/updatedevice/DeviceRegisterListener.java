package io.akwa.traquer.guardtrack.updatedevice;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;

/**
 * Created by rohitkumar on 7/12/17.
 */

public interface DeviceRegisterListener {

    void onDeviceUpdate(ApiBaseResponse response, NicbitException e);

}
