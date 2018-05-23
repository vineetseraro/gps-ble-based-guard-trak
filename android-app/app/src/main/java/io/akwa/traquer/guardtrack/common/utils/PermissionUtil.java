package io.akwa.traquer.guardtrack.common.utils;

import android.app.Activity;
import android.content.Context;
import android.content.DialogInterface;
import android.content.pm.PackageManager;
import android.support.v4.app.ActivityCompat;
import android.support.v4.content.ContextCompat;
import android.support.v7.app.AlertDialog;



import java.util.List;

import io.akwa.traquer.guardtrack.R;

public class PermissionUtil {

    public static final int PERMISSIONS_REQUEST_ACCESS_FINE_LOCATION = 11;
    public static final int PERMISSIONS_REQUEST_WRITE = 12;
    public static final int PERMISSIONS_PHONE_STATE = 13;
    public static final int PERMISSIONS_GET_ACCOUNTS = 14;
    public static final int PERMISSIONS_PHONE_STATE_LOGIN = 15;
    public static final int PERMISSIONS_REQUEST_READ = 16;
    public static final int PERMISSIONS_CAMERA = 17;
    public static final int PERMISSIONS_AUDIO_RECORD = 18;
    public static final int MULTIPLE_PERMISSIONS = 1;
    static String permission;

    public static boolean checkPermissionGranted(Context activity, String permissions) {
        permission = permissions;
        return (ContextCompat.checkSelfPermission(activity,
                permission)
                == PackageManager.PERMISSION_GRANTED);
    }


    public static void requestPermission(int message, int requestCode, Context context) {
        if (ActivityCompat.shouldShowRequestPermissionRationale((Activity) context,
                permission)) {
            showAlert(message, requestCode, context);
        } else {
            requestPermissionFromUser(requestCode, context);

        }
    }

    public static void showAlert(int message, final int requestCode, final Context context) {
        AlertDialog.Builder adb = new AlertDialog.Builder(context);
        adb.setTitle(R.string.permission_heading);
        adb.setIcon(android.R.drawable.ic_dialog_alert);
        adb.setMessage(message);
        adb.setPositiveButton(R.string.ok, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                requestPermissionFromUser(requestCode, context);
            }
        });

        adb.setNegativeButton(R.string.cancel_button_text, new DialogInterface.OnClickListener() {
            public void onClick(DialogInterface dialog, int which) {
                ((Activity) context).finish();
            }
        });
        adb.show();
    }


    public static void requestPermissionFromUser(int requestCode, Context context) {
        ActivityCompat.requestPermissions((Activity) context,
                new String[]{permission},
                requestCode);
    }

    public static void requestHomePagePermissionFromUser(List<String> listPermissionsNeeded, int requestCode, Context context) {
        if (!listPermissionsNeeded.isEmpty()) {
            ActivityCompat.requestPermissions((Activity) context, listPermissionsNeeded.toArray(new String[listPermissionsNeeded.size()]), MULTIPLE_PERMISSIONS);

        }

    }


}
