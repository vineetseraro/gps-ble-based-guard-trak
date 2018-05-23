package io.akwa.aksync;

import io.realm.RealmList;
import io.realm.RealmObject;
import io.realm.annotations.PrimaryKey;

/**
 * The type Location realm.
 */
public class LocationRealm extends RealmObject {

    /**
     * The Timestamp.
     */
    @PrimaryKey
    long timestamp;
    /**
     * The Latitude.
     */
    double latitude;
    /**
     * The Longitude.
     */
    double longitude;
    /**
     * The Altitude.
     */
    double altitude;
    /**
     * The Speed.
     */
    float speed;
    /**
     * The Direction.
     */
    float direction;
    /**
     * The Accuracy.
     */
    float accuracy;
    /**
     * The Provider.
     */
    String provider;

      /* The Primary key for packet=deviceid+timestamp.
            */
    String pkid;

    public String getPkid() {
        return pkid;
    }

    public void setPkid(String pkid) {
        this.pkid = pkid;
    }

    /**
     * The Beacons.
     */
    RealmList<BeaconRealm> beacons;

    /**
     * Gets timestamp.
     *
     * @return the timestamp
     */
    public long getTimestamp() {
        return timestamp;
    }

    /**
     * Sets timestamp.
     *
     * @param timestamp the timestamp
     */
    public void setTimestamp(long timestamp) {
        this.timestamp = timestamp;
    }

    /**
     * Gets latitude.
     *
     * @return the latitude
     */
    public double getLatitude() {
        return latitude;
    }

    /**
     * Sets latitude.
     *
     * @param latitude the latitude
     */
    public void setLatitude(double latitude) {
        this.latitude = latitude;
    }

    /**
     * Gets longitude.
     *
     * @return the longitude
     */
    public double getLongitude() {
        return longitude;
    }

    /**
     * Sets longitude.
     *
     * @param longitude the longitude
     */
    public void setLongitude(double longitude) {
        this.longitude = longitude;
    }

    /**
     * Gets altitude.
     *
     * @return the altitude
     */
    public double getAltitude() {
        return altitude;
    }

    /**
     * Sets altitude.
     *
     * @param altitude the altitude
     */
    public void setAltitude(double altitude) {
        this.altitude = altitude;
    }

    /**
     * Gets speed.
     *
     * @return the speed
     */
    public float getSpeed() {
        return speed;
    }

    /**
     * Sets speed.
     *
     * @param speed the speed
     */
    public void setSpeed(float speed) {
        this.speed = speed;
    }

    /**
     * Gets direction.
     *
     * @return the direction
     */
    public float getDirection() {
        return direction;
    }

    /**
     * Sets direction.
     *
     * @param direction the direction
     */
    public void setDirection(float direction) {
        this.direction = direction;
    }

    /**
     * Gets accuracy.
     *
     * @return the accuracy
     */
    public float getAccuracy() {
        return accuracy;
    }

    /**
     * Sets accuracy.
     *
     * @param accuracy the accuracy
     */
    public void setAccuracy(float accuracy) {
        this.accuracy = accuracy;
    }

    /**
     * Gets provider.
     *
     * @return the provider
     */
    public String getProvider() {
        return provider;
    }

    /**
     * Sets provider.
     *
     * @param provider the provider
     */
    public void setProvider(String provider) {
        this.provider = provider;
    }

    /**
     * Gets beacons.
     *
     * @return the beacons
     */
    public RealmList<BeaconRealm> getBeacons() {
        return beacons;
    }

    /**
     * Sets beacons.
     *
     * @param beacons the beacons
     */
    public void setBeacons(RealmList<BeaconRealm> beacons) {
        this.beacons = beacons;
    }
}
