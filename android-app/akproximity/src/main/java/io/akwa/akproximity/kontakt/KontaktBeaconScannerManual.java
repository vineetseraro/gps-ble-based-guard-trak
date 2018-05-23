package io.akwa.akproximity.kontakt;

import android.content.Context;

import com.kontakt.sdk.android.common.profile.IBeaconRegion;

import io.akwa.akcore.BeaconData;

/**
 * The type Kontakt beacon scanner manual.
 */
public class KontaktBeaconScannerManual extends AbstractKontaktBeaconScanner {

    /**
     * The Kontakt beacon listener.
     */
    public KontaktBeaconListener kontaktBeaconListener;


    /**
     * Instantiates a new Kontakt beacon scanner manual.
     *
     * @param context               the context
     * @param kontaktBeaconListener the kontakt beacon listener
     */
    public KontaktBeaconScannerManual(Context context, KontaktBeaconListener kontaktBeaconListener) {
        super(context);
        this.kontaktBeaconListener = kontaktBeaconListener;
    }

    @Override
    public void onBeaconDetected(BeaconData beaconData) {
        kontaktBeaconListener.onBeaconDetected(beaconData);
    }

    @Override
    public void startScanning() {
        initializeKoncat(null);
        startRangingBeacons();
    }

    @Override
    public void onBeaconEnterRegion(IBeaconRegion beaconRegion) {



    }

    @Override
    public void onBeaconExitRegion(IBeaconRegion beaconRegion) {

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
         * On beacon detected.
         *
         * @param beaconData the beacon data
         */
        void onBeaconDetected(BeaconData beaconData);
    }
}
