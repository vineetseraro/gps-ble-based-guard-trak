package io.akwa.trakit.rulehandler;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.graphics.BitmapFactory;
import android.graphics.Color;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.util.Log;

import io.akwa.tracker.geofence.AkGeofenceReceiver;
import io.akwa.tracker.geofence.AkLocation;
import io.akwa.tracker.geofence.GeofenceStatus;

public class GeofenceReciver extends AkGeofenceReceiver {

    private static final String TAG="GeofenceReciver";

    @Override
    public void onGeofenceEvent(AkLocation akLocation, GeofenceStatus geofenceStatus) {
        Log.i(TAG,"On GeofenceEvent");
    }

    @Override
    public void onGeofenceError(String message) {
        Log.i(TAG,"on GeofenceError");
    }


}
