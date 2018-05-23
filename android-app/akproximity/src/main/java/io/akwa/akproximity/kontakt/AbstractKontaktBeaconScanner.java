package io.akwa.akproximity.kontakt;

import android.content.Context;
import android.util.Log;

import com.kontakt.sdk.android.ble.configuration.ScanMode;
import com.kontakt.sdk.android.ble.configuration.ScanPeriod;
import com.kontakt.sdk.android.ble.connection.OnServiceReadyListener;
import com.kontakt.sdk.android.ble.device.BeaconRegion;
import com.kontakt.sdk.android.ble.manager.ProximityManager;
import com.kontakt.sdk.android.ble.manager.ProximityManagerFactory;
import com.kontakt.sdk.android.ble.manager.listeners.IBeaconListener;
import com.kontakt.sdk.android.ble.manager.listeners.SpaceListener;
import com.kontakt.sdk.android.common.KontaktSDK;
import com.kontakt.sdk.android.common.profile.IBeaconDevice;
import com.kontakt.sdk.android.common.profile.IBeaconRegion;
import com.kontakt.sdk.android.common.profile.IEddystoneNamespace;

import io.akwa.akcore.BeaconData;
import io.akwa.akcore.Zone;
import io.akwa.akcore.ZoneBeacon;

import java.lang.ref.WeakReference;
import java.text.DecimalFormat;
import java.util.ArrayList;
import java.util.Collection;
import java.util.List;
import java.util.UUID;
import java.util.concurrent.TimeUnit;

/**
 * The type Abstract kontakt beacon scanner.
 */
public abstract class AbstractKontaktBeaconScanner {
    protected WeakReference<Context> context;
    /**
     * The constant TAG.
     */
    public static final String TAG = "EstimoteBeaconHandler";
    private ProximityManager proximityManager;
    KontaktIBeaconListener kontaktIBeaconListener;

    public void setKontaktIBeaconListener(KontaktIBeaconListener kontaktIBeaconListener) {
        this.kontaktIBeaconListener = kontaktIBeaconListener;
    }

    /**
     * Instantiates a new Abstract kontakt beacon scanner.
     *
     * @param context the context
     */
    public AbstractKontaktBeaconScanner(Context context) {
        this.context = new WeakReference<>(context);
    }

    /**
     * On beacon detected.
     *
     * @param beaconData the beacon data
     */
    public abstract void onBeaconDetected(BeaconData beaconData);

    /**
     * Start scanning.
     */
    public abstract void startScanning();


    public abstract void onBeaconEnterRegion(IBeaconRegion beaconRegion);
    public abstract void onBeaconExitRegion(IBeaconRegion beaconRegion);
    /**
     * Initialize koncat.
     */


    protected void initializeKoncat(List<ZoneBeacon> zoneBeacons) {
        KontaktSDK.initialize(BeaconConfig.KONTAKT_KEY);
        proximityManager = ProximityManagerFactory.create(context.get());
        proximityManager.configuration().scanMode(ScanMode.BALANCED)

               /// .scanPeriod(ScanPeriod.MONITORING) ;
         .scanPeriod(ScanPeriod.create(TimeUnit.SECONDS.toMillis(8), TimeUnit.SECONDS.toMillis(20)));
        proximityManager.setIBeaconListener(createIBeaconListener());


        if(zoneBeacons!=null&&BeaconConfig.BEACON_UUID!=null&&!BeaconConfig.BEACON_UUID.equals(""))
        {
            proximityManager.spaces().iBeaconRegions(getRegion(zoneBeacons));
            //proximityManager.spaces().iBeaconRegion(getBeaconRegion(BeaconConfig.BEACON_UUID));

        }

        proximityManager.setSpaceListener(new SpaceListener() {
            @Override
            public void onRegionEntered(IBeaconRegion region) {
                  onBeaconEnterRegion(region);


            }

            @Override
            public void onRegionAbandoned(IBeaconRegion region) {
                onBeaconExitRegion(region);

            }

            @Override
            public void onNamespaceEntered(IEddystoneNamespace namespace) {

            }

            @Override
            public void onNamespaceAbandoned(IEddystoneNamespace namespace) {

            }
        });




    }

    public void startRangingBeacons() {
        if (proximityManager != null)
        {
            proximityManager.connect(new OnServiceReadyListener() {
                @Override
                public void onServiceReady() {
                    proximityManager.startScanning();

                }
            });
        }
    }

    /**
     * Stop rangin beacon.
     */
    public void stopRanginBeacon() {
        if (proximityManager != null)
            proximityManager.stopScanning();
    }

    private IBeaconListener createIBeaconListener() {

        return new IBeaconListener() {
            @Override
            public void onIBeaconDiscovered(IBeaconDevice iBeacon, IBeaconRegion region) {
                Log.i("","Beacon Minor==="+iBeacon.getMinor());
                  onBeaconDetected(getBeaconData(iBeacon));
                if (kontaktIBeaconListener !=null){
                    kontaktIBeaconListener.onBeaconDetected(iBeacon);
                }
            }

            @Override
            public void onIBeaconsUpdated(List<IBeaconDevice> iBeacons, IBeaconRegion region) {
                Log.i("","Beacon size==="+iBeacons.size());

            }

            @Override
            public void onIBeaconLost(IBeaconDevice iBeacon, IBeaconRegion region) {
                Log.i("Beacons onIBeaconLost","Beaonc Minor==="+iBeacon.getMinor());

            }
        };
    }

    private BeaconData getBeaconData(IBeaconDevice iBeacon) {
        BeaconData beaconData = new BeaconData();
        beaconData.setTimestamp(iBeacon.getTimestamp());
        beaconData.setMajor(iBeacon.getMajor());
        beaconData.setMinor(iBeacon.getMinor());
        beaconData.setUuid(iBeacon.getProximityUUID().toString());
        beaconData.setDistance(iBeacon.getDistance());
        beaconData.setRssi(iBeacon.getRssi());
        //format distance
        DecimalFormat df = new DecimalFormat("#.00");
       // String finalDistance = df.format(beaconData.getDistance());
        beaconData.setRange(Util.getProximityNumericValue(iBeacon.getProximity()));
    return beaconData;
    }

    private IBeaconRegion getBeaconRegion(String uuid) {
        BeaconRegion.Builder beaconRegion=new BeaconRegion.Builder();
        beaconRegion.identifier("EmTrack Region");
        beaconRegion.proximity(UUID.fromString(uuid));
        IBeaconRegion region =beaconRegion.build();
        return region;

    }

    public interface KontaktIBeaconListener {
        void onBeaconDetected(IBeaconDevice iBeacon);
        void onBeaconEnterRegion(IBeaconRegion iBeaconRegion);
    }

    public  Collection<IBeaconRegion>  getRegion(List<ZoneBeacon> zoneBeacons)
    {
        Collection<IBeaconRegion> beaconRegions = new ArrayList<>();
        IBeaconRegion region;
        for(ZoneBeacon zoneBeacon:zoneBeacons) {
            region = new BeaconRegion.Builder()
                    .identifier(zoneBeacon.getZone().getName())
                    .proximity(UUID.fromString(zoneBeacon.getUuid()))
                    .major(zoneBeacon.getMajor())
                    .minor(zoneBeacon.getMinor())
                    .build();

            beaconRegions.add(region);

        }

        return beaconRegions;
    }


}