package io.akwa.aksync.network.model;

import java.util.List;

/**
 * The type Api location model.
 */
public class ApiLocationModel {
    private double lat;
    private double lon;
    private long ts;
    private double alt;
    private float spd;
    private float dir;
    private String prv;
    private String did;
    private String projectid;
    private String clientid;
    private  String deviceId;

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    //sujoy column
   boolean isApiHit;

    public boolean isApiHit() {
        return isApiHit;
    }

    public void setApiHit(boolean apiHit) {
        isApiHit = apiHit;
    }

    private String pkid;


    private long ht;

    public long getHt() {
        return ht;
    }

    public void setHt(long ht) {
        this.ht = ht;
    }

    public String getPkid() {
        return pkid;
    }

    public void setPkid(String pkid) {
        this.pkid = pkid;
    }

    public String getProjectid() {
        return projectid;
    }

    public void setProjectid(String projectid) {
        this.projectid = projectid;
    }

    public String getClientid() {
        return clientid;
    }

    public void setClientid(String clientid) {
        this.clientid = clientid;
    }

    public String getDid() {
        return did;
    }

    public void setDid(String did) {
        this.did = did;
    }

    private float acc;
    private List<ApiSensorModel> sensors = null;

    /**
     * Gets lat.
     *
     * @return the lat
     */
    public double getlat() {
        return lat;
    }

    /**
     * Sets lat.
     *
     * @param lat the lat
     */
    public void setlat(double lat) {
        this.lat = lat;
    }

    /**
     * Gets lon.
     *
     * @return the lon
     */
    public double getlon() {
        return lon;
    }

    /**
     * Sets lon.
     *
     * @param lon the lon
     */
    public void setlon(double lon) {
        this.lon = lon;
    }

    /**
     * Gets ts.
     *
     * @return the ts
     */
    public long getts() {
        return ts;
    }

    /**
     * Sets ts.
     *
     * @param ts the ts
     */
    public void setts(long ts) {
        this.ts = ts;
    }

    /**
     * Gets alt.
     *
     * @return the alt
     */
    public double getalt() {
        return alt;
    }

    /**
     * Sets alt.
     *
     * @param alt the alt
     */
    public void setalt(double alt) {
        this.alt = alt;
    }

    /**
     * Gets spd.
     *
     * @return the spd
     */
    public float getspd() {
        return spd;
    }

    /**
     * Sets spd.
     *
     * @param spd the spd
     */
    public void setspd(float spd) {
        this.spd = spd;
    }

    /**
     * Gets dir.
     *
     * @return the dir
     */
    public float getdir() {
        return dir;
    }

    /**
     * Sets dir.
     *
     * @param dir the dir
     */
    public void setdir(float dir) {
        this.dir = dir;
    }

    /**
     * Gets prv.
     *
     * @return the prv
     */
    public String getprv() {
        return prv;
    }

    /**
     * Sets prv.
     *
     * @param prv the prv
     */
    public void setprv(String prv) {
        this.prv = prv;
    }

    /**
     * Gets acc.
     *
     * @return the acc
     */
    public float getacc() {
        return acc;
    }

    /**
     * Sets acc.
     *
     * @param acc the acc
     */
    public void setacc(float acc) {
        this.acc = acc;
    }

    /**
     * Gets sensors.
     *
     * @return the sensors
     */
    public List<ApiSensorModel> getsensors() {
        return sensors;
    }

    /**
     * Sets sensors.
     *
     * @param sensors the sensors
     */
    public void setsensors(List<ApiSensorModel> sensors) {
        this.sensors = sensors;
    }
}
