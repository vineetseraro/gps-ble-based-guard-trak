package io.akwa.tracker.geofence;

import android.app.IntentService;
import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.location.Location;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.text.TextUtils;
import android.util.Log;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingEvent;

import java.util.ArrayList;
import java.util.List;

import static android.content.ContentValues.TAG;


public class AkGeofenceHandlerService extends IntentService {

    public final static String TAG="AkGHandler";
    public final static String LATITUDE="latitude";
    public final static String LONGITUDE="longitude";
    public final static String EVENT_STATUS="event_status";
    public final static String IS_ERROR="is_error";
    public final static String ERROR_MESSAGE="error_message";
    public AkGeofenceHandlerService() {
        super("AkGeofenceHandlerService");
    }


    @Override
    protected void onHandleIntent(Intent intent) {

        Log.i(TAG,"AKGeofenceHandler");
        GeofencingEvent geofencingEvent = GeofencingEvent.fromIntent(intent);
        if (geofencingEvent.hasError()) {
            String errorMessage = GeofenceErrorMessages.getErrorString(this,
                    geofencingEvent.getErrorCode());
            Log.e(TAG, errorMessage);
            return;

        }
        int geofenceTransition = geofencingEvent.getGeofenceTransition();
        Intent broadCastIntent = new Intent(AkGeofenceReceiver.GEOFENCE_RECEIVER_INTENT);

        if (geofenceTransition == Geofence.GEOFENCE_TRANSITION_ENTER) {

            Location location= geofencingEvent.getTriggeringLocation();
            broadCastIntent.putExtra(LATITUDE,location.getLatitude());
            broadCastIntent.putExtra(LONGITUDE,location.getLongitude());
            broadCastIntent.putExtra(EVENT_STATUS,GeofenceStatus.ENTER);
            broadCastIntent.putExtra(IS_ERROR,false);


        }
        else if(geofenceTransition == Geofence.GEOFENCE_TRANSITION_EXIT)
        {   Location location= geofencingEvent.getTriggeringLocation();
            broadCastIntent.putExtra(LATITUDE,location.getLatitude());
            broadCastIntent.putExtra(LONGITUDE,location.getLongitude());
            broadCastIntent.putExtra(EVENT_STATUS,GeofenceStatus.EXIT);
            broadCastIntent.putExtra(IS_ERROR,false);
        }
        else {
            broadCastIntent.putExtra(EVENT_STATUS,GeofenceStatus.NON);
            broadCastIntent.putExtra(IS_ERROR,true);
            broadCastIntent.putExtra(ERROR_MESSAGE,getString(R.string.geofence_transition_invalid_type, geofenceTransition));
            Log.e(TAG, getString(R.string.geofence_transition_invalid_type, geofenceTransition));
        }
        sendBroadcast(broadCastIntent);
    }


    private String getTransitionString(int transitionType) {
        switch (transitionType) {
            case Geofence.GEOFENCE_TRANSITION_ENTER:
                return getString(R.string.geofence_transition_entered);
            case Geofence.GEOFENCE_TRANSITION_EXIT:
                return getString(R.string.geofence_transition_exited);
            default:
                return getString(R.string.unknown_geofence_transition);
        }
    }

    private String getGeofenceTransitionDetails(
            int geofenceTransition,
            List<Geofence> triggeringGeofences) {

        String geofenceTransitionString = getTransitionString(geofenceTransition);

        // Get the Ids of each geofence that was triggered.
        ArrayList<String> triggeringGeofencesIdsList = new ArrayList<>();
        for (Geofence geofence : triggeringGeofences) {
            triggeringGeofencesIdsList.add(geofence.getRequestId());
        }
        String triggeringGeofencesIdsString = TextUtils.join(", ",  triggeringGeofencesIdsList);

        return geofenceTransitionString + ": " + triggeringGeofencesIdsString;
    }


}
