package io.akwa.tracker.geofence;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.util.Log;

public  abstract class AkGeofenceReceiver extends BroadcastReceiver {
    private static final String TAG="AkGeofenceReceiver";
    public static final String GEOFENCE_RECEIVER_INTENT = "io.akwa.tracker.geofence.TRACKINGGEOFENCE";

    public abstract void onGeofenceEvent(AkLocation akLocation,GeofenceStatus geofenceStatus);
    public abstract void onGeofenceError(String message);
    GeofenceStatus geofenceStatus=GeofenceStatus.NON;
    double lat,lng;
    boolean isError=true;
    String error_message="";



    @Override
    public void onReceive(Context context, Intent intent) {

        if(intent.hasExtra(AkGeofenceHandlerService.EVENT_STATUS))
            geofenceStatus=(GeofenceStatus)intent.getSerializableExtra(AkGeofenceHandlerService.EVENT_STATUS);

        if(intent.hasExtra(AkGeofenceHandlerService.ERROR_MESSAGE))
            error_message=intent.getStringExtra(AkGeofenceHandlerService.ERROR_MESSAGE);

        isError=intent.getBooleanExtra(AkGeofenceHandlerService.IS_ERROR,true);
        lat=intent.getDoubleExtra(AkGeofenceHandlerService.LONGITUDE,0.0);
        lng=intent.getDoubleExtra(AkGeofenceHandlerService.LONGITUDE,0.0);


        if(!isError) {
            onGeofenceEvent(new AkLocation(lat, lng, ""), geofenceStatus);
        }
        else
        {
            onGeofenceError(error_message);
        }

    }
}
