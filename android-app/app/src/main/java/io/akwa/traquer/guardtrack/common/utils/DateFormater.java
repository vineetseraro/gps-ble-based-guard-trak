package io.akwa.traquer.guardtrack.common.utils;


import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;
import java.util.TimeZone;

public class DateFormater {

    static DateFormat displayDateFormat = new SimpleDateFormat("dd MMM''yy");
    public static DateFormat apiDateFormat = new SimpleDateFormat("yyyy-MM-dd");
    static DateFormat writeFormat = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss");
    static DateFormat newWriteFormat=new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss'Z'");

    static DateFormat apiDateTimeFormat = new SimpleDateFormat("dd/MM/yyyy hh:mm a");


    public static String getDateTime(String s) {
        Date readDate = null;
        if (s != null && !s.isEmpty()) {
            try {
                writeFormat.setTimeZone(TimeZone.getTimeZone(getPreferredTimeZone(readDate)));
                readDate = writeFormat.parse(s);
                AppLog.i("date is ----" + readDate.toString());
            } catch (Exception e) {
//                DBUtil.setLogMessage("Date Format Exception", DateFormater.getCurrentDateTime(), e.getMessage()
//                        , StringUtils.APPNAME, getCurrentAppVersion(), AccoLogType.WARNING.getLogType());
                AppLog.i("date is ----" + e);
            }
        }

        return getApiDisplayTime(readDate);

    }

    public static Date getDateFromString(String s) {
        Date readDate = null;
        if (s != null && !s.isEmpty()) {
            try {
                readDate = apiDateFormat.parse(s);
                AppLog.i("date is ----" + readDate.toString());
//                readFormat.setTimeZone(TimeZone.getTimeZone(getPreferredTimeZone(readDate)));
            } catch (Exception e) {
//                DBUtil.setLogMessage("Date Format Exception", DateFormater.getCurrentDateTime(), e.getMessage()
//                        , StringUtils.APPNAME, getCurrentAppVersion(), AccoLogType.WARNING.getLogType());
                AppLog.i("date is ----" + e);
            }
        }

        return readDate;

    }

    public static String getApiDisplayTime(Date date) {
        String displayString = "";
        try {
            //apiDateTimeFormat.setTimeZone(TimeZone.getTimeZone("IST"));
            displayString = apiDateTimeFormat.format(date);
        } catch (Exception e) {
        }
        return displayString;
    }
    public static String getDisplayTime(Date date) {
        String displayString = "";
        try {
            displayString = displayDateFormat.format(date);
        } catch (Exception e) {
        }
        return displayString;
    }

    public static String getApiDate(Date date) {
        String displayString = "";
        try {
            displayString = apiDateFormat.format(date);
        } catch (Exception e) {
        }
        return displayString;
    }

    public static Date getTodayDate() {
        try {
            Calendar calendar = Calendar.getInstance();
            return calendar.getTime();
        } catch (Exception e) {
            return null;
        }
    }

    public static boolean compareDateOnly(Date date1, Date date2){
        Calendar cal1 = Calendar.getInstance();
        Calendar cal2 = Calendar.getInstance();
        cal1.setTime(date1);
        cal2.setTime(date2);
        return cal1.get(Calendar.YEAR) == cal2.get(Calendar.YEAR) &&
                cal1.get(Calendar.DAY_OF_YEAR) == cal2.get(Calendar.DAY_OF_YEAR);
    }


    private static String getPreferredTimeZone(Date date) {

        boolean inDaylightTime = TimeZone.getTimeZone("America/Los_Angeles").inDaylightTime(new Date());
        return  "UTC +5:30";
        /*if (inDaylightTime) {
            timeZone = "GMT-7:00";
        } else {
            timeZone = "GMT-8:00";
        }*/
       // return timeZone;
    }

    public static String convertEpochToHMmSs(long epoch){

        int minutes = (int) (epoch / 1000 / 60);
        if(minutes>0) {
            int hr = minutes / 60;
            int min = minutes % 60;
            String time = String.format("%02dh %02dmin", hr, min);
            return time;
        }
        else {
            return  "";
        }

    }

    public static String computeDiff(String lastUpdated) {

        String time = "";
//        Date date1 = getDateTime(lastUpdated);
        Date date1=null;
        long different = (new Date()).getTime() - date1.getTime();
        long secondsInMilli = 1000;
        long minutesInMilli = secondsInMilli * 60;
        long hoursInMilli = minutesInMilli * 60;
        long daysInMilli = hoursInMilli * 24;

        long elapsedDays = different / daysInMilli;
        different = different % daysInMilli;

        long elapsedHours = different / hoursInMilli;
        different = different % hoursInMilli;

        long elapsedMinutes = different / minutesInMilli;

        if (elapsedDays==0 && elapsedHours==0 && elapsedMinutes==0){
            time="Just Now";
        }else if (elapsedDays>0){
            time=elapsedDays+" Day "+elapsedHours+" Hr. "+elapsedMinutes+" Min. before" ;
        }else if (elapsedHours>0){
            time=elapsedHours+" Hr. "+elapsedMinutes+" Min. before" ;
        }else if (elapsedMinutes>0){
            time=elapsedMinutes+" Min. before" ;
        }
        return time;
    }

    public static Date getDate(String s) {
        Date readDate = null;
        if (s != null && !s.isEmpty()) {
            try {
                readDate = apiDateFormat.parse(s);
//                readFormat.setTimeZone(TimeZone.getTimeZone(getPreferredTimeZone(readDate)));
            } catch (Exception e) {
//                DBUtil.setLogMessage("Date Format Exception", DateFormater.getCurrentDateTime(), e.getMessage()
//                        , StringUtils.APPNAME, getCurrentAppVersion(), AccoLogType.WARNING.getLogType());
                AppLog.i("date is ----" + e);
            }
        }
        return readDate;
    }

}
