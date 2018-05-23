package io.akwa.traquer.guardtrack.common.updatedevice;


import io.akwa.traquer.guardtrack.model.Client;

public class DeviceInfo {

    String deviceId;
    String os;
    String manufacturer;
    String model;
    String version;
    String channelId;
    String appVersion;
    String pushIdentifier="";

    int locationStatus;
    int bluetoothStatus;

    public String getPushIdentifier() {
        return pushIdentifier;
    }

    public void setPushIdentifier(String pushIdentifier) {
        this.pushIdentifier = pushIdentifier;
    }

    public int getLocationStatus() {
        return locationStatus;
    }

    public void setLocationStatus(int locationStatus) {
        this.locationStatus = locationStatus;
    }

    public int getBluetoothStatus() {
        return bluetoothStatus;
    }

    public void setBluetoothStatus(int bluetoothStatus) {
        this.bluetoothStatus = bluetoothStatus;
    }

    public String getAppName() {
        return appName;
    }

    public void setAppName(String appName) {
        this.appName = appName;
    }

    Client client;
    String appName;

    public String getAppVersion() {
        return appVersion;
    }

    public void setAppVersion(String appVersion) {
        this.appVersion = appVersion;
    }


    public Client getClient() {
        return client;
    }

    public void setClient(Client client) {
        this.client = client;
    }

    int status = 1;
    String name = "androiddevice";

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getChannelId() {
        return channelId;
    }
    public void setChannelId(String channelId) {
        this.channelId = channelId;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getOs() {
        return os;
    }

    public void setOs(String os) {
        this.os = os;
    }

    public String getManufacturer() {
        return manufacturer;
    }

    public void setManufacturer(String manufacturer) {
        this.manufacturer = manufacturer;
    }

    public String getModel() {
        return model;
    }

    public void setModel(String model) {
        this.model = model;
    }

    public String getVersion() {
        return version;
    }

    public void setVersion(String version) {
        this.version = version;
    }
}
