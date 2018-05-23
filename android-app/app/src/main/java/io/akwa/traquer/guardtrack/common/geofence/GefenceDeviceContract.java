package io.akwa.traquer.guardtrack.common.geofence;

import io.akwa.traquer.guardtrack.exception.NicbitException;

public interface GefenceDeviceContract {

    interface View {
        void onGeofencesReceived(GeofenceApiResponse loginResponse, NicbitException e);
    }

    interface UserActionsListener {
        void getGeofences();
    }
}
