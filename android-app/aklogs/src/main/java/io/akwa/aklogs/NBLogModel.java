package io.akwa.aklogs;

public class NBLogModel {
    private String uuid;
    private int major;
    private int  minor;
    private int range;
    private double latitude;
    private double longitude;
    private float accuracy;
    private String speed;
    private String alt;
    private String direction;
    private long timestamp;
    private String provider;
    private String pkid;
    private String code;
    private int isBluetooth;
    private double rssi;
    private double distance;
    boolean isApiSuccess;

    public boolean isApiSuccess() {
        return isApiSuccess;
    }

    public void setApiSuccess(boolean apiSuccess) {
        isApiSuccess = apiSuccess;
    }

    int isWifi;

    public int getIsWifi() {
        return isWifi;
    }

    public void setIsWifi(int isWifi) {
        this.isWifi = isWifi;
    }

    public int getIsBluetooth() {
        return isBluetooth;
    }

    public void setIsBluetooth(int isBluetooth) {
        this.isBluetooth = isBluetooth;
    }

    public String getPkid() {
        return pkid;
    }

    public void setPkid(String pkid) {
        this.pkid = pkid;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public double getLatitude() {
        return latitude;
    }

    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    public double getLongitude() {
        return longitude;
    }

    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    public long getTimestamp() {
        return timestamp;
    }

    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    public String getAlt() {
        return alt;
    }

    public void setAlt(String alt) {
        this.alt = alt;
    }

    public String getSpeed() {
        return speed;
    }

    public void setSpeed(String speed) {
        this.speed = speed;
    }

    public String getDirection() {
        return direction;
    }

    public void setDirection(String direction) {
        this.direction = direction;
    }

    public String getProvider() {
        return provider;
    }

    public void setProvider(String provider) {
        this.provider = provider;
    }

    public float getAccuracy() {
        return accuracy;
    }

    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }

    public String getUuid() {
        return uuid;
    }

    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    public int getMajor() {
        return major;
    }

    public void setMajor(int major) {
        this.major = major;
    }

    public int getMinor() {
        return minor;
    }

    public void setMinor(int minor) {
        this.minor = minor;
    }

    public int getRange() {
        return range;
    }

    public void setRange(int range) {
        this.range = range;
    }

    public double getRssi() {
        return rssi;
    }

    public void setRssi(double rssi) {
        this.rssi = rssi;
    }

    public double getDistance() {
        return distance;
    }

    public void setDistance(double distance) {
        this.distance = distance;
    }
}
