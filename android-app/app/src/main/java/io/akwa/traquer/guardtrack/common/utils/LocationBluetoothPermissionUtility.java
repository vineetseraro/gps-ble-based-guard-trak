package io.akwa.traquer.guardtrack.common.utils;

import android.app.Activity;
import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.DialogInterface;
import android.content.Intent;
import android.content.IntentSender;
import android.support.v7.app.AlertDialog;
import android.util.Log;

import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.common.api.PendingResult;
import com.google.android.gms.common.api.ResultCallback;
import com.google.android.gms.common.api.Status;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;
import com.google.android.gms.location.LocationSettingsRequest;
import com.google.android.gms.location.LocationSettingsResult;
import com.google.android.gms.location.LocationSettingsStatusCodes;

import java.lang.ref.WeakReference;

import io.akwa.traquer.guardtrack.R;

public class LocationBluetoothPermissionUtility{
    private static final String TAG = "LocationBluetoothPermissionUtility";
    private WeakReference<Context> mContext;
     private static final int REQUEST_CHECK_SETTINGS = 0;
    LocationBluetoothListener locationListener;

   public LocationBluetoothPermissionUtility(Context context){
       this.mContext=new WeakReference<>(context);
   }

    public void setLocationListener(LocationBluetoothListener locationListener) {
        this.locationListener = locationListener;
    }


    public void checkBluetoothOnOff() {
        final BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        if (mBluetoothAdapter == null) {
            locationListener.onBluetoothOFF();
            // Device does not support Bluetooth
        } else {
            if (!mBluetoothAdapter.isEnabled()) {
                AlertDialog.Builder adb = new AlertDialog.Builder(mContext.get());
                adb.setTitle(R.string.bluetooth_permission_heading);
                adb.setMessage(R.string.bluetooth_permission_message);
                adb.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        mBluetoothAdapter.enable();
                        locationListener.onBluetoothON();
//

                    }
                });
                adb.setNegativeButton(R.string.cancel_button_text, new DialogInterface.OnClickListener() {
                    public void onClick(DialogInterface dialog, int which) {
                        locationListener.onBluetoothOFF();

                    }
                });
                adb.show();
            }else{
                locationListener.onBluetoothON();
            }
        }
    }



    public void checkLocationOnOff() {
        GoogleApiClient googleApiClient = new GoogleApiClient.Builder(mContext.get())
                .addApi(LocationServices.API).build();
        googleApiClient.connect();

        LocationRequest locationRequest = LocationRequest.create();
        locationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);
        locationRequest.setInterval(10000);
        locationRequest.setFastestInterval(10000 / 2);

        LocationSettingsRequest.Builder builder = new LocationSettingsRequest.Builder().addLocationRequest(locationRequest);
        builder.setAlwaysShow(true);

        PendingResult<LocationSettingsResult> result = LocationServices.SettingsApi.checkLocationSettings(googleApiClient, builder.build());
        result.setResultCallback(new ResultCallback<LocationSettingsResult>() {
            @Override
            public void onResult(LocationSettingsResult result) {
                final Status status = result.getStatus();
                switch (status.getStatusCode()) {
                    case LocationSettingsStatusCodes.SUCCESS:
                        Log.i(TAG, "All location settings are satisfied.");
                        if(locationListener!=null){
                            locationListener.onLocationON();
                        }
                        break;
                    case LocationSettingsStatusCodes.RESOLUTION_REQUIRED:
                        Log.i(TAG, "Location settings are not satisfied. Show the user a dialog to upgrade location settings ");

                        try {
                            // Show the dialog by calling startResolutionForResult(), and check the result
                            // in onActivityResult().
                            status.startResolutionForResult((Activity) mContext.get(), REQUEST_CHECK_SETTINGS);
                        } catch (IntentSender.SendIntentException e) {
                            Log.i(TAG, "PendingIntent unable to execute request.");
                        }
                        break;
                    case LocationSettingsStatusCodes.SETTINGS_CHANGE_UNAVAILABLE:
                        Log.i(TAG, "Location settings are inadequate, and cannot be fixed here. Dialog not created.");
                        if(locationListener!=null){
                            locationListener.onLocationOFF();
                        }
                        break;
                }
            }
        });
    }


    public void onActivityResult(int requestCode, int resultCode, Intent data) {
        switch (requestCode) {
            // Check for the integer request code originally supplied to startResolutionForResult().
            case REQUEST_CHECK_SETTINGS:
                switch (resultCode) {
                    case Activity.RESULT_OK:
                        Log.i(TAG, "User agreed to make required location settings changes.");
                        if(locationListener!=null){
                            locationListener.onLocationON();
                        }
                        break;
                    case Activity.RESULT_CANCELED:
                        Log.i(TAG, "User chose not to make required location settings changes.");
                        if(locationListener!=null){
                            locationListener.onLocationOFF();
                        }
                        break;
                }
                break;
        }




    }


    public interface LocationBluetoothListener {

        void onLocationON();
        void onLocationOFF();
        void onBluetoothON();
        void onBluetoothOFF();




    }
}
