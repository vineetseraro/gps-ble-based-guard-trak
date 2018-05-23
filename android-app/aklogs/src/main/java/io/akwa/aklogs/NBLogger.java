package io.akwa.aklogs;

import android.Manifest;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.content.SharedPreferences;
import android.content.pm.PackageManager;
import android.net.Uri;
import android.os.BatteryManager;
import android.os.Build;
import android.os.Environment;
import android.provider.Settings;
import android.support.v4.content.ContextCompat;
import android.text.format.DateUtils;

import java.io.File;
import java.io.FileWriter;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.ArrayList;
import java.util.Date;
import java.util.List;
import java.util.Locale;

public class NBLogger {

    public static final String DIRECTORY_NAME="TraKitGuard/guardtrack";
    public static final String FILENAME="EMP_";
    boolean isLogOn=true;
    String code="";
    final static String NUMBER_CONSTANT="-99999";


    private static final NBLogger inst = new NBLogger();


    private NBLogger() {
        super();
    }

    public void setLogStatus(boolean isLogOn)
    {
        this.isLogOn=isLogOn;
    }

    public static NBLogger getLoger() {
        return inst;
    }


    public synchronized void writeLog(final Context context, final List<NBLogModel> nbLoggers, final String message) {

       if(isLogOn) {
           final String fileName = getDirectory(context);
           new Thread() {
               public void run() {

                   if (nbLoggers != null && nbLoggers.size() > 0) {
                       for (int i = 0; i < nbLoggers.size(); i++) {
                           writeRecords(context, fileName, nbLoggers.get(i));
                       }
                   } else {
                       writeMessage(context, fileName, message);
                   }

               }
           }.start();
       }


    }

    public static ArrayList<Uri> getUriList() {
        ArrayList<Uri> uris = new ArrayList<>();
        File folder = new File(Environment.getExternalStorageDirectory()
                + "/" + DIRECTORY_NAME);
        if (folder.exists()) {
            File[] files = folder.listFiles();
            for (File file : files) {
                Uri serverURI = Uri.fromFile(file);
                uris.add(serverURI);
            }
        }
        File logFolder = new File(Environment.getExternalStorageDirectory()
                + "/" + "logfolder" + "/Log");
        if (logFolder.exists()) {
            File[] files = logFolder.listFiles();
            for (File file : files) {
                Uri serverURI = Uri.fromFile(file);
                uris.add(serverURI);
            }
        }
        return uris;


    }

    public static ArrayList<File> getFiles() {
        ArrayList<File> fileList = new ArrayList<>();
        File folder = new File(Environment.getExternalStorageDirectory()
                + "/" + DIRECTORY_NAME);
        if (folder.exists()) {
            File[] files = folder.listFiles();
            for (File file : files) {
                fileList.add(file);
            }
        }
        File logFolder = new File(Environment.getExternalStorageDirectory()
                + "/" + "logfolder" + "/Log");
        if (logFolder.exists()) {
            File[] files = logFolder.listFiles();
            for (File file : files) {
                fileList.add(file);
            }
        }
        return fileList;


    }

    public String getDirectory(Context context) {

        if (Build.VERSION.SDK_INT >= 23 && ContextCompat.checkSelfPermission(context, Manifest.permission.WRITE_EXTERNAL_STORAGE) != PackageManager.PERMISSION_GRANTED) {
            NBLogger.getLoger().writeLog(context,null,"Required Permission");
        }
        File folder = new File(Environment.getExternalStorageDirectory()
                + "/" + DIRECTORY_NAME);
        if (!folder.exists())
            folder.mkdirs();
        SharedPreferences sharedPref = context.getSharedPreferences("stryker", Context.MODE_PRIVATE);
        code = sharedPref.getString("code", "");
        final String filename = folder.toString() + "/" + FILENAME + getDate() +"_"+ code + ".csv";
        File file = new File(filename);
        synchronized (file) {
            if (!file.exists()) {
                createNewFile(filename);
            }
        }
        return filename;

    }

    public static String getDeviceID(Context context) {

        if (context == null) {
            throw new IllegalArgumentException("context null not required");
        }
        return Settings.Secure.getString(context.getContentResolver(),
                Settings.Secure.ANDROID_ID);
    }


    public static int getBatteryLevel(Context context) {

        if (context == null) {
            throw new IllegalArgumentException("context null not required");
        }
        IntentFilter ifilter = new IntentFilter(Intent.ACTION_BATTERY_CHANGED);
        Intent batteryStatus = context.registerReceiver(null, ifilter);
        return batteryStatus.getIntExtra(BatteryManager.EXTRA_LEVEL, -1);
    }

