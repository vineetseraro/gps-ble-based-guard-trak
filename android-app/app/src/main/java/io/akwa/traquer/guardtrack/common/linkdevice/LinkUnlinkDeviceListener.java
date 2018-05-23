package io.akwa.traquer.guardtrack.common.linkdevice;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

/**
 * Created by rohitkumar on 9/14/17.
 */

public interface LinkUnlinkDeviceListener {

    void onDeviceLink(ApiResponseModel response, NicbitException e);
    void onDeviceUnlink(ApiResponseModel response, NicbitException e);
}
