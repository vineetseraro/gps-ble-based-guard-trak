package io.akwa.traquer.guardtrack.ui.guardtrack.data;

import com.google.gson.annotations.Expose;
import com.google.gson.annotations.SerializedName;

import java.util.List;

/**
 * Created by rohitkumar on 1/10/18.
 */

public class ScanRequest {


    @SerializedName("acc")
    @Expose
    private Double acc=0.0d;
    @SerializedName("alt")
    @Expose
    private Double alt=0.0d;
    @SerializedName("clientid")
    @Expose
    private String clientid="";
    @SerializedName("did")
    @Expose
    private String did="";
    @SerializedName("dir")
    @Expose
    private Integer dir=0;
    @SerializedName("ht")
    @Expose
    private Integer ht=0;
    @SerializedName("lat")
    @Expose
    private Double lat=0.0d;
    @SerializedName("lon")
    @Expose
    private Double lon=0.0;
    @SerializedName("pkid")
    @Expose
    private String pkid="";
    @SerializedName("projectid")
    @Expose
    private String projectid="android_fused";
    @SerializedName("prv")
    @Expose
    private String prv="";
    @SerializedName("sensors")
    @Expose
    private List<Sensor> sensors = null;
    @SerializedName("spd")
    @Expose
    private int spd=0;
    @SerializedName("ts")
    @Expose
    private long ts=0;
    @SerializedName("additionalInfo")
    @Expose
    private AdditionalInfo additionalInfo;

    public Double getAcc() {
        return acc;
    }

    public void setAcc(Double acc) {
        this.acc = acc;
    }

    public Double getAlt() {
        return alt;
    }

    public void setAlt(Double alt) {
        this.alt = alt;
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

    public Integer getDir() {
        return dir;
    }

    public void setDir(Integer dir) {
        this.dir = dir;
    }

    public Integer getHt() {
        return ht;
    }

    public void setHt(Integer ht) {
        this.ht = ht;
    }

    public Double getLat() {
        return lat;
    }

    public void setLat(Double lat) {
        this.lat = lat;
    }

    public Double getLon() {
        return lon;
    }

    public void setLon(Double lon) {
        this.lon = lon;
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

    public String getPrv() {
        return prv;
    }

    public void setPrv(String prv) {
        this.prv = prv;
    }

    public List<Sensor> getSensors() {
        return sensors;
    }

    public void setSensors(List<Sensor> sensors) {
        this.sensors = sensors;
    }

    public long getSpd() {
        return spd;
    }

    public void setSpd(Integer spd) {
        this.spd = spd;
    }

    public long getTs() {
        return ts;
    }

    public void setTs(long ts) {
        this.ts = ts;
    }

    public AdditionalInfo getAdditionalInfo() {
        return additionalInfo;
    }

    public void setAdditionalInfo(AdditionalInfo additionalInfo) {
        this.additionalInfo = additionalInfo;
    }

}
