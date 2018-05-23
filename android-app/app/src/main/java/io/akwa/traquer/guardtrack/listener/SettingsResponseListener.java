package io.akwa.traquer.guardtrack.listener;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface SettingsResponseListener {
    void onSettingsResponseReceive(ApiResponseModel response, NicbitException e);

}
