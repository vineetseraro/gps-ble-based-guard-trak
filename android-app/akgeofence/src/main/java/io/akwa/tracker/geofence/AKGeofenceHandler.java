package io.akwa.tracker.geofence;


import android.Manifest;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.preference.PreferenceManager;
import android.provider.SyncStateContract;
import android.support.annotation.NonNull;
import android.support.v4.app.ActivityCompat;
import android.util.Log;
import android.view.View;
import android.widget.Toast;

import com.google.android.gms.location.Geofence;
import com.google.android.gms.location.GeofencingClient;
import com.google.android.gms.location.GeofencingRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.tasks.OnCompleteListener;
import com.google.android.gms.tasks.Task;

import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

import static android.content.ContentValues.TAG;

public class AKGeofenceHandler implements OnCompleteListener<Void> {
    Context context;
    private GeofencingClient mGeofencingClient;
    private List<Geofence> mGeofenceList;
    private PendingIntent mGeofencePendingIntent;
    private List<AkLocation> akLocations;

    public AKGeofenceHandler( Context context, List<AkLocation> akLocations)
    {
        mGeofenceList=new ArrayList<>();
        this.context=context;
        this.akLocations=akLocations;
        createGeofenceList();
        mGeofencingClient = LocationServices.getGeofencingClient(context);

    }

    public void startGeofenceing()
    {
        addGeofences();
    }

    public void stopGeofencing()
    {
        removeGeofences();
    }


    private void updateGeofencesAdded(boolean added) {
        PreferenceManager.getDefaultSharedPreferences(context)
                .edit()
                .putBoolean(Constant.GEOFENCES_ADDED_KEY, added)
                .apply();
    }




    private GeofencingRequest getGeofencingRequest() {
        GeofencingRequest.Builder builder = new GeofencingRequest.Builder();
        builder.setInitialTrigger(GeofencingRequest.INITIAL_TRIGGER_ENTER);

        builder.addGeofences(mGeofenceList);

        // Return a GeofencingRequest.
        return builder.build();
    }



    @SuppressWarnings("MissingPermission")
    private void addGeofences()
    {
        if (!checkPermissions()) {
           throw  new SecurityException("Location permission not granted");
        }

        mGeofencingClient.addGeofences(getGeofencingRequest(), getGeofencePendingIntent())
                .addOnCompleteListener(this);
    }



    private boolean checkPermissions() {
        int permissionState = ActivityCompat.checkSelfPermission(context,
                Manifest.permission.ACCESS_FINE_LOCATION);
        return permissionState == PackageManager.PERMISSION_GRANTED;
    }


    private PendingIntent getGeofencePendingIntent() {

        if (mGeofencePendingIntent != null) {
            return mGeofencePendingIntent;
        }
        Intent intent = new Intent(context, AkGeofenceHandlerService.class);
        return PendingIntent.getService(context, 0, intent, PendingIntent.FLAG_UPDATE_CURRENT);
    }



    @SuppressWarnings("MissingPermission")
    private void removeGeofences() {
        if (!checkPermissions()) {
            throw  new SecurityException("Location permission not granted");
        }
        mGeofencingClient.removeGeofences(getGeofencePendingIntent()).addOnCompleteListener(this);
    }




    @Override
    public void onComplete(@NonNull Task<Void> task) {

        if (task.isSuccessful()) {
            updateGeofencesAdded(!getGeofencesAdded());

        } else {
            // Get the status code for the error and log it using a user-friendly message.
            String errorMessage = GeofenceErrorMessages.getErrorString(context, task.getException());
            Log.w(TAG, errorMessage);
        }
    }


    private boolean getGeofencesAdded() {
        return PreferenceManager.getDefaultSharedPreferences(context).getBoolean(
               Constant.GEOFENCES_ADDED_KEY, false);
    }


    public void createGeofenceList()
    {
        for (AkLocation akLocation:akLocations) {
            mGeofenceList.add(new Geofence.Builder()
                    .setRequestId(akLocation.getLocationTitle())
                    // Set the circular region of this geofence.
                    .setCircularRegion(
                            akLocation.getLat(),
                            akLocation.getLng(),
                            Constant.GEOFENCE_RADIUS_IN_METERS
                    )
                    .setExpirationDuration(Geofence.NEVER_EXPIRE)
                    .setTransitionTypes(Geofence.GEOFENCE_TRANSITION_ENTER |
                            Geofence.GEOFENCE_TRANSITION_EXIT)
                    .build());
        }
    }

}
