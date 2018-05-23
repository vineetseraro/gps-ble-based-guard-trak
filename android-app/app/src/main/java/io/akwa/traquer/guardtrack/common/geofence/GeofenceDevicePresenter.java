package io.akwa.traquer.guardtrack.common.geofence;

import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;


public class GeofenceDevicePresenter implements GefenceDeviceContract.UserActionsListener,GeofencDeviceListener {

    private final GefenceDeviceContract.View mHomeView;

    public GeofenceDevicePresenter(GefenceDeviceContract.View mHomeView) {
        this.mHomeView = mHomeView;
    }


    @Override
    public void getGeofences() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setGeofencDeviceListener(this);
        apiHandler.getGeofence();
    }



    @Override
    public void onGeofenceRecived(GeofenceApiResponse response, NicbitException e) {
        mHomeView.onGeofencesReceived(response, e);
    }
}
