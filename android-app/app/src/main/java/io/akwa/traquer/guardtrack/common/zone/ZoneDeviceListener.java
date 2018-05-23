package io.akwa.traquer.guardtrack.common.zone;


import io.akwa.traquer.guardtrack.common.geofence.GeofenceApiResponse;
import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 9/14/17.
 */

public interface ZoneDeviceListener {

    void onZoneRecived(ZonApiResponse response, NicbitException e);

}
