package io.akwa.aktracking;

import android.content.Context;
import android.location.Location;
import android.os.Bundle;
import android.provider.Settings;
import android.util.Log;

import com.google.android.gms.common.ConnectionResult;
import com.google.android.gms.common.api.GoogleApiClient;
import com.google.android.gms.location.LocationListener;
import com.google.android.gms.location.LocationRequest;
import com.google.android.gms.location.LocationServices;

/**
 * The type Location handler.
 */
public class LocationHandler implements GoogleApiClient.ConnectionCallbacks, GoogleApiClient.OnConnectionFailedListener, LocationListener {
    /**
     * The Tag.
     */
    final String TAG = "LocationHandler";
    /**
     * The Context.
     */
    Context context;
    /**
     * The M google api client.
     */
    protected GoogleApiClient mGoogleApiClient;
    /**
     * The M location request.
     */
    protected LocationRequest mLocationRequest;
    /**
     * The M current location.
     */
    protected Location mCurrentLocation;
    /**
     * The Previous location.
     */
    Location previousLocation;
    /**
     * The Location scan interval.
     */
    int locationScanInterval = 1;
    private LocationChangeListener locationChangeListener;
    /**
     * Instantiates a new Location handler.
     *
     * @param context                the context
     * @param locationScanInterval   the location scan interval
     * @param locationChangeListener the location change listener
     */

    boolean isLocationUpdateRunning;


    public LocationHandler(Context context, int locationScanInterval, LocationChangeListener locationChangeListener) {
        this.context = context;
        this.locationScanInterval = locationScanInterval;
        this.locationChangeListener = locationChangeListener;
        buildGoogleApiClient();
    }

    public LocationHandler(Context context) {
        this.context = context;
        buildGoogleApiClient();
    }

    /**
     * Build google api client.
     */
    public synchronized void buildGoogleApiClient() {
        mGoogleApiClient = new GoogleApiClient.Builder(context)
                .addConnectionCallbacks(this)
                .addOnConnectionFailedListener(this)
                .addApi(LocationServices.API)
                .build();
        createLocationRequest();
        connectGoogleApi();
    }


    @Override
    public void onConnected(Bundle bundle) {
        AppLog.i("on location connected------");
        if(this.locationChangeListener!=null)
        this.locationChangeListener.onLocationApiConnected(true);

    }

    public Location getLastKnownLocation()
    {
        try {
            if (mGoogleApiClient.isConnected()) {
                mCurrentLocation = LocationServices.FusedLocationApi.getLastLocation(mGoogleApiClient);
                return mCurrentLocation;
            }
            else
            {
                return null;
            }
        }
        catch (SecurityException e)
        {
            return  null;
        }


    }

    @Override
    public void onConnectionSuspended(int i) {
        Log.i(TAG, "Connection suspended");
        mGoogleApiClient.connect();
        this.locationChangeListener.onLocationApiConnected(false);
    }

    @Override
    public void onConnectionFailed(ConnectionResult connectionResult) {
        Log.i(TAG, "Connection failed: ConnectionResult.getErrorCode() = " + connectionResult.getErrorCode());
    }

    /**
     * Connect google api.
     */
    public void connectGoogleApi() {
        if (mGoogleApiClient != null)
            mGoogleApiClient.connect();
    }

    /**
     * Dis connect google api.
     */
    public void disConnectGoogleApi() {
        if (mGoogleApiClient != null && mGoogleApiClient.isConnected())
            mGoogleApiClient.disconnect();
    }

    @Override
    public void onLocationChanged(Location location) {
        AppLog.i("on location changed");
        boolean isMockLocation = isMockLocation(context, location);
        if (!isMockLocation) {
            mCurrentLocation = location;
            locationChangeListener.onLocationUpdate(mCurrentLocation);
        }
    }

    /**
     * Is mock location boolean.
     *
     * @param context  the context
     * @param location the location
     * @return the boolean
     */
    public static boolean isMockLocation(Context context, Location location) {

        boolean isMock;
        if (android.os.Build.VERSION.SDK_INT >= 18) {
            isMock = location.isFromMockProvider();
        } else {
            isMock = !Settings.Secure.getString(context.getContentResolver(), Settings.Secure.ALLOW_MOCK_LOCATION).equals("0");
        }
        return isMock;
    }

    /**
     * Start location updates.
     */
    public void startLocationUpdates() {
        try {
            if (mLocationRequest != null)
                isLocationUpdateRunning=true;
                LocationServices.FusedLocationApi.requestLocationUpdates(mGoogleApiClient, mLocationRequest, this);
        } catch (SecurityException e) {
            e.printStackTrace();
        }


    }

    /**
     * Create location request.
     */
    protected void createLocationRequest() {
        if (locationScanInterval == 0)
            locationScanInterval = 10;
        mLocationRequest = new LocationRequest();
        mLocationRequest.setSmallestDisplacement(10);
        mLocationRequest.setInterval(locationScanInterval * 1000 * 60);
        mLocationRequest.setFastestInterval((locationScanInterval) * 1000 * 60);

        mLocationRequest.setPriority(LocationRequest.PRIORITY_HIGH_ACCURACY);


    }

    /**
     * Stop location updates.
     */
    public void stopLocationUpdates() {
        if (mGoogleApiClient != null && mGoogleApiClient.isConnected()) {
            isLocationUpdateRunning=false;
            LocationServices.FusedLocationApi.removeLocationUpdates(mGoogleApiClient, this);
        }
    }

    /**
     * Sets location listener.
     *
     * @param locationChangeListener the location change listener
     */
    public void setLocationListener(LocationChangeListener locationChangeListener) {
        this.locationChangeListener = locationChangeListener;
    }

    /**
     * The interface Location change listener.
     */
    public interface LocationChangeListener {
        /**
         * On location update.
         *
         * @param location the location
         */
        int interfaceVar=1;
        void onLocationUpdate(Location location);
        void onLocationApiConnected(boolean isConnected);
    }

    public boolean isLocationUpdateRunning()
    {
        return isLocationUpdateRunning;
    }

}