package io.akwa.traquer.guardtrack;

import android.bluetooth.BluetoothAdapter;
import android.content.Context;
import android.content.pm.PackageManager;
import android.os.Build;
import android.os.StrictMode;
import android.provider.Settings;
import android.support.multidex.MultiDex;
import android.support.multidex.MultiDexApplication;

import com.cloudinary.android.MediaManager;
import com.crashlytics.android.Crashlytics;

import io.akwa.aklogs.NBLogger;
import com.urbanairship.Logger;
import com.urbanairship.UAirship;

import io.akwa.traquer.guardtrack.common.cognito.AppHelper;
import io.akwa.traquer.guardtrack.common.tracking.TraquerScanUtil;
import io.akwa.traquer.guardtrack.common.updatedevice.DeviceInfo;
import io.akwa.traquer.guardtrack.common.updatedevice.UpdateDevicePresneter;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.common.utils.PrefUtils;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.ApiBaseResponse;
import io.akwa.traquer.guardtrack.model.ApiResponseModel;
import io.akwa.traquer.guardtrack.model.Client;
import io.akwa.traquer.guardtrack.updatedevice.RegisterDeviceApiHandler;
import io.akwa.traquer.guardtrack.updatedevice.RegisterUpdateDevicePresneter;
import io.fabric.sdk.android.Fabric;
import io.realm.Realm;
import uk.co.chrisjenx.calligraphy.CalligraphyConfig;

public class BaseApplication extends MultiDexApplication implements UpdateDevicePresneter.View, RegisterUpdateDevicePresneter.View {
    public static String deviceId;
    public static String appName;
    public static String appType;
    public static Context context;
    static BaseApplication baseApplication;

    @Override
    public void onCreate() {
        context = this;
        MultiDex.install(this);
        MediaManager.init(this);
        AppHelper.init(getApplicationContext());
        super.onCreate();
        Realm.init(this);
        Fabric.with(this, new Crashlytics());
        deviceId = Settings.Secure.getString(this.getContentResolver(), Settings.Secure.ANDROID_ID);
        appType = "guardtrak";
        appName="guardtrak";
        new PrefUtils(this);
        airShipSetup();
        CalligraphyConfig.initDefault(new CalligraphyConfig.Builder()
                .setDefaultFontPath("fonts/source_sans_pro_regular.ttf")
                .build()
        );
         baseApplication = this;
      //  if (PrefUtils.getCode() == null || PrefUtils.getCode().equals("")) {
            DeviceInfo deviceInfo = getDeviceInfo();
            updateDeviceStatus(deviceInfo);

      //  }


        NBLogger.delete3DaysBackProfile();

//    to solve: android.os.FileUriExposedException: file.jpg exposed beyond app through ClipData.Item.getUri()
        StrictMode.VmPolicy.Builder builder = new StrictMode.VmPolicy.Builder();
        StrictMode.setVmPolicy(builder.build());

    }

    public static Context getContext() {
        return context;
    }

    public static BaseApplication getAppInstance() {
        return baseApplication;
    }

    @Override
    public void registerActivityLifecycleCallbacks(ActivityLifecycleCallbacks callback) {
        super.registerActivityLifecycleCallbacks(callback);

    }

    private void airShipSetup() {

        UAirship.takeOff(this, new UAirship.OnReadyCallback() {
            @Override
            public void onAirshipReady(UAirship airship) {

                // Enable user notifications
                airship.getPushManager().setUserNotificationsEnabled(true);
                String channelId = UAirship.shared().getPushManager().getChannelId();
                DeviceInfo deviceInfo = getDeviceInfo();
                updateDeviceStatus(deviceInfo);
                Logger.info("My Application Channel ID0000: " +" --"+channelId);
            }
        });
        UAirship.shared().getPushManager().setUserNotificationsEnabled(true);
    }


    @Override
    public void onDeviceUpdate(ApiResponseModel response, NicbitException e) {
        if (response != null && response.getStatus() == 1) {
            PrefUtils.setIsDeviceUpdatedToServer(true);
        }


    }

    public static DeviceInfo getDeviceInfo() {

        String channelId = UAirship.shared().getPushManager().getChannelId();
        boolean isBluetooth = TraquerScanUtil.isBluetoothEnabled();
        boolean isLocation = TraquerScanUtil.isLocationServiceEnable(context);
        String manufacturer = Build.MANUFACTURER;
        String model = Build.MODEL;

        DeviceInfo deviceInfo = new DeviceInfo();
        int version = Build.VERSION.SDK_INT;
        deviceInfo.setDeviceId(deviceId);
        deviceInfo.setManufacturer(manufacturer);
        if (BuildConfig.IS_PROD)
            deviceInfo.setAppVersion(getAppVersion() + "(P)");
        else
            deviceInfo.setAppVersion(getAppVersion() + "(Q)");
        deviceInfo.setModel(model);
        deviceInfo.setVersion("" + version);
        deviceInfo.setOs("android");
        deviceInfo.setAppName("guardtrak");
        deviceInfo.setChannelId(channelId);
        deviceInfo.setPushIdentifier(channelId);
        deviceInfo.setName(getLocalBluetoothName());
        Client client = new Client();
        client.setClientId(Constant.CLIENT_ID);
        client.setProjectId(Constant.PROJECT_ID);
        deviceInfo.setClient(client);
        deviceInfo.setBluetoothStatus(isBluetooth ? 1 : 0);
        deviceInfo.setLocationStatus(isLocation ? 1 : 0);
        return deviceInfo;

    }

    public static String getAppVersion() {
        String versionCode = "1.0";
        try {
            versionCode = context.getPackageManager().getPackageInfo(context.getPackageName(), 0).versionName;
        } catch (PackageManager.NameNotFoundException e) {
            e.printStackTrace();
        }
        return versionCode;
    }

    public void updateDeviceStatus(DeviceInfo deviceInfo) {
        RegisterDeviceApiHandler deviceApiHandler = new RegisterDeviceApiHandler(this);
        deviceApiHandler.deviceUpdate(deviceInfo);

    }

    @Override
    public void onDeviceUpdate(ApiBaseResponse response, NicbitException e) {
        if(response!=null) {
            if ( response.getCode() == 200||response.getCode()==201 ){
                PrefUtils.setProjectId(response.getData().getClient().getProjectId());
                PrefUtils.setClientId(response.getData().getClient().getClientId());
                PrefUtils.setCode(response.getData().getCode());
                PrefUtils.setDeviceId(response.getData().getDeviceId());
                PrefUtils.setUuid(response.getData().getUuid());
                PrefUtils.setMajor(response.getData().getMajor());
                PrefUtils.setMinor(response.getData().getMinor());
            }
        }
    }

    public static String getLocalBluetoothName(){

        BluetoothAdapter mBluetoothAdapter = BluetoothAdapter.getDefaultAdapter();
        String name = mBluetoothAdapter.getName();
        if(name == null){
            name = mBluetoothAdapter.getAddress();
        }
        return name;
    }
}
