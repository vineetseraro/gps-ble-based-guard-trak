package io.akwa.traquer.guardtrack.common.tracking;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;
import android.net.ConnectivityManager;
import android.net.NetworkInfo;

import io.akwa.aklogs.NBLogger;

public class NetworkChangeReceiver extends BroadcastReceiver {

    @Override
    public void onReceive(Context context, Intent intent) {
        ConnectivityManager cm = (ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE);
        NetworkInfo activeNetwork = cm.getActiveNetworkInfo();
        if (activeNetwork != null) { // connected to the internet
            if (activeNetwork.getType() == ConnectivityManager.TYPE_WIFI||activeNetwork.getType() == ConnectivityManager.TYPE_MOBILE) {
                NBLogger.getLoger().writeLog(context,null,"Network ON");

            }
        } else {
            NBLogger.getLoger().writeLog(context,null,"Network OFF");

        }

    }
}
