package io.akwa.traquer.guardtrack.common.tracking;

import android.content.Intent;
import android.widget.Toast;

import io.akwa.aklogs.NBLogger;

import io.akwa.traquer.guardtrack.BaseApplication;
import io.akwa.traquer.guardtrack.NBService;
import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.AppLog;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.Key;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;

public class Tracker {

    public static void startTracking()
    {
       if(!Tracker.isServiceRunning()
               && TraquerScanUtil.isLocationServiceEnable(BaseApplication.getContext())
               && PrefUtils.getBeaconStatus()) {
           Intent intent = new Intent(BaseApplication.getContext(), NBService.class);
           NBLogger.getLoger().writeLog(BaseApplication.getContext(),null,"--- In Tracker.startTracking() ---");
           intent.putExtra(Key.IntentKey.TOKEN, PrefUtils.getSessionToken());
           intent.putExtra(Key.IntentKey.DEVICE_ID, BaseApplication.deviceId);
           intent.putExtra(Key.IntentKey.CLIENT_ID, Constant.CLIENT_ID);
           intent.putExtra(Key.IntentKey.PROJECT_ID, Constant.PROJECT_ID);
           intent.putExtra(Key.IntentKey.CODE, PrefUtils.getCode());
           BaseApplication.getContext().startService(intent);

           AppLog.i("start service activit-----");
           Toast.makeText(BaseApplication.getContext(), BaseApplication.getContext().getText(R.string.app_name)+" service started",Toast.LENGTH_LONG).show();
       }
    }

    public static void stopTracking()
    {
        if(Tracker.isServiceRunning()) {
            Intent intent = new Intent(BaseApplication.getContext(), NBService.class);
            BaseApplication.getContext().stopService(intent);
            NBLogger.getLoger().writeLog(BaseApplication.getContext(),null,"--- In Tracker.stopTracking.......() ---");
            NBService.setServiceSource("");
            Toast.makeText(BaseApplication.getContext(), BaseApplication.getContext().getText(R.string.app_name) + " service stopped", Toast.LENGTH_LONG).show();
        }
    }

    public static boolean isServiceRunning() {
         return (NBService.getServiceSource() != null && NBService.getServiceSource().equals(StringUtils.APP_NAME));

    }
}
