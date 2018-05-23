package io.akwa.traquer.guardtrack.common.zone;

import io.akwa.traquer.guardtrack.common.geofence.GefenceDeviceContract;
import io.akwa.traquer.guardtrack.common.geofence.GeofencDeviceListener;
import io.akwa.traquer.guardtrack.common.geofence.GeofenceApiResponse;
import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;


public class ZoneDevicePresenter implements ZoneDeviceContract.UserActionsListener,ZoneDeviceListener {

    private final ZoneDeviceContract.View mHomeView;

    public ZoneDevicePresenter(ZoneDeviceContract.View mHomeView) {
        this.mHomeView = mHomeView;
    }


    @Override
    public void onZoneRecived(ZonApiResponse response, NicbitException e) {
        mHomeView.onZoneReceived(response, e);
    }

    @Override
    public void getZones() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setZoneDeviceListener(this);
        apiHandler.getBeaconZone();
    }
}
