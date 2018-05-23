package io.akwa.aksync.network;


import io.akwa.aksync.network.model.ApiLocationModel;
import io.akwa.aksync.network.model.ApiResponseModel;

import java.util.List;

import retrofit2.Call;
import retrofit2.http.Body;
import retrofit2.http.Header;
import retrofit2.http.POST;

/**
 * The interface Api service.
 */
public interface ApiService {

    /**
     * Beacon location update call.
     *
     * @param token             the token
     * @param deviceId          the device id
     * @param apiLocationModels the api location models
     * @return the call
     */
    @POST("tasks/api/scanLocation")
    Call<ApiResponseModel> beaconLocationUpdate(
            @Header("sid") String token,
            @Header("deviceId") String deviceId,
            @Body List<ApiLocationModel> apiLocationModels
    );
}