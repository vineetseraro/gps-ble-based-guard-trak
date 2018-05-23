package io.akwa.aksync;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

/**
 * Created by rohitkumar on 8/9/17.
 */

public class Util {

    public static int isWifiOn(Context context)
    {    boolean isWiFi=false;
        ConnectivityManager cm =
                (ConnectivityManager)context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        if(activeNetwork!=null)
            isWiFi = activeNetwork.getType() == ConnectivityManager.TYPE_WIFI;
        return isWiFi?1:0;
    }

    public static int isBluetoothEnabled() {
        try {
             BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
             boolean isBluetooth=mBluetoothAdapter != null && mBluetoothAdapter.isEnabled();
             return isBluetooth?1:0;
        }
        catch (Exception e)
        {
            return 0;
        }

    }

}


