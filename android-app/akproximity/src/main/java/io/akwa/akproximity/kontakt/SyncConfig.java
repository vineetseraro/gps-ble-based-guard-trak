package io.akwa.akproximity.kontakt;

import android.content.Context;
import android.os.Handler;

import com.kontakt.sdk.android.ble.connection.ErrorCause;
import com.kontakt.sdk.android.ble.connection.KontaktDeviceConnection;
import com.kontakt.sdk.android.ble.connection.KontaktDeviceConnectionFactory;
import com.kontakt.sdk.android.ble.connection.WriteListener;
import com.kontakt.sdk.android.cloud.KontaktCloud;
import com.kontakt.sdk.android.cloud.KontaktCloudFactory;
import com.kontakt.sdk.android.cloud.response.CloudCallback;
import com.kontakt.sdk.android.cloud.response.CloudError;
import com.kontakt.sdk.android.cloud.response.CloudHeaders;
import com.kontakt.sdk.android.cloud.response.paginated.Configs;
import com.kontakt.sdk.android.common.model.Config;
import com.kontakt.sdk.android.common.model.DeviceType;
import com.kontakt.sdk.android.common.profile.IBeaconDevice;
import com.kontakt.sdk.android.common.profile.IBeaconRegion;
import com.kontakt.sdk.android.common.profile.RemoteBluetoothDevice;
import io.akwa.akcore.BeaconData;

/**
 * Created by niteshgoel on 12/6/17.
 */

public class SyncConfig extends AbstractKontaktBeaconScanner implements AbstractKontaktBeaconScanner.KontaktIBeaconListener {

    private KontaktCloud kontaktCloud;
    private Configs pendingConfigs;
    int scanTime;
    private KontaktDeviceConnection deviceConnection;

    /**
     * Instantiates a new Abstract kontakt beacon scanner.
     *
     * @param context the context
     */
    public SyncConfig(int scanTime, Context context) {
        super(context);
        if (scanTime != 0)
            this.scanTime = scanTime;
        else
            this.scanTime = 20;
        initializeKoncat(null);
        kontaktCloud = KontaktCloudFactory.create();
        setKontaktIBeaconListener(this);
    }

    public void fetchConfigs() {
        AppLog.i("fetching.. config ");
        //Fetch list of all pending configurations.
        kontaktCloud.configs().fetch().type(DeviceType.BEACON).execute(new CloudCallback<Configs>() {
            @Override
            public void onSuccess(Configs response, CloudHeaders headers) {
                if (response != null && response.getContent() != null) {
                    //Do something with your configs list
                    pendingConfigs = response;
                    startScanning();
                    AppLog.i("fetching.. success ");
                }
            }

            @Override
            public void onError(CloudError error) {
                AppLog.i("fetchConfigs error---" + error);

            }
        });
    }

    private void updateConfig(Config config, final IBeaconDevice iBeaconDevice) {
//
//        Config config1 = new Config.Builder().major(1)
//                .minor(3)
//                .build();
//
//        AppLog.i("config-----------"+config1);

        kontaktCloud.configs().create(config).forDevices(iBeaconDevice.getUniqueId()).withType(DeviceType.BEACON).execute(new CloudCallback<Config[]>() {
            @Override
            public void onSuccess(Config[] response, CloudHeaders headers) {
                //Config has been successfully created. Now download encrypted version.
                AppLog.i("config ----" + response[0]);
                kontaktCloud.configs().secure().withIds(iBeaconDevice.getUniqueId()).execute(new CloudCallback<Configs>() {
                    @Override
                    public void onSuccess(Configs response, CloudHeaders headers) {
//                        setStatus("Fetching encrypted configuration...");
                        onConfigurationReady(iBeaconDevice, response.getContent().get(0));
                        AppLog.i("updateConfig- success--" + response.getContent().get(0));
                    }

                    @Override
                    public void onError(CloudError error) {
                        AppLog.i("updateConfig error---" + error.getMessage());
                    }
                });
            }

            @Override
            public void onError(CloudError error) {
                AppLog.i("updateConfig create error---" + error.getMessage());
            }
        });

    }


