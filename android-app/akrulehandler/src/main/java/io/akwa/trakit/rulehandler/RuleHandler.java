package io.akwa.trakit.rulehandler;

import android.app.NotificationManager;
import android.app.PendingIntent;
import android.content.Context;
import android.content.Intent;
import android.content.IntentFilter;
import android.graphics.Color;
import android.location.Location;
import android.media.RingtoneManager;
import android.net.Uri;
import android.support.v4.app.NotificationCompat;
import android.support.v4.app.TaskStackBuilder;
import android.widget.Toast;

import com.kontakt.sdk.android.ble.device.BeaconRegion;
import com.kontakt.sdk.android.common.profile.IBeaconDevice;
import com.kontakt.sdk.android.common.profile.IBeaconRegion;

import io.akwa.akcore.BeaconData;
import io.akwa.akcore.ZoneBeacon;
import io.akwa.aklogs.NBLogger;
import io.akwa.akproximity.kontakt.KontaktBeaconScannerAuto;
import io.akwa.akproximity.kontakt.Util;
import io.akwa.aksync.SyncService;
import io.akwa.aksync.shceduler.OnSchedulerUpdate;
import io.akwa.aksync.shceduler.Scheduler;
import io.akwa.aktracking.LocationHandler;

import java.text.DecimalFormat;
import java.util.HashSet;
import java.util.List;
import java.util.Set;

import io.akwa.tracker.geofence.AKGeofenceHandler;
import io.akwa.tracker.geofence.AkGeofenceReceiver;
import io.akwa.tracker.geofence.AkLocation;
import io.akwa.tracker.geofence.GeofenceStatus;

public class RuleHandler implements LocationHandler.LocationChangeListener, KontaktBeaconScannerAuto.KontaktBeaconListener, OnSchedulerUpdate {
    private static final String TAG="Rule";
    private Location mLocation;
    private SyncService syncService;
    private LocationHandler locationHandler;
    Scheduler scheduler;

    KontaktBeaconScannerAuto beaconScanner;
    AKTrackingRule akTrackingRule;
    Context context;
    CustomeReciver customeReciver=new CustomeReciver();
    AKGeofenceHandler akGeofenceHandler=null;
    Config config;

    boolean isLocationApiConnected;
    GeofenceStatus status=GeofenceStatus.NON;
    List<AkLocation> akLocations;
    List<ZoneBeacon> zoneBeacons;

    public RuleHandler(Config config,AKTrackingRule akTrackingRule, Context context,List<ZoneBeacon> zoneBeacons) {
        this.zoneBeacons=zoneBeacons;
        this.akTrackingRule = akTrackingRule;
        this.context = context;
        this.config=config;
        init();

    }

    private  void init()
    {

        registerGeofence();
        if(scheduler==null)
        {
            scheduler = new Scheduler(this,60*1000);
            NBLogger.getLoger().writeLog(context, null, "--- Scheduler instantiated -------");
        }
        else
        {
            NBLogger.getLoger().writeLog(context, null, "--- Scheduler already instantiated -------");

        }

        if (syncService == null) {
            syncService = new SyncService(context);
            NBLogger.getLoger().writeLog(context, null, "--- syncService instantiated -------");

        } else {
            NBLogger.getLoger().writeLog(context, null, "--- syncService already instantiated -------");
        }

        if (beaconScanner == null) {
            beaconScanner = new KontaktBeaconScannerAuto(20, context, this,this.zoneBeacons);
            NBLogger.getLoger().writeLog(context, null, "--- Scanner  instantiated -------");
            beaconScanner.startScanning();

        } else {
            NBLogger.getLoger().writeLog(context, null, "--- Scanner already instantiated -------");

        }

        if (locationHandler == null) {
            locationHandler = new LocationHandler(context, 1, this);
            NBLogger.getLoger().writeLog(context, null, "--- locationHandler instantiated -------");
        } else {
            NBLogger.getLoger().writeLog(context, null, "--- locationHandler already instantiated -------");
        }

       // startTracking();

    }


    public void start(List<AkLocation> geoLocations)
    {

        akLocations=geoLocations;

        akGeofenceHandler=new AKGeofenceHandler(context,akLocations);
       /// akGeofenceHandler.startGeofenceing();

    }

