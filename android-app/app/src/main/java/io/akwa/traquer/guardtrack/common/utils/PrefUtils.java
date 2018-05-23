package io.akwa.traquer.guardtrack.common.utils;

import android.content.Context;
import android.content.SharedPreferences;
import android.content.SharedPreferences.Editor;

import com.urbanairship.UAirship;

import io.akwa.traquer.guardtrack.common.cognito.CognitoServices;

public class PrefUtils {

    private static Context context;
    private static SharedPreferences pref;
    private static Editor editor;
    private static String prefName = "stryker";
    private static int PrivateMode = 0;

    private static String accessToken = "token";
    private static String clientId= "client_id";
    private static String projectId = "project_id";
    private static String deviceId = "device_id";
    private static String code = "code";
    private static String minor = "minor";
    private static String major = "major";
    private static String uuid = "uuid";
    private static String logStatus = "logstatus";
    private static String settingFetched = "isSettingfatched";
    private static String trackingsettings = "trackingsetting";
    private static final String isLinkedDevice = "isLinkedDevice";




    private static String isLogin = "islogin";
    private static String sessionToken = "isSessionToken";
    private static String emailId = "email_id";
    private static String firstName = "first_name";
    private static String lastName = "last_name";
    private static String mobile = "mobile";
    private static String city = "city";
    private static String countryCode = "country_code";
    private static String companyName = "companyName";
    private static String country = "country";
    private static String defaultView = "defaultView";
    private static String sortBy = "sortBy";
    private static String sortOrder = "sortOrder";
    private static String beaconStatus = "beaconStatus";
    private static String notification = "notification";
    private static String sound = "sound";
    private static String vibration = "vibration";
    private static String led = "led";
    private static String userImageUrl = "user_image_url";
    private static String recentSearch = "recent_search";
    private static String inventoryLocation = "inventory_location";
    private static String USER_ROLE = "user_role";
    private static String isLocationDialogChoosed = "location_dialog";
    private static String BEACON_SCANNING_TIME = "beacon_scaning_time";
    private static String SCANNING_MODE = "beacon_scaning_mode";
    private static String IS_DEVICE_UPDATED_TO_SERVER = "is_device_update_to_server";
    private static String USER_SUB = "sub";



    public PrefUtils(Context context) {
        PrefUtils.context = context;
        pref = context.getSharedPreferences(prefName, PrivateMode);
        editor = pref.edit();
        editor.commit();
    }


    public static String getAccessToken() {
        return pref.getString(accessToken, "");

    }
    public static int getBeaconScanTime() {
        return pref.getInt(BEACON_SCANNING_TIME, 20);

    }
    public static void setCode(String projectid) {
        editor.putString(code, projectid);
        editor.commit();
    }
//    public static String getScanningMode() {
//        return pref.getString(SCANNING_MODE, StringUtils.PASSIVE_MODE);
//
//    }

    public static void setAccessToken(String token) {
        editor.putString(accessToken, token);
        editor.commit();
    }
    public static void setLinkedDevice(boolean isDeviceLinked) {
        editor.putBoolean(isLinkedDevice, isDeviceLinked);
        editor.commit();
    }
    public static void setUserSub(String sub) {
        editor.putString(USER_SUB, sub);
        editor.commit();
    }
    public static void setSettingFetched(boolean isSettingFetched) {
        editor.putBoolean(settingFetched, isSettingFetched);
        editor.commit();
    }
    public static void setProjectId(String projectid) {
        editor.putString(projectid, projectid);
        editor.commit();
    }
    public static void setClientId(String client_id) {
        editor.putString(clientId, client_id);
        editor.commit();
    }

    public static void setDeviceId(String deviceId) {
        editor.putString(deviceId, deviceId);
        editor.commit();
    }


    public static void setUserRole(String role) {
        editor.putString(USER_ROLE, role);
        editor.commit();
    }
    public static void setScanningMode(String mode) {
        editor.putString(SCANNING_MODE, mode);
        editor.commit();
    }
    public static void setBeaconScanningTime(int time) {
        editor.putInt(BEACON_SCANNING_TIME, time);
        editor.commit();
    }
    public static void setIsDeviceUpdatedToServer(boolean deviceUpdate) {
        editor.putBoolean(IS_DEVICE_UPDATED_TO_SERVER, deviceUpdate);
        editor.commit();
    }


    public static String getSessionToken() {
        return pref.getString(sessionToken, "");

    }
    public static String getUserSub() {
        return pref.getString(USER_SUB, "");

    }
    public static boolean getIsDeviceUpdatedToServer() {
        return pref.getBoolean(IS_DEVICE_UPDATED_TO_SERVER,false);

    }


    public static String getUserRole() {
        return pref.getString(USER_ROLE, "");

    }

    public static void setSessionToken(String token) {
        editor.putString(sessionToken, token);
        editor.commit();
    }
    public static void setUuid(String uuidd) {
        editor.putString(uuid, uuidd);
        editor.commit();
    }
    public static void setMajor(int majorr) {
        editor.putInt(major, majorr);
        editor.commit();
    }
    public static void setMinor(int minorr) {
        editor.putInt(minor, minorr);
        editor.commit();
    }

    public static boolean isUserLogin() {
        return pref.getBoolean(isLogin, false);
    }

    public static void setUserLogin(boolean b) {
        editor.putBoolean(isLogin, b);
        editor.commit();
    }

