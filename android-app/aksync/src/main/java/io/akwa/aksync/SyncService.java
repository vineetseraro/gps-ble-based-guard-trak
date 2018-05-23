package io.akwa.aksync;

import android.content.Context;
import android.location.Location;
import android.net.ConnectivityManager;
import android.util.Log;
import android.widget.Toast;

import io.akwa.akcore.BeaconData;
import io.akwa.aklogs.NBLogger;
import io.akwa.aksync.network.ApiHandler;
import io.akwa.aksync.network.ApiResponseListener;
import io.akwa.aksync.network.model.ApiLocationModel;
import io.akwa.aksync.network.model.ApiResponseModel;
import io.akwa.aksync.network.mqtt.TrackPublisher;
import io.akwa.aksync.network.mqtt.OnInitializeMqtt;
import io.akwa.aksync.network.mqtt.OnMqtConnected;

import java.util.ArrayList;
import java.util.Set;

import io.realm.RealmList;

/**
 * The type Sync service.
 */
public class SyncService implements ApiResponseListener {

    Context context;
    TrackPublisher mqttPublisher;
    boolean isConnected;
    final String TAG="SyncService";
    public static final String topic = "ak_guardtrak_trackPoints";
    public SyncService( Context context)
    {
        mqttPublisher= TrackPublisher.getMqttPublisher(context);
        this.context=context;
        intiMqtt();

    }

    /**
     * Sync beacon and location data.
     *
     * @param location       the location
     * @param beaconDataList the beacon data list
     * @param apiToken       the api token
     * @param deviceId       the device id
     */
    public void syncBeaconAndLocationData(Context context, Location location, Set<BeaconData> beaconDataList, String apiToken, String deviceId,String clientId,String projectId,String code,boolean isHttp) {



        long currentTime=System.currentTimeMillis();
        LocationRealm locationRealm = new LocationRealm();
        locationRealm.setTimestamp(currentTime);
        if(location!=null) {
            locationRealm.setLatitude(location.getLatitude());
            locationRealm.setLongitude(location.getLongitude());
            locationRealm.setAltitude(location.getAltitude());
            locationRealm.setSpeed(location.getSpeed());
            locationRealm.setAccuracy(location.getAccuracy());
            locationRealm.setDirection(location.getBearing());
            locationRealm.setProvider("android_" + location.getProvider());
        }
        locationRealm.setPkid(code+currentTime);
        locationRealm.setBeacons(new RealmList<BeaconRealm>());

        RealmList<BeaconRealm> beacons = locationRealm.getBeacons();
        for (BeaconData beaconData : beaconDataList) {
            BeaconRealm beaconRealm = new BeaconRealm();
            beaconRealm.setTimestamp(beaconData.getTimestamp());
            beaconRealm.setDistance(beaconData.getDistance());
            beaconRealm.setMajor(beaconData.getMajor());
            beaconRealm.setMinor(beaconData.getMinor());
            beaconRealm.setRange(beaconData.getRange());
            beaconRealm.setRssi(beaconData.getRssi());
            beaconRealm.setUuid(beaconData.getUuid());
            beacons.add(beaconRealm);
        }
        ArrayList<ApiLocationModel> apiLocationModels = DBService.saveAndGetLocationList(locationRealm,deviceId,clientId,projectId,code);

        if(isHttp) {
            //Toast.makeText(this.context,"API HIT",Toast.LENGTH_LONG).show();

            NBLogger.getLoger().writeLog(context, null, "Call Location Update ");

            ApiHandler apiHandler = new ApiHandler();
            apiHandler.setApiResponseListener(this);
            apiHandler.updateLocation(apiToken, deviceId, apiLocationModels);
        }
        else {
            publishData(apiToken, deviceId, apiLocationModels);
        }


    }

    @Override
    public void onApiResponse(ApiResponseModel response, Throwable t) {
        if (response!=null) {
           // Toast.makeText(this.context,"API Response success",Toast.LENGTH_LONG).show();
            if(response.getCode()==200||response.getCode()==201) {
                AppLog.i("success------");//
                NBLogger.getLoger().writeLog(context,null,"-- HTTP  API Success ---");
                DBService.clearData();
            }

        } else {

           // Toast.makeText(this.context,"API Response fail",Toast.LENGTH_LONG).show();
            AppLog.i("HTTP API fail------");
           // NBLogger.getLoger().writeLog(context,null,"-- Tracking API Fail --- "+t.toString());

        }
    }




    public void publishData(String apiToken, String deviceId, final ArrayList<ApiLocationModel> apiLocationModels)
    {


        for(int i=0;i<apiLocationModels.size();i++)
        {
            apiLocationModels.get(i).setHt(System.currentTimeMillis());
        }

        if(mqttPublisher.isMqttManagerConnected())
        {
            Log.i(TAG,"ALREADY Connected");
            mqttPublisher.publish(apiLocationModels,topic);
        }
        else
        {
            if(mqttPublisher.getKeyStore()!=null) {
                mqttPublisher.connectMqtt(new OnMqtConnected() {
                    @Override
                    public void onMqttConnected(boolean isConnected) {
                        if (isConnected) {
                            Log.i(TAG, "Connected");
                            mqttPublisher.publish(apiLocationModels, topic);
                        }
                    }
                });
            }
            else
            {
                intiMqtt();
            }
        }
    }
    public void connectMqtt()
    {
        mqttPublisher.connectMqtt(new OnMqtConnected() {
            @Override
            public void onMqttConnected(boolean isConnected) {


            }
        });
    }

    public void intiMqtt()
    {
        mqttPublisher.initMqtt(context, new OnInitializeMqtt() {
            @Override
            public void onInitializeDone(boolean isInitialize) {
                if(isInitialize)
                {
                    Log.i(TAG,"Initialize Mqtt");
                    connectMqtt();
                }

            }
        });
    }

    public static boolean isNetworkAvailable(Context context) {
        final ConnectivityManager connectivityManager = ((ConnectivityManager) context.getSystemService(Context.CONNECTIVITY_SERVICE));
        return connectivityManager.getActiveNetworkInfo() != null && connectivityManager.getActiveNetworkInfo().isConnected();
    }
}