    private void registerGeofence()
    {
               IntentFilter intentFilter = new IntentFilter(GeofenceReciver.GEOFENCE_RECEIVER_INTENT);
                context.registerReceiver( customeReciver , intentFilter);

    }
    private  void unRegisterGeofence()
    {


        if(customeReciver!=null)
            context.unregisterReceiver(customeReciver);
    }


    public void stop()
    {
        NBLogger.getLoger().writeLog(context, null, "Ruler Handler Stop----");
        unRegisterGeofence();
       // akGeofenceHandler.stopGeofencing();
        if(locationHandler!=null) {
            locationHandler.stopLocationUpdates();
            locationHandler.disConnectGoogleApi();
        }
        if(beaconScanner!=null)
            beaconScanner.stopRanginBeacon();
        if(scheduler!=null)
            scheduler.stopScheduler();

    }

    @Override
    public void onLocationUpdate(Location location) {
        mLocation = location;
        NBLogger.getLoger().writeLog(context, null, "Location Update Call----");
        if(TrackingSettingUtil.isTrackingTime(config.getTrackingTimeJson())) {
            if (beaconScanner != null) {
               // beaconScanner.startScanning();
                NBLogger.getLoger().writeLog(context, null, "start beacon scan----");
            } else {
                NBLogger.getLoger().writeLog(context, null, "No Scanner Found   or Initlization----");
            }
        }


    }

    @Override
    public void onLocationApiConnected(boolean isConnected) {
        this.isLocationApiConnected=isConnected;
        NBLogger.getLoger().writeLog(context, null, "Location API connected----");
        startTracking();

    }

    @Override
    public void onScanningComplete(Set<BeaconData> scannedBeaconList) {
        scannedBeaconList.add(config.getBeaconData());
      /*  if (beaconScanner != null)
            beaconScanner.stopRanginBeacon();*/
        NBLogger.getLoger().writeLog(context, null, "on scan complete----");
        if (scannedBeaconList.size() > 0) {
            syncService.syncBeaconAndLocationData(context, mLocation, scannedBeaconList, config.getApiToken(), config.getDeviceId(), config.getClientId(), config.getProjectId(), config.getCode(),false);
        }
    }

    @Override
    public void onRegionEnter(IBeaconRegion iBeaconRegion) {
        sendNotification("You Enter in "+iBeaconRegion.getIdentifier());
        Toast.makeText(context,"Enter Region",Toast.LENGTH_LONG).show();

        BeaconData beaconData=new BeaconData();
        beaconData.setMajor(iBeaconRegion.getMajor());
        beaconData.setMinor(iBeaconRegion.getMinor());
        beaconData.setUuid(iBeaconRegion.getProximity().toString());
        Set<BeaconData> scannedBeaconList=new HashSet<>();
        scannedBeaconList.add(beaconData);
        syncService.syncBeaconAndLocationData(context, mLocation, scannedBeaconList, config.getApiToken(), config.getDeviceId(), config.getClientId(), config.getProjectId(), config.getCode(),true);


    }

    @Override
    public void onRegionExit(IBeaconRegion iBeaconRegion) {
        //sendNotification("You Exit from "+iBeaconRegion.getIdentifier());
       // iBeaconRegion.
      //  Toast.makeText(context,"Exit Region",Toast.LENGTH_LONG).show();*/
    }


    @Override
    public void onSchedulerUpdate() {
         mLocation = locationHandler.getLastKnownLocation();
        if(TrackingSettingUtil.isTrackingTime(config.getTrackingTimeJson())) {
            NBLogger.getLoger().writeLog(context, null, "Location Update Call----");
            if (beaconScanner != null) {
                beaconScanner.startScanning();
                NBLogger.getLoger().writeLog(context, null, "start beacon scan----");
            } else {
                NBLogger.getLoger().writeLog(context, null, "No Scanner Found   or Initlization----");
            }
        }

    }



    class CustomeReciver extends AkGeofenceReceiver{

