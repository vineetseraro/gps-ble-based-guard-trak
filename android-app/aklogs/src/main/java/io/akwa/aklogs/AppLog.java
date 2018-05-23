package io.akwa.aklogs;

import android.util.Log;

/**
 * The type App log.
 */
public class AppLog {
    private final static String TAG = "nblogs";
    private final static Boolean LOG_ENABLE = true;

    /**
     * .
     *
     * @param message the message
     */
    public static void i(String message) {
        if (LOG_ENABLE) {
            Log.i(TAG, message);
        }
    }

    /**
     * E.
     *
     * @param message the message
     */
    public static void e(String message) {
        if (LOG_ENABLE) {
            Log.e(TAG, message);
        }
    }

    /**
     * Custom.
     *
     * @param TAG     the tag
     * @param message the message
     */
    public static void custom(String TAG, String message) {
        if (LOG_ENABLE) {
            Log.i(TAG, message);
        }
    }

    /**
     * Info.
     *
     * @param message the message
     */
    public static void info(String message) {

        Log.i(TAG + "info", message);

    }

    /**
     * Error.
     *
     * @param message the message
     */
    public static void error(String message) {

        Log.e(TAG + "error", message);

    }

}
