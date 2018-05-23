package io.akwa.traquer.guardtrack.common.tracking;

import android.content.Context;

public class Util {

    public static void updateStatus(Context context,int location,int bluetooth)
    {
      UpdateHardwareStatus.updateStatus(context,bluetooth,location);
    }


}
