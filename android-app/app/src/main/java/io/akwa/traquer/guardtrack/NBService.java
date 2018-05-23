package io.akwa.traquer.guardtrack;

import android.app.Notification;
import android.app.PendingIntent;
import android.app.Service;
import android.content.Intent;
import android.location.Location;
import android.os.Handler;
import android.os.HandlerThread;
import android.os.IBinder;
import android.os.Looper;
import android.os.Message;
import android.os.Process;

import com.kontakt.sdk.android.common.profile.IBeaconRegion;

import io.akwa.akcore.BeaconData;
import io.akwa.aklogs.NBLogger;
import io.akwa.akproximity.kontakt.KontaktBeaconScannerAuto;
import io.akwa.aksync.SyncService;
import io.akwa.aksync.shceduler.OnSchedulerUpdate;
import io.akwa.aksync.shceduler.Scheduler;
import io.akwa.aktracking.LocationHandler;

import java.lang.ref.WeakReference;
import java.util.ArrayList;
import java.util.List;
import java.util.Set;

import io.akwa.tracker.geofence.AkLocation;
import io.akwa.trakit.rulehandler.AKTrackingRule;
import io.akwa.trakit.rulehandler.Config;
import io.akwa.trakit.rulehandler.RuleHandler;
import io.akwa.traquer.guardtrack.common.MinorTestData;
import io.akwa.traquer.guardtrack.common.geofence.GefenceDeviceContract;
import io.akwa.traquer.guardtrack.common.geofence.GeofenceApiResponse;
import io.akwa.traquer.guardtrack.common.geofence.GeofenceDevicePresenter;
import io.akwa.traquer.guardtrack.common.utils.AppLog;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.common.utils.StringUtils;
import io.akwa.traquer.guardtrack.common.zone.ZonApiResponse;
import io.akwa.traquer.guardtrack.common.zone.Zone;
import io.akwa.traquer.guardtrack.common.zone.ZoneBeacon;
import io.akwa.traquer.guardtrack.common.zone.ZoneDeviceContract;
import io.akwa.traquer.guardtrack.common.zone.ZoneDevicePresenter;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.splash.StrykerSplashActivity;
import io.akwa.traquer.guardtrack.ui.trackingsetting.TrackingSettingUtil;

public class NBService extends Service implements LocationHandler.LocationChangeListener, KontaktBeaconScannerAuto.KontaktBeaconListener, OnSchedulerUpdate {
    private static final int SERVICE_ID = 12;
    private Location mLocation;
    private SyncService syncService;
    private Looper mServiceLooper;
    private ServiceHandler mServiceHandler;
    private String apiToken;
    private LocationHandler locationHandler;
    private String deviceId;
    private String code;

    private String clientId;
    private String projectId;
    Scheduler scheduler;
    KontaktBeaconScannerAuto beaconScanner;
    RuleHandler ruleHandler;
    GefenceDeviceContract.UserActionsListener geofenceAction;
    ZoneDeviceContract.UserActionsListener zoneActionListener;


    public static String getServiceSource() {
        if (serviceSource == null) return null;
        return serviceSource.get();
    }

    public static void setServiceSource(String serviceName) {
        serviceSource = new WeakReference<>(serviceName);
    }

    static WeakReference<String> serviceSource;


    // Handler that receives messages from the thread
    private final class ServiceHandler extends Handler {
        public ServiceHandler(Looper looper) {
            super(looper);
        }