        @Override
        public void onGeofenceEvent(AkLocation akLocation, GeofenceStatus geofenceStatus) {
            status=geofenceStatus;
           // startTracking();
            NBLogger.getLoger().writeLog(context, null, "---Geofence Status Updated-------"+geofenceStatus.name());

        }

        @Override
        public void onGeofenceError(String message) {
            NBLogger.getLoger().writeLog(context, null, "--- "+message+" -------");
            //startTracking();


        }
    }

    private  void startTracking()
    {
        scheduler.startScheduler();
        locationHandler.stopLocationUpdates();
       /* if(status.equals(GeofenceStatus.ENTER)&&!scheduler.isSchedulerRunning())
        {
            NBLogger.getLoger().writeLog(context, null, "--- Enter Location -------");
            if(isLocationApiConnected) {
                NBLogger.getLoger().writeLog(context, null, "--- Start Scheduler -------");
                NBLogger.getLoger().writeLog(context, null, "---Stop Location Update -------");
                scheduler.startScheduler();
                locationHandler.stopLocationUpdates();
            }


           // Toast.makeText(context,"Enter Location",Toast.LENGTH_LONG).show();
            //sendNotification("Enter");
        }
        else if(status.equals(GeofenceStatus.EXIT)&&!locationHandler.isLocationUpdateRunning())
        {
            NBLogger.getLoger().writeLog(context, null, "--- Exit Location -------");
            if(isLocationApiConnected) {
                NBLogger.getLoger().writeLog(context, null, "--- Stop Scheduler -------");
                NBLogger.getLoger().writeLog(context, null, "---Start Location Update -------");
                scheduler.stopScheduler();
                locationHandler.startLocationUpdates();
            }
            //Toast.makeText(context,"Exit Location",Toast.LENGTH_LONG).show();
            //sendNotification("Exit");
        }

        else if(status.equals(GeofenceStatus.NON)&&!locationHandler.isLocationUpdateRunning())
        {
            if(isLocationApiConnected) {
                NBLogger.getLoger().writeLog(context, null, "--- Stop Scheduler -------");
                NBLogger.getLoger().writeLog(context, null, "---Start Location Update -------");
                scheduler.stopScheduler();
                locationHandler.startLocationUpdates();
            }

            NBLogger.getLoger().writeLog(context, null, "--- Non Location -------");
           // Toast.makeText(context,"Exit Location",Toast.LENGTH_LONG).show();
            //sendNotification("Non");
        }*/
    }

    private void sendNotification(String notificationDetails) {
        // Create an explicit content Intent that starts the main Activity.
        Intent notificationIntent = new Intent(context.getApplicationContext(),TrackingDebugActivity.class);
        Uri alarmSound = RingtoneManager.getDefaultUri(RingtoneManager.TYPE_NOTIFICATION);

        Uri uri=Uri.parse("android.resource://"
                + context.getPackageName() + "/" + R.raw.beaconinrange);

        // Construct a task stack.
        TaskStackBuilder stackBuilder = TaskStackBuilder.create(context);

        // Add the main Activity to the task stack as the parent.
        stackBuilder.addParentStack(TrackingDebugActivity.class);

        // Push the content Intent onto the stack.
        stackBuilder.addNextIntent(notificationIntent);

        // Get a PendingIntent containing the entire back stack.
        PendingIntent notificationPendingIntent =
                stackBuilder.getPendingIntent(0, PendingIntent.FLAG_UPDATE_CURRENT);

        // Get a notification builder that's compatible with platform versions >= 4
        NotificationCompat.Builder builder = new NotificationCompat.Builder(context);

        // Define the notification settings.
        builder
                .setSmallIcon(R.drawable.alert_icon)
                .setColor(Color.RED)
                .setSound(uri)
                .setContentTitle(notificationDetails)
                .setContentText(notificationDetails)
                .setContentIntent(notificationPendingIntent);

        // Dismiss notification once the user touches it.
        builder.setAutoCancel(true);

        // Get an instance of the Notification manager
        NotificationManager mNotificationManager =
                (NotificationManager) context.getSystemService(Context.NOTIFICATION_SERVICE);

        // Issue the notification
        mNotificationManager.notify(0, builder.build());
    }




}
