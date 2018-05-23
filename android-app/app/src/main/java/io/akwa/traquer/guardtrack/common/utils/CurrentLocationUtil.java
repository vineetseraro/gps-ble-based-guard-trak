package io.akwa.traquer.guardtrack.common.utils;

import android.location.Location;
import android.os.Bundle;
import android.support.annotation.NonNull;
import android.support.annotation.Nullable;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationServices;


import java.lang.ref.WeakReference;

import io.akwa.traquer.guardtrack.common.BaseActivity;

public class CurrentLocationUtil implements
        GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener {

    public static double latitude;
    public static double longitude;
    private static WeakReference<CurrentLocationUtil> currentLocationUtil;
    private GoogleApiClient mGoogleApiClient;

    public static CurrentLocationUtil getInstance(BaseActivity baseActivity) {
        if (currentLocationUtil == null) {
            currentLocationUtil = new WeakReference<>(new CurrentLocationUtil(baseActivity));
        }
        return currentLocationUtil.get();
    }

    private CurrentLocationUtil(BaseActivity baseActivity) {
        if (mGoogleApiClient == null) {
            mGoogleApiClient = new GoogleApiClient.Builder(baseActivity)
                    .addConnectionCallbacks(this)
                    .addOnConnectionFailedListener(this)
                    .addApi(LocationServices.API)
                    .build();
        }
    }

    public static boolean isLocationEmpty() {
        return latitude == 0;
    }

    @Override
    public void onConnected(@Nullable Bundle bundle) {
        getLocation();
    }

    private void getLocation() {
        Location mLastLocation = null;
        try {
            mLastLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
        } catch (SecurityException e) {

        }
        if (mLastLocation != null) {
            latitude = mLastLocation.getLatitude();
            longitude = mLastLocation.getLongitude();
        }
    }

    @Override
    public void onConnectionSuspended(int i) {

    }

    @Override
    public void onConnectionFailed(@NonNull ConnectionResult connectionResult) {

    }

    public void onStart() {
        mGoogleApiClient.connect();
    }

    public void onStop() {
        mGoogleApiClient.disconnect();
    }

    public static void update() {
        if (currentLocationUtil != null) {
            currentLocationUtil.get().getLocation();

        }
    }
}
