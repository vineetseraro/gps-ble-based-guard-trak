package io.akwa.traquer.guardtrack.common.utils;

import android.util.Log;

public class AppLog {
    private final static String TAG = "stryker";
    private final static Boolean LOG_ENABLE = true;

    public static void i(String message) {
        if (LOG_ENABLE&&message!=null) {
            Log.i(TAG, message);
        }
    }

    public static void e(String message) {
        if (LOG_ENABLE&&message!=null) {
            Log.e(TAG, message);
        }
    }

    public static void custom(String TAG, String message) {
        if (LOG_ENABLE&&message!=null) {
            Log.i(TAG, message);
        }
    }

    public static void info(String message) {

        Log.i(TAG + "info", message);

    }

    public static void error(String message) {

        Log.e(TAG + "error", message);

    }

}
