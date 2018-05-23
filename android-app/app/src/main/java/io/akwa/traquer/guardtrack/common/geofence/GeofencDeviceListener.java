package io.akwa.traquer.guardtrack.common.geofence;


import io.akwa.traquer.guardtrack.exception.NicbitException;

/**
 * Created by rohitkumar on 9/14/17.
 */

public interface GeofencDeviceListener {

    void onGeofenceRecived(GeofenceApiResponse response, NicbitException e);

}
