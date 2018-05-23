package io.akwa.aksync.network.model;

import java.util.ArrayList;

/**
 * Created by niteshgoel on 10/24/17.
 */

public class ApiTempModel extends ApiSensorModel {

    private String uid;
    private long startTime;
    private long endTime;
    private int breachCount;
    private int breachDuration;
    private float maxRecordedTemp;
    private float minRecordedTemp;
    private float lastRecordedTemp;
    private double avgTemp;
    private double kineticMeanTemp;
    private long totalDuration;
    private long cycle;
    private float maxTemp;
    private float minTemp;
    private long expDate;
    private String type;
    public Float[] temp;
    ArrayList<ApiBreachInfoModel> breachInfos;


    public String getUid() {
        return uid;
    }

    public void setUid(String uid) {
        this.uid = uid;
    }

    public long getStartTime() {
        return startTime;
    }

    public void setStartTime(long startTime) {
        this.startTime = startTime;
    }

    public long getEndTime() {
        return endTime;
    }

    public void setEndTime(long endTime) {
        this.endTime = endTime;
    }

    public int getBreachCount() {
        return breachCount;
    }

    public void setBreachCount(int breachCount) {
        this.breachCount = breachCount;
    }

    public int getBreachDuration() {
        return breachDuration;
    }

    public void setBreachDuration(int breachDuration) {
        this.breachDuration = breachDuration;
    }

    public float getMaxRecordedTemp() {
        return maxRecordedTemp;
    }

    public void setMaxRecordedTemp(float maxRecordedTemp) {
        this.maxRecordedTemp = maxRecordedTemp;
    }

    public float getMinRecordedTemp() {
        return minRecordedTemp;
    }

    public void setMinRecordedTemp(float minRecordedTemp) {
        this.minRecordedTemp = minRecordedTemp;
    }

    public float getLastRecordedTemp() {
        return lastRecordedTemp;
    }

    public void setLastRecordedTemp(float lastRecordedTemp) {
        this.lastRecordedTemp = lastRecordedTemp;
    }

    public double getAvgTemp() {
        return avgTemp;
    }

    public void setAvgTemp(double avgTemp) {
        this.avgTemp = avgTemp;
    }

    public double getKineticMeanTemp() {
        return kineticMeanTemp;
    }

    public void setKineticMeanTemp(double kineticMeanTemp) {
        this.kineticMeanTemp = kineticMeanTemp;
    }

    public long getTotalDuration() {
        return totalDuration;
    }

    public void setTotalDuration(long totalDuration) {
        this.totalDuration = totalDuration;
    }

    public long getCycle() {
        return cycle;
    }

    public void setCycle(long cycle) {
        this.cycle = cycle;
    }

    public float getMaxTemp() {
        return maxTemp;
    }

    public void setMaxTemp(float maxTemp) {
        this.maxTemp = maxTemp;
    }

    public float getMinTemp() {
        return minTemp;
    }

    public void setMinTemp(float minTemp) {
        this.minTemp = minTemp;
    }

    public long getExpDate() {
        return expDate;
    }

    public void setExpDate(long expDate) {
        this.expDate = expDate;
    }

    public String getType() {
        return type;
    }

    public void setType(String type) {
        this.type = type;
    }

    public Float[] getTemp() {
        return temp;
    }

    public void setTemp(Float[] temp) {
        this.temp = temp;
    }

    public ArrayList<ApiBreachInfoModel> getBreachInfos() {
        return breachInfos;
    }

    public void setBreachInfos(ArrayList<ApiBreachInfoModel> breachInfos) {
        this.breachInfos = breachInfos;
    }
}
