package io.akwa.aksync.network;


import io.akwa.aksync.network.model.ApiResponseModel;

/**
 * The interface Api response listener.
 */
public interface ApiResponseListener {
    /**
     * On api response.
     *
     * @param response the response
     * @param t        the t
     */
    void onApiResponse(ApiResponseModel response, Throwable t);
}
