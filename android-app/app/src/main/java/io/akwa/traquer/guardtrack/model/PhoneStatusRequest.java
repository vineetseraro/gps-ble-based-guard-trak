package io.akwa.traquer.guardtrack.model;

public class PhoneStatusRequest {

    int bluetoothStatus ;
    int locationStatus;
     String  deviceId;
    String appCode;
    String os=null;

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getAppCode() {
        return appCode;
    }

    public void setAppCode(String appCode) {
        this.appCode = appCode;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public int getBluetoothStatus() {
        return bluetoothStatus;
    }

    public void setBluetoothStatus(int bluetoothStatus) {
        this.bluetoothStatus = bluetoothStatus;
    }

    public int getLocationStatus() {
        return locationStatus;
    }

    public void setLocationStatus(int locationStatus) {
        this.locationStatus = locationStatus;
    }
}
