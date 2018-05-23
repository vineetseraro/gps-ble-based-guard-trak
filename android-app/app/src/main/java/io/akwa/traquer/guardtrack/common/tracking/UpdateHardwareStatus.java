package io.akwa.traquer.guardtrack.common.tracking;

import android.app.IntentService;
import android.content.Context;
import android.content.Intent;
import android.provider.Settings;
import android.util.Log;

import com.google.gson.Gson;

import io.akwa.aksync.network.mqtt.OnMqtConnected;
import io.akwa.aksync.network.mqtt.StatusPublisher;

import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.model.PhoneStatusRequest;

public class UpdateHardwareStatus extends IntentService {
    private static final String LOCATION = "com.nicbit.traquer.common.beaconservices.broadcast.extra.LOCATION";
    private static final String BLUETOOTH = "com.nicbit.traquer.common.beaconservices.broadcast.extra.BLUETOOTH";

    public UpdateHardwareStatus() {
        super("UpdateHardwareStatus");
    }

    StatusPublisher statusPublisher;
    public static void updateStatus(Context context, Integer bluetooth, Integer location) {
        Intent intent = new Intent(context, UpdateHardwareStatus.class);
        intent.putExtra(LOCATION, location);
        intent.putExtra(BLUETOOTH, bluetooth);
        context.startService(intent);
    }


    @Override
    protected void onHandleIntent(Intent intent) {
        if (intent != null) {

            final int location = intent.getIntExtra(LOCATION, -1);
            final int bluetooth = intent.getIntExtra(BLUETOOTH, -1);
            String appCode= PrefUtils.getCode();
            String android_id = Settings.Secure.getString(getContentResolver(),
                    Settings.Secure.ANDROID_ID);
            ApiHandler apiHandler = ApiHandler.getApiHandler();
            final PhoneStatusRequest phoneStatusRequest = new PhoneStatusRequest();
            phoneStatusRequest.setBluetoothStatus(bluetooth);
            phoneStatusRequest.setLocationStatus(location);
            phoneStatusRequest.setOs("android");
            phoneStatusRequest.setAppCode(appCode);
            phoneStatusRequest.setDeviceId(android_id);
            apiHandler.updatePhoneStatus(phoneStatusRequest);


//            statusPublisher=StatusPublisher.getMqttPublisher(this);
//            Map<String,String> deviceAttribute=new HashMap<>();
//            deviceAttribute.put("deviceId", BaseApplication.deviceId);
//            deviceAttribute.put("os", "android");
//            statusPublisher.initMqtt(this, new OnInitializeMqtt() {
//                @Override
//                public void onInitializeDone(boolean isInitialize) {
//
//                    if(isInitialize)
//                    connectData(phoneStatusRequest);
//                }
//            },BaseApplication.deviceId, deviceAttribute);


        }
    }

    public void connectData(PhoneStatusRequest phoneStatusRequest)
    {
        Gson gson=new Gson();
        final String message= gson.toJson(phoneStatusRequest);
        Log.i("Message",message);

        statusPublisher.connectMqtt(new OnMqtConnected() {
            @Override
            public void onMqttConnected(boolean isConnected) {
                if(isConnected)
                {
                    Log.i("Message","MqttConnected");
                    statusPublisher.updateThingShadow(message);
                }
            }
        });



    }


}