    public void createNewFile(final String fileName) {
        try {
            FileWriter fw = new FileWriter(fileName, true);
            fw.append("UUID,Maj,Min,Rng,Lat,Lon,Acc,Spd,Alt,Dir,ts" +
                    ",Localts,MQTTts,Logts,Batt,BLE,GPS,WIFI,Pkid,Code,ACK,Message\n")
            .close();
        } catch (Exception e) {
            e.printStackTrace();
        }

    }

    public static String getCurrentTime() {
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("dd-MM-yyyy HH:mm:ss");
            //            Log.i("CSV Time==========",currentDateandTime);
            //            AppLog.i("date---"+date);
            return sdf.format(new Date());
        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static String getDateCurrentTimeZone(Context context, long timeStamp) {
        try {
            DateFormat df = new SimpleDateFormat("HH:mm", Locale.getDefault());
            final String time_chat_s = df.format(timeStamp);
            String date = DateUtils.formatDateTime(context, timeStamp, DateUtils.FORMAT_SHOW_DATE);
            return date + "-" + time_chat_s;

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public void writeRecords(Context context, String fileName, NBLogModel nbLogModel) {
        if(isLogOn) {
            try {
                //    UUID	Maj	Min	Rng	Lat	Lon	Acc	Spd	Alt	Dir	ts(ISO)
//    prv Localts(Local Time zone) MQTTts(ISO)	Logts(ISO)	Batt BLE GPS WIFI	Pkid	Code

                FileWriter fw = new FileWriter(fileName, true);
                fw.append(nbLogModel.getUuid());
                fw.append(',');
                fw.append("" + nbLogModel.getMajor());
                fw.append(',');
                fw.append("" + nbLogModel.getMinor());
                fw.append(',');
                fw.append("" + nbLogModel.getRange());
                fw.append(',');
                fw.append("" + nbLogModel.getLatitude());
                fw.append(',');
                fw.append("" + nbLogModel.getLongitude());
                fw.append(',');
                fw.append("" + nbLogModel.getAccuracy());
                fw.append(',');
                fw.append("" + nbLogModel.getSpeed());
                fw.append(',');
                fw.append("" + nbLogModel.getAlt());
                fw.append(',');
                fw.append(nbLogModel.getDirection());
                fw.append(',');
                fw.append("" + nbLogModel.getTimestamp());
                fw.append(',');
                fw.append(getCurrentTime());
                fw.append(',');
                fw.append("" + System.currentTimeMillis());
                fw.append(',');
                fw.append("" + getCurrentTime());
                fw.append(',');
                fw.append("" + getBatteryLevel(context));
                fw.append(',');
//            TODO need to add ble and gps, wifi in 0 1 here
                fw.append("" + nbLogModel.getIsBluetooth() + ',');
                fw.append(NUMBER_CONSTANT+",");
                fw.append("" + nbLogModel.getIsWifi() + ",");
//            fw.append(""+nbLogModel.isWifi);
//            fw.append(',');
                fw.append("" + nbLogModel.getPkid());
                fw.append(',');
                fw.append("" + nbLogModel.getCode());
                fw.append(',');
                fw.append("" + nbLogModel.isApiSuccess());
                fw.append(',');
                fw.append("NA");
                fw.append(',');
                fw.append('\n');
                fw.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public void writeMessage(Context context, String fileName, String message) {
        if(isLogOn) {

            try {
                long currentTimestamp=System.currentTimeMillis();
                FileWriter fw = new FileWriter(fileName, true);
                fw.append("NA,")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(getCurrentTime()+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(NUMBER_CONSTANT+",")
                        .append(code+ currentTimestamp+",")
                        .append(code+",")
                        .append("NA"+",")
                        .append(message+",");

                fw.append('\n');
                fw.close();
            } catch (Exception e) {
                e.printStackTrace();
            }
        }
    }

    public static String getDate() {
        try {

            DateFormat dateFormat = new SimpleDateFormat("yyyyMMMdd");
            Date date = new Date();
            return dateFormat.format(date);

        } catch (Exception e) {
            e.printStackTrace();
        }
        return "";
    }

    public static void delete3DaysBackProfile() {
        try {
            ArrayList<File> fileList = new ArrayList<>();
            File folder = new File(Environment.getExternalStorageDirectory()
                    + "/" + DIRECTORY_NAME);
            if (folder.exists()) {
                File[] files = folder.listFiles();
                if (files.length > 3) {
                    for (int i = 0; i < (files.length - 3); i++) {
                        files[i].delete();
                    }
                }
            }
        } catch (Exception e) {
            e.printStackTrace();
        }


    }

}
