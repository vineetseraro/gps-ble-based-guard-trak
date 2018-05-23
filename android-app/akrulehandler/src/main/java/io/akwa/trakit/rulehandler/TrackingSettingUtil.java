package io.akwa.trakit.rulehandler;

import com.google.gson.Gson;

import java.text.SimpleDateFormat;
import java.util.Calendar;
import java.util.Date;


/**
 * Created by rohitkumar on 11/1/17.
 */

public class TrackingSettingUtil {

    public static boolean isTrackingTime(String trackingTimeResponse)
    {

        if(trackingTimeResponse!=null&&!trackingTimeResponse.equals(""))
        {
            Gson gson=new Gson();
            GetTrackingSettingResponse trackingSettingResponse=gson.fromJson(trackingTimeResponse,GetTrackingSettingResponse.class);
            if(trackingSettingResponse!=null)
            {
                final Calendar c = Calendar.getInstance();
                int hour = c.get(Calendar.HOUR_OF_DAY);
                int minute = c.get(Calendar.MINUTE);
                int day=c.get(Calendar.DAY_OF_WEEK);
                int sec=c.get(Calendar.SECOND);
                Date fromDate=null;
                Date toDate=null;
                Date todayDate=getDate(hour+":"+minute+":"+sec);

                if(day==1)
                {//Today is Sunday
                    GetTrackingSettingResponse.Sunday sunday=trackingSettingResponse.getData().getSunday().get(0);
                    fromDate=getDate(sunday.getFrom());
                    toDate=getDate(sunday.getTo());
                }
                else if(day==7)
                {
                    //Today is Saturday
                    GetTrackingSettingResponse.Saturday saturday=trackingSettingResponse.getData().getSaturday().get(0);
                    fromDate=getDate(saturday.getFrom());
                    toDate=getDate(saturday.getTo());
                }
                else
                {
                    //Today is WeekDays
                     GetTrackingSettingResponse.Weekday weekdays=trackingSettingResponse.getData().getWeekdays().get(0);
                     fromDate=getDate(weekdays.getFrom());
                     toDate=getDate(weekdays.getTo());

                }
                if(fromDate!=null&&toDate!=null&&todayDate.after(fromDate)&&todayDate.before(toDate))
                    return true;
                else
                    return false;

            }
        }
        return true;
    }


    public static int timeInHours(String time)
    {
        String hours=time.substring(0,time.indexOf(":"));
        return Integer.parseInt(hours);
    }

    public static int timeInMint(String time)
    {
        String mint=time.substring(time.indexOf(":")+1,time.lastIndexOf(":")-1);
        return Integer.parseInt(mint);
    }

    public static Date getDate(String time)
    {
        Date date=null;
        try {
            SimpleDateFormat sdf = new SimpleDateFormat("HH:mm:ss");
            date = sdf.parse(time);
            return date;
        }
        catch (Exception e)
        {
            e.printStackTrace();
        }
        return date;
    }




}