        @Override
        public void handleMessage(Message msg) {
            // Normally we would do some work here, like download a file.
            // For our sample, we just sleep for 5 seconds.
           /* Log.i("Handle Message", "Scaning Start");

            if (syncService == null) {
                syncService = new SyncService(NBService.this);
                NBLogger.getLoger().writeLog(NBService.this, null, "--- syncService instantiated -------");

            } else {
                NBLogger.getLoger().writeLog(NBService.this, null, "--- syncService already instantiated -------");
            }

            if (beaconScanner == null) {
                beaconScanner = new KontaktBeaconScannerAuto(20, NBService.this, NBService.this);
                NBLogger.getLoger().writeLog(NBService.this, null, "--- Scanner  instantiated -------");
            } else {
                NBLogger.getLoger().writeLog(NBService.this, null, "--- Scanner already instantiated -------");

            }

            if (locationHandler == null) {
                locationHandler = new LocationHandler(NBService.this, 1, NBService.this);

                NBLogger.getLoger().writeLog(NBService.this, null, "--- locationHandler instantiated -------");
            } else {
                NBLogger.getLoger().writeLog(NBService.this, null, "--- locationHandler already instantiated -------");
            }*/


            if (ruleHandler == null) {
                geofenceAction = new GeofenceDevicePresenter(new GefenceDeviceContract.View() {
                    @Override
                    public void onGeofencesReceived(GeofenceApiResponse loginResponse, NicbitException e) {
                        if (loginResponse != null && loginResponse.getCode() == 200) {
                            if (loginResponse.getData() != null && loginResponse.getData().size() > 0) {
                                List<AkLocation> akLocations = new ArrayList<>();
                                for (GeofenceApiResponse.Datum datum : loginResponse.getData()) {
                                    if (datum.getCoordinates() != null) {
                                        akLocations.add(new AkLocation(datum.getCoordinates().getLatitude(), datum.getCoordinates().getLongitude(), datum.getName()));

                                    }
                                }

                                if (akLocations.size() > 0) {
                                    NBLogger.getLoger().writeLog(NBService.this, null, "---  Geofence Location added -------");
                                    getZone(akLocations);

                                }
                                else
                                    NBLogger.getLoger().writeLog(NBService.this, null, "--- No Geofence Location found -------");

                            }

                        } else
                            NBLogger.getLoger().writeLog(NBService.this, null, "--- Problem in fetching API -------");
                    }
                });
                geofenceAction.getGeofences();

            }


//            if(scheduler==null)
//            {
//                scheduler = new Scheduler(NBService.this,60*1000);
//                scheduler.startScheduler();
//                NBLogger.getLoger().writeLog(NBService.this, null, "--- Scheduler instantiated -------");
//            }
//            else
//            {
//                NBLogger.getLoger().writeLog(NBService.this, null, "--- Scheduler already instantiated -------");
//
//            }
//
//            AppLog.i("ServiceHandler----");
//            NBLogger.getLoger().writeLog(NBService.this, null, "ServiceHandler-----");

        }
    }

    public NBService() {
    }

    @Override
    public void onCreate() {
        setServiceSource(StringUtils.APP_NAME);
        super.onCreate();

        Intent notificationIntent = new Intent(this, StrykerSplashActivity.class);
        PendingIntent pendingIntent = PendingIntent.getBroadcast(this, 0, notificationIntent, 0);

        Notification notification = new Notification.Builder(this)
                .setContentTitle(getString(R.string.app_name))
                .setContentText("Tracking Started")
                .setSmallIcon(android.R.drawable.ic_media_play)
                .setContentIntent(pendingIntent)
                .setTicker("ticker")
                .build();

        startForeground(SERVICE_ID, notification);


        // Start up the thread running the service.  Note that we create a
        // separate threadcause the be service normally runs in the process's
        // main thread, which we don't want to block.
        HandlerThread thread = new HandlerThread("ServiceStartArguments", Process.THREAD_PRIORITY_FOREGROUND);
        thread.start();

        // Get the HandlerThread's Looper and use it for our Handler
        mServiceLooper = thread.getLooper();
        mServiceHandler = new ServiceHandler(mServiceLooper);

        NBLogger.getLoger().writeLog(this, null, "onCreate-------");
        AppLog.i("onCreate------");


    }

    @Override
    public IBinder onBind(Intent intent) {
        throw new UnsupportedOperationException("Not yet implemented");
    }

    @Override
    public int onStartCommand(Intent intent, int flags, int startId) {
        NBLogger.getLoger().writeLog(this, null, "onstart command-------");
        AppLog.i("onstart command-------");
        apiToken = PrefUtils.getSessionToken(); //intent.getStringExtra(Key.IntentKey.TOKEN);
        deviceId = BaseApplication.deviceId;//intent.getStringExtra(Key.IntentKey.DEVICE_ID);
        projectId = Constant.PROJECT_ID;//intent.getStringExtra(Key.IntentKey.PROJECT_ID);
        clientId = Constant.CLIENT_ID;//intent.getStringExtra(Key.IntentKey.CLIENT_ID);
        code = PrefUtils.getCode();//intent.getStringExtra(Key.IntentKey.CODE);
        Message msg = mServiceHandler.obtainMessage();
        msg.arg1 = startId;
        mServiceHandler.sendMessage(msg);

        return START_STICKY;
    }

    @Override
    public void onDestroy() {
        super.onDestroy();
        AppLog.i("onDestroy-------");
        NBLogger.getLoger().writeLog(this, null, "onDestroy-------");
        stopForeground(true);

        if (ruleHandler != null)
            ruleHandler.stop();
     /*   if(locationHandler!=null) {
            locationHandler.stopLocationUpdates();
            locationHandler.disConnectGoogleApi();
        }
        if(beaconScanner!=null)
            beaconScanner.stopRanginBeacon();
*/
    }

