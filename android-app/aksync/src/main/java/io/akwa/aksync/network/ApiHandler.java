package io.akwa.aksync.network;


import io.akwa.aklogs.NBLogger;
import io.akwa.aksync.network.model.ApiLocationModel;
import io.akwa.aksync.network.model.ApiResponseModel;

import java.util.ArrayList;

import retrofit2.Call;
import retrofit2.Callback;
import retrofit2.Response;

/**
 * The type Api handler.
 */
public class ApiHandler {

    /**
     * The constant apiService.
     */
    public static ApiService apiService = ServiceGenerator.createService(ApiService.class);
    /**
     * The Api response listener.
     */
    ApiResponseListener apiResponseListener;

    /**
     * Sets api response listener.
     *
     * @param apiResponseListener the api response listener
     */
    public void setApiResponseListener(ApiResponseListener apiResponseListener) {
        this.apiResponseListener = apiResponseListener;
    }

    /**
     * Do network call.
     *
     * @param <T>  the type parameter
     * @param call the call
     */
    public <T extends ApiResponseModel> void doNetworkCall(Call<T> call) {

        call.enqueue(new Callback<T>() {
            @Override
            public void onResponse(Call<T> call, Response<T> response) {
                if (apiResponseListener != null) {
                    if(response.isSuccessful()) {

                        apiResponseListener.onApiResponse(response.body(), null);
                    }
                    else {
                        apiResponseListener.onApiResponse(null, null);
                    }
                }
            }

            @Override
            public void onFailure(Call<T> call, Throwable t) {
                if (apiResponseListener != null) {
                    apiResponseListener.onApiResponse(null, t);
                }
            }
        });
    }


    /**
     * Update location.
     *
     * @param token             the token
     * @param deviceId          the device id
     * @param apiLocationModels the api location models
     */
    public void updateLocation(String token,String deviceId, ArrayList<ApiLocationModel> apiLocationModels) {
        Call<ApiResponseModel> call = apiService.beaconLocationUpdate(token,deviceId, apiLocationModels);
        doNetworkCall(call);
    }


}



