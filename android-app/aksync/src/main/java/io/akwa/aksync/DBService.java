package io.akwa.aksync;

import io.akwa.aksync.network.model.ApiBeaconModel;
import io.akwa.aksync.network.model.ApiLocationModel;
import io.akwa.aksync.network.model.ApiSensorModel;

import java.util.ArrayList;

import io.realm.Realm;
import io.realm.RealmResults;

/**
 * The type Db service.
 */
public class DBService {
    /**
     * Save and get location list array list.
     *
     * @param currentLocationRealm the current location realm
     * @return the array list
     */
    public static ArrayList<ApiLocationModel> saveAndGetLocationList(final LocationRealm currentLocationRealm, String deviceId, String clientId, String projectId, String code){
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                realm.copyToRealmOrUpdate(currentLocationRealm);
            }
        });
        RealmResults<LocationRealm> locationRealmList = realm.where(LocationRealm.class).findAll();
        long count = realm.where(LocationRealm.class).count();
        AppLog.i("count location ---"+count);
        long beacon = realm.where(BeaconRealm.class).count();
        AppLog.i("count beacon ---"+beacon);
        long ht=System.currentTimeMillis();

        ArrayList<ApiLocationModel> apiLocationModels = new ArrayList<>();
        for (LocationRealm locationRealm : locationRealmList) {
            ApiLocationModel apiLocationModel = new ApiLocationModel();
            apiLocationModel.setacc(locationRealm.getAccuracy());
            apiLocationModel.setalt(locationRealm.getAltitude());
            apiLocationModel.setdir(locationRealm.getDirection());
            apiLocationModel.setlat(locationRealm.getLatitude());
            apiLocationModel.setlon(locationRealm.getLongitude());
            apiLocationModel.setprv(locationRealm.getProvider());
            apiLocationModel.setspd(locationRealm.getSpeed());
            apiLocationModel.setts(locationRealm.getTimestamp());
            apiLocationModel.setHt(ht);
            apiLocationModel.setDid(code);
            apiLocationModel.setDeviceId(deviceId);
            apiLocationModel.setClientid(clientId);
            apiLocationModel.setProjectid(projectId);
            apiLocationModel.setPkid(locationRealm.getPkid());
            ArrayList<ApiSensorModel> beacons = new ArrayList<>();
            for (BeaconRealm beaconData : locationRealm.getBeacons()) {
                ApiBeaconModel beaconModel = new ApiBeaconModel();
                beaconModel.setDistance(beaconData.getDistance());
                beaconModel.setmaj(beaconData.getMajor());
                beaconModel.setmin(beaconData.getMinor());
                beaconModel.setrng(beaconData.getRange());
                beaconModel.setRssi(beaconData.getRssi());
                beaconModel.setUuid(beaconData.getUuid());
                beacons.add(beaconModel);
            }
            apiLocationModel.setsensors(beacons);
            apiLocationModels.add(apiLocationModel);
        }
        realm.close();
        return apiLocationModels;
    }

    /**
     * Clear data.
     */
    public static void clearData(){
        Realm realm = Realm.getDefaultInstance();
        realm.executeTransaction(new Realm.Transaction() {
            @Override
            public void execute(Realm realm) {
                realm.delete(LocationRealm.class);
                realm.delete(BeaconRealm.class);
            }
        });
        realm.close();
    }
}