    @Override
    public void onLocationUpdate(Location location) {
        mLocation = location;
        if (TrackingSettingUtil.isTrackingTime()) {
            AppLog.i("location updated");
            NBLogger.getLoger().writeLog(this, null, "Location Update Call----");

            if (beaconScanner != null) {

                beaconScanner.startScanning();
                NBLogger.getLoger().writeLog(this, null, "start beacon scan----");
            } else {
                NBLogger.getLoger().writeLog(this, null, "No Scanner Found   or Initlization----");
            }
        }


    }

    @Override
    public void onLocationApiConnected(boolean isConnected) {


    }

    @Override
    public void onScanningComplete(Set<BeaconData> scannedBeaconList) {
        AppLog.i("on scan complete----");
        String code = PrefUtils.getCode();
        BeaconData beaconData = MinorTestData.createBeaconData();
        scannedBeaconList.add(beaconData);
        if (beaconScanner != null)
            beaconScanner.stopRanginBeacon();
        NBLogger.getLoger().writeLog(this, null, "on scan complete----");
        AppLog.i("DiscoveredBeacons===" + scannedBeaconList.size());
        if (scannedBeaconList.size() > 0) {
            syncService.syncBeaconAndLocationData(this, mLocation, scannedBeaconList, apiToken, deviceId, clientId, projectId, code,false);
        }
    }

    @Override
    public void onRegionEnter(IBeaconRegion iBeaconRegion) {

    }

    @Override
    public void onRegionExit(IBeaconRegion iBeaconRegion) {

    }



    @Override
    public void onSchedulerUpdate() {
        //mLocation = locationHandler.getLastKnownLocation();
        if (mLocation != null) {
            if (beaconScanner != null) {
                beaconScanner.startScanning();
                AppLog.i("start beacon scan----");
                NBLogger.getLoger().writeLog(this, null, "start beacon scan----");
            } else {
                NBLogger.getLoger().writeLog(this, null, "No Scanner Found   or Initlization----");
            }
        } else {
            AppLog.i("==Location is null====");
            NBLogger.getLoger().writeLog(this, null, "unable to find Location");
        }

    }

    public void getZone(final List<AkLocation> geoLocations)
    {

        zoneActionListener=new ZoneDevicePresenter(new ZoneDeviceContract.View() {
            @Override
            public void onZoneReceived(ZonApiResponse loginResponse, NicbitException e) {

                if (loginResponse != null && loginResponse.getCode() == 200) {
                    if (loginResponse.getData() != null && loginResponse.getData().size() > 0) {
                        List<io.akwa.akcore.ZoneBeacon> zoneBeacons = new ArrayList<>();
                        for (ZoneBeacon datum : loginResponse.getData()) {

                            io.akwa.akcore.ZoneBeacon zoneBeacon=new io.akwa.akcore.ZoneBeacon();
                            zoneBeacon.setName(datum.getName());
                            zoneBeacon.setMajor(datum.getMajor());
                            zoneBeacon.setMinor(datum.getMinor());
                            zoneBeacon.setUuid(datum.getUuid());
                            io.akwa.akcore.Zone zone=new io.akwa.akcore.Zone();
                            zone.setName(datum.getZone().getName());
                            zone.setId(datum.getZone().getId());
                            zone.setCode(datum.getCode());

                            zoneBeacon.setZone(zone);
                            zoneBeacons.add(zoneBeacon);
                        }

                        if (zoneBeacons.size() > 0) {
                            String trackingTimeResponse = PrefUtils.getTrackingSettings();
                            BeaconData beaconData = MinorTestData.createBeaconData();
                            Config config = new Config(apiToken, deviceId, projectId, clientId, code, trackingTimeResponse, beaconData);
                            NBLogger.getLoger().writeLog(NBService.this, null, "---  Zone Location added -------");
                            ruleHandler = new RuleHandler(config, new AKTrackingRule(), NBService.this,zoneBeacons);
                            ruleHandler.start(geoLocations);

                        }
                        else
                            NBLogger.getLoger().writeLog(NBService.this, null, "--- No Zone Location found -------");
                    }

                } else
                    NBLogger.getLoger().writeLog(NBService.this, null, "--- Problem in fetching API -------");
            }


        });
        zoneActionListener.getZones();
    }




}
