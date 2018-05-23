package io.akwa.traquer.guardtrack.common.tracking;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.content.pm.PackageManager;
import android.location.LocationManager;
import android.os.Build;
import android.support.v4.content.ContextCompat;

import io.akwa.aklogs.NBLogger;

import io.akwa.traquer.guardtrack.common.utils.CurrentLocationUtil;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;


public class LocationReciver extends BroadcastReceiver {
    public LocationReciver() {
    }
    public static final String TAG="LocationReciver";

    @Override
    public void onReceive(Context context, Intent intent) {

        final LocationManager manager = (LocationManager) context.getSystemService( Context.LOCATION_SERVICE );
        if (manager.isProviderEnabled(LocationManager.GPS_PROVIDER ) ) {
           startTracking(context);
            CurrentLocationUtil.update();
            statusUpdate(context,1);
            NBLogger.getLoger().writeLog(context,null,"LOCATION ON");


        }
        else if(manager.isProviderEnabled(LocationManager.NETWORK_PROVIDER))
        {
           startTracking(context);
            CurrentLocationUtil.update();
            NBLogger.getLoger().writeLog(context,null,"LOCATION ON");
            statusUpdate(context,1);


        }
        else
        {
            Tracker.stopTracking();
            statusUpdate(context,0);
            NBLogger.getLoger().writeLog(context,null,"LOCATION OFF");

        }
    }

    public void statusUpdate(Context context,int  location)
    {
        boolean isBluetooth= TraquerScanUtil.isBluetoothEnabled();
        int bluetooth;
        if(isBluetooth)
            bluetooth=1;
        else
            bluetooth=0;
        Util.updateStatus(context,location,bluetooth);
    }

    public void startTracking(Context context)
    {
        if (!PrefUtils.getCode().equals("")&&PrefUtils.getBeaconStatus()) {
            if (Build.VERSION.SDK_INT >= 23) {
                if (ContextCompat.checkSelfPermission(context, android.Manifest.permission.ACCESS_FINE_LOCATION) == PackageManager.PERMISSION_GRANTED) {
                    Tracker.startTracking();
                }
            } else {
                Tracker.startTracking();
            }
        }
    }

}
