package io.akwa.traquer.guardtrack.listener;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface LogoutResponseListener {
    void onLogoutResponse(ApiResponseModel response, NicbitException e);

}