package io.akwa.traquer.guardtrack.common.zone;

import io.akwa.traquer.guardtrack.common.geofence.GeofenceApiResponse;
import io.akwa.traquer.guardtrack.exception.NicbitException;

public interface ZoneDeviceContract {

    interface View {
        void onZoneReceived(ZonApiResponse loginResponse, NicbitException e);
    }

    interface UserActionsListener {
        void getZones();
    }
}