    private void onConfigurationReady(IBeaconDevice iBeaconDevice, Config config) {
        //Initialize connection to the device
        deviceConnection = KontaktDeviceConnectionFactory.create(context.get(), iBeaconDevice, createConnectionListener(config));
        deviceConnection.connect();
//        setStatus("Connecting to device...");
    }

    private void onDeviceConnected(final Config config) {
        //Device connected. Start configuration...
        AppLog.i("onDeviceConnected---");
        deviceConnection.applySecureConfig(config.getSecureRequest(), new WriteListener() {
            @Override
            public void onWriteSuccess(WriteResponse response) {
                //Configuration has been applied. Now we need to send beacon's response back to the cloud to stay synchronized.
                onConfigurationApplied(response, config);
                deviceConnection.close();
                AppLog.i("applySecureConfig---done");
            }

            @Override
            public void onWriteFailure(ErrorCause cause) {
                deviceConnection.close();
                AppLog.i("applySecureConfig  onWriteFailure error---" + cause);
            }
        });
    }

    private void onConfigurationApplied(WriteListener.WriteResponse response, Config config) {
        //Configuration has been applied on the beacon. Now we should inform Cloud about it.
        config.applySecureResponse(response.getExtra(), response.getUnixTimestamp());
        kontaktCloud.devices().applySecureConfigs(config).execute(new CloudCallback<Configs>() {
            @Override
            public void onSuccess(Configs response, CloudHeaders headers) {
                //Success!
                AppLog.i("onConfigurationApplied-- success-" + response);
            }

            @Override
            public void onError(CloudError error) {
//                showError("Error: " + error.getMessage());
                AppLog.i("onConfigurationApplied-- error-" + error);
            }
        });
    }

    @Override
    public void onBeaconDetected(BeaconData beaconData) {

    }

    @Override
    public void startScanning() {
        Handler handler = new Handler();
        handler.postDelayed(new Runnable() {
            @Override
            public void run() {
                stopRanginBeacon();
            }
        }, scanTime * 1000);
        startRangingBeacons();
    }

    @Override
    public void onBeaconDetected(IBeaconDevice iBeacon) {
        AppLog.i("on beacon detected......."+iBeacon.getUniqueId());
        if (iBeacon.getUniqueId()!=null) {
            for (Config config : pendingConfigs.getContent()) {
//                AppLog.i("unique id   " + iBeacon.getUniqueId());
//                AppLog.i("unique id config  " + config.getUniqueId());
                if (iBeacon.getUniqueId().equals(config.getUniqueId())) {
                    AppLog.i("matched.......");
                    stopRanginBeacon();
                    updateConfig(config, iBeacon);

                }
            }
        }
    }

    @Override
    public void onBeaconEnterRegion(IBeaconRegion iBeaconRegion) {

    }

    @Override
    public void onBeaconExitRegion(IBeaconRegion beaconRegion) {

    }

    private KontaktDeviceConnection.ConnectionListener createConnectionListener(final Config config) {
        return new KontaktDeviceConnection.ConnectionListener() {
            @Override
            public void onConnectionOpened() {
                AppLog.i("onConnectionOpened---");
            }

            @Override
            public void onAuthenticationSuccess(RemoteBluetoothDevice.Characteristics characteristics) {
                onDeviceConnected(config);
            }

            @Override
            public void onAuthenticationFailure(int failureCode) {
                AppLog.i("onAuthenticationFailure---"+failureCode);
            }

            @Override
            public void onCharacteristicsUpdated(RemoteBluetoothDevice.Characteristics characteristics) {
                AppLog.i("onCharacteristicsUpdated---");
            }

            @Override
            public void onErrorOccured(int errorCode) {
//                showError("Connection error. Code: " + errorCode);
                AppLog.i("onErrorOccured---"+errorCode);
            }

            @Override
            public void onDisconnected() {
//                showError("Device disconnected.");
                AppLog.i("onDisconnected---");
            }
        };
    }
}


