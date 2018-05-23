package io.akwa.traquer.guardtrack.listener;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;

public interface ForgotPasswordResponseListener {
    void onForgotPasswordResponse(ApiResponseModel response, NicbitException e);
}
