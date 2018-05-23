package io.akwa.akcore;

/**
 * The type Beacon data.
 */
public class BeaconData {
    /**
     * The Timestamp.
     */
    long timestamp;
    /**
     * The Uuid.
     */
    String uuid;
    /**
     * The Major.
     */
    int major;
    /**
     * The Minor.
     */
    int minor;
    /**
     * The Range.
     */
    int range;
    /**
     * The Rssi.
     */
    double rssi;
    /**
     * The Distance.
     */
    double distance;




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
     * Gets uuid.
     *
     * @return the uuid
     */
    public String getUuid() {
        return uuid;
    }

    /**
     * Sets uuid.
     *
     * @param uuid the uuid
     */
    public void setUuid(String uuid) {
        this.uuid = uuid;
    }

    /**
     * Gets major.
     *
     * @return the major
     */
    public int getMajor() {
        return major;
    }

    /**
     * Sets major.
     *
     * @param major the major
     */
    public void setMajor(int major) {
        this.major = major;
    }

    /**
     * Gets minor.
     *
     * @return the minor
     */
    public int getMinor() {
        return minor;
    }

    /**
     * Sets minor.
     *
     * @param minor the minor
     */
    public void setMinor(int minor) {
        this.minor = minor;
    }

    /**
     * Gets range.
     *
     * @return the range
     */
    public int getRange() {
        return range;
    }

    /**
     * Sets range.
     *
     * @param range the range
     */
    public void setRange(int range) {
        this.range = range;
    }

    /**
     * Gets rssi.
     *
     * @return the rssi
     */
    public double getRssi() {
        return rssi;
    }

    /**
     * Sets rssi.
     *
     * @param rssi the rssi
     */
    public void setRssi(double rssi) {
        this.rssi = rssi;
    }

    /**
     * Gets distance.
     *
     * @return the distance
     */
    public double getDistance() {
        return distance;
    }

    /**
     * Sets distance.
     *
     * @param distance the distance
     */
    public void setDistance(double distance) {
        this.distance = distance;
    }

    @Override
    public int hashCode() {
        return this.minor;
    }

    @Override
    public boolean equals(Object obj) {
        BeaconData e = (BeaconData) obj;
        return this.minor==e.minor;
    }
}