    public static void clearDataOnLogout() {
        UAirship.shared().getNamedUser().setId("");
        String code=getCode();
        boolean beaconStatus=getBeaconStatus();
        int  major=getMajor();
        int minor=getMinor();
        String projectId=getProjectId();
        String  clinetID=getClientId();
        String deviceID=getDeviceId();
        String uuid=getUuid();

        CognitoServices.logOut();
        UAirship.shared().getNamedUser().setId("");
        editor.clear();
        editor.commit();
        setBeaconStatus(true);
        PrefUtils.setProjectId(projectId);
        PrefUtils.setClientId(clinetID);
        PrefUtils.setCode(code);
        PrefUtils.setDeviceId(deviceID);
        PrefUtils.setUuid(uuid);
        PrefUtils.setMajor(major);
        PrefUtils.setMinor(minor);
    }

    public static String getEmail() {
        return pref.getString(emailId, "");
    }

    public static void setEmail(String email) {
        editor.putString(emailId, email);
        editor.commit();

    }

    public static String getFirstName() {
        return pref.getString(firstName, "Guest");
    }

    public static void setFirstName(String fname) {
        editor.putString(firstName, fname);
        editor.commit();
    }

    public static String getLastName() {
        return pref.getString(lastName, " ");
    }

    public static String getClientId() {
        return pref.getString(clientId, " ");
    }
    public static String getProjectId() {
        return pref.getString(projectId, " ");
    }

    public static String getDeviceId() {
        return pref.getString(deviceId, "");
    }


    public static void setLastName(String lname) {
        editor.putString(lastName, lname);
        editor.commit();

    }

    public static String getMobile() {
        return pref.getString(mobile, "");
    }


    public static String getUuid() {
        return pref.getString(uuid,"");
    }
    public static int getMajor() {
        return pref.getInt(major, 0);
    }
    public static int getMinor() {
        return pref.getInt(minor, 0);
    }

    public static void setMobile(String phone) {
        editor.putString(mobile, phone);
        editor.commit();

    }

    public static String getCity() {
        return pref.getString(city, "");
    }

    public static void setCity(String cityy) {
        editor.putString(city, cityy);
        editor.commit();

    }



    public static String getCountryCode() {
        return pref.getString(countryCode, "");
    }
    public static String getCode() {
        return pref.getString(code, "");
    }

    public static void setCountryCode(String cntryCode) {
        editor.putString(countryCode, cntryCode);
        editor.commit();

    }

    public static String getCompanyName() {
        return pref.getString(companyName, "");
    }

    public static void setCompanyName(String name) {
        editor.putString(companyName, name);
        editor.commit();

    }

    public static void setTrackingSettings(String name) {
        editor.putString(trackingsettings, name);
        editor.commit();

    }

    public static String getTrackingSettings() {
        return pref.getString(trackingsettings, "");

    }
    public static String getCountry() {
        return pref.getString(country, "");
    }

    public static void setCountry(String countryName) {
        editor.putString(country, countryName);
        editor.commit();
    }

    public static String getDefaultView() {
        return pref.getString(defaultView, "All");
    }

    public static void setDefaultView(String s) {
        editor.putString(defaultView, s);
        editor.commit();
    }


    public static String getSortBy() {
        return pref.getString(sortBy, "code");
    }
    public static boolean getBeaconStatus() {
        return pref.getBoolean(beaconStatus, true);
    }

    public static void setSortBy(String s) {
        editor.putString(sortBy, s);
        editor.commit();
    }

    public static String getSortOrder() {
        return pref.getString(sortOrder, "asc");
    }

    public static void setSortOrder(String s) {
        editor.putString(sortOrder, s);
        editor.commit();
    }

    public static boolean getNotification() {
        return pref.getBoolean(notification, true);
    }

    public static void setNotification(boolean s) {
        editor.putBoolean(notification, s);
        editor.commit();
    }

    public static String getSound() {
        return pref.getString(sound, "");
    }

    public static void setSound(String s) {
        editor.putString(sound, s);
        editor.commit();
    }

    public static String getVibration() {
        return pref.getString(vibration, "");
    }

    public static void setVibration(String s) {
        editor.putString(vibration, s);
        editor.commit();
    }

    public static String getLed() {
        return pref.getString(led, "");
    }

    public static void setLed(String s) {
        editor.putString(led, s);
        editor.commit();
    }

    public static void setBeaconStatus(boolean s) {
        editor.putBoolean(beaconStatus, s);
        editor.commit();
    }

    public static void setUserImageUrl(String imageUrl) {
        editor.putString(userImageUrl, imageUrl);
        editor.commit();
    }
    public static void setLogStatus(boolean status) {
        editor.putBoolean(logStatus, status);
        editor.commit();
    }

    public static String getUserImageUrl() {
        return pref.getString(userImageUrl, "");
    }


    public static void setRecentSearch(String recentlySearched) {
        editor.putString(recentSearch, recentlySearched);
        editor.commit();
    }

    public static String getRecentSearch() {
        return pref.getString(recentSearch, "");
    }

    public static void setInventoryLocation(String locationData) {
        editor.putString(inventoryLocation, locationData);
        editor.commit();
    }


    public static String getInventoryLocation() {
        return pref.getString(inventoryLocation, "");

    }

    public static boolean isDeviceLinked() {
        return pref.getBoolean(isLinkedDevice, false);

    }
    public static boolean getSettingFetched() {
        return pref.getBoolean(settingFetched, false);

    }

    public static boolean isLocationDialogChoosed() {
        return pref.getBoolean(isLocationDialogChoosed, false);
    }
    public static boolean getLogStatus() {
        return pref.getBoolean(logStatus, true);
    }

    public static void setLocationDialogChoosed(boolean b) {
        editor.putBoolean(isLocationDialogChoosed, b);
        editor.commit();
    }
}


