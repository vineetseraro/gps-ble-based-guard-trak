package io.akwa.aksync.network.model;

/**
 * The type Api beacon model.
 */
public class ApiBeaconModel extends ApiSensorModel{

    private String uuid;
    private String type="beacon";
    private int maj;
    private int  min;
    private int rng;
    private double rssi;
    private double dis;

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
     * Gets maj.
     *
     * @return the maj
     */
    public int getmaj() {
        return maj;
    }

    /**
     * Sets maj.
     *
     * @param maj the maj
     */
    public void setmaj(int maj) {
        this.maj = maj;
    }

    /**
     * Gets min.
     *
     * @return the min
     */
    public int getmin() {
        return min;
    }

    /**
     * Sets min.
     *
     * @param min the min
     */
    public void setmin(int min) {
        this.min = min;
    }

    /**
     * Gets rng.
     *
     * @return the rng
     */
    public int getrng() {
        return rng;
    }

    /**
     * Sets rng.
     *
     * @param rng the rng
     */
    public void setrng(int rng) {
        this.rng = rng;
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
     * @return the dis
     */
    public double getDistance() {
        return dis;
    }

    /**
     * Sets distance.
     *
     * @param dis the dis
     */
    public void setDistance(double dis) {
        this.dis = dis;
    }

}
