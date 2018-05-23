package io.akwa.akproximity.kontakt;

import android.content.Context;
import android.os.Handler;

import com.kontakt.sdk.android.common.profile.IBeaconRegion;

import io.akwa.akcore.BeaconData;
import io.akwa.akcore.ZoneBeacon;

import java.util.HashSet;
import java.util.List;
import java.util.Set;

/**
 * The type Kontakt beacon scanner auto.
 */
public class KontaktBeaconScannerAuto extends AbstractKontaktBeaconScanner {

    /**
     * The Scan time.
     */
    int scanTime;
    /**
     * The Scanned beacon list.
     */
    Set<BeaconData> scannedBeaconList;
    /**
     * The Kontakt beacon listener.
     */
    public KontaktBeaconListener kontaktBeaconListener;


    /**
     * Instantiates a new Kontakt beacon scanner auto.
     *
     * @param scanTime              the scan time
     * @param context               the context
     * @param kontaktBeaconListener the kontakt beacon listener
     */
    public KontaktBeaconScannerAuto(int scanTime, Context context, KontaktBeaconListener kontaktBeaconListener, List<ZoneBeacon> zoneBeacons) {
        super(context);
        if (scanTime != 0)
            this.scanTime = scanTime;
        else
            this.scanTime = 10;
        scannedBeaconList = new HashSet<>();
        this.kontaktBeaconListener = kontaktBeaconListener;
        initializeKoncat(zoneBeacons);
    }

    @Override
    public void onBeaconDetected(BeaconData beaconData) {
        AppLog.i("beacon min " + beaconData.getMinor());
        scannedBeaconList.add(beaconData);
    }


    @Override
    public void startScanning() {
        scannedBeaconList.clear();
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                //stopRanginBeacon();
                kontaktBeaconListener.onScanningComplete(scannedBeaconList);
            }
        }, scanTime * 1000);
        startRangingBeacons();

    }

    @Override
    public void onBeaconEnterRegion(IBeaconRegion beaconRegion) {
        if(kontaktBeaconListener!=null)
            kontaktBeaconListener.onRegionEnter(beaconRegion);
    }

    @Override
    public void onBeaconExitRegion(IBeaconRegion beaconRegion) {
        if(kontaktBeaconListener!=null)
            kontaktBeaconListener.onRegionExit(beaconRegion);

    }

    /**
     * Sets kontakt beacon listener.
     *
     * @param kontaktBeaconListener the kontakt beacon listener
     */
    public void setKontaktBeaconListener(KontaktBeaconListener kontaktBeaconListener) {
        this.kontaktBeaconListener = kontaktBeaconListener;
    }

    /**
     * The interface Kontakt beacon listener.
     */
    public interface KontaktBeaconListener {
        /**
         * On scanning complete.
         *
         * @param scannedBeaconList the scanned beacon list
         */
        void onScanningComplete(Set<BeaconData> scannedBeaconList);
        void onRegionEnter(IBeaconRegion iBeaconRegion);

        void onRegionExit(IBeaconRegion iBeaconRegion);

    }
}
