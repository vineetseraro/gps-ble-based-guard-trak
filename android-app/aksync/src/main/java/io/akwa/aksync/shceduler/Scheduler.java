package io.akwa.aksync.shceduler;

import android.os.Handler;

/**
 * Created by rohitkumar on 7/12/17.
 */

public class Scheduler {

    Handler handler;
    OnSchedulerUpdate onSchedulerUpdate;
    long time;
    boolean isSchedulerRunning;

    public Scheduler(OnSchedulerUpdate onSchedulerUpdate,long time)
    {
        this.onSchedulerUpdate=onSchedulerUpdate;
        handler=new Handler();
        this.time=time;
    }

    Runnable runnable=new Runnable() {
        @Override
        public void run() {

            if(onSchedulerUpdate!=null)
                onSchedulerUpdate.onSchedulerUpdate();
            handler.postDelayed(runnable,time);
        }
    };


    public void startScheduler()
    {

        if(handler!=null) {
            isSchedulerRunning=true;
            handler.postDelayed(runnable, time);
        }
    }

    public void stopScheduler()
    {
        isSchedulerRunning=false;
        handler.removeCallbacks(runnable);
    }



    public boolean isSchedulerRunning()
    {
        return  isSchedulerRunning;
    }

}
