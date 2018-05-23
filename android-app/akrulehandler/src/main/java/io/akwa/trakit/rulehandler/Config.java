package io.akwa.trakit.rulehandler;

import io.akwa.akcore.BeaconData;

/**
 * Created by rohitkumar on 11/27/17.
 */

public class Config {

   String  apiToken;
    String deviceId;
    String projectId;
    String clientId;
    String code;
    String trackingTimeJson;
    BeaconData beaconData;

    public Config(String apiToken, String deviceId, String projectId, String clientId, String code, String trackingTimeJson, BeaconData beaconData) {
        this.apiToken = apiToken;
        this.deviceId = deviceId;
        this.projectId = projectId;
        this.clientId = clientId;
        this.code = code;
        this.trackingTimeJson = trackingTimeJson;
        this.beaconData = beaconData;
    }

    public String getApiToken() {
        return apiToken;
    }

    public void setApiToken(String apiToken) {
        this.apiToken = apiToken;
    }

    public String getDeviceId() {
        return deviceId;
    }

    public void setDeviceId(String deviceId) {
        this.deviceId = deviceId;
    }

    public String getProjectId() {
        return projectId;
    }

    public void setProjectId(String projectId) {
        this.projectId = projectId;
    }

    public String getClientId() {
        return clientId;
    }

    public void setClientId(String clientId) {
        this.clientId = clientId;
    }

    public String getCode() {
        return code;
    }

    public void setCode(String code) {
        this.code = code;
    }

    public String getTrackingTimeJson() {
        return trackingTimeJson;
    }

    public void setTrackingTimeJson(String trackingTimeJson) {
        this.trackingTimeJson = trackingTimeJson;
    }

    public BeaconData getBeaconData() {
        return beaconData;
    }

    public void setBeaconData(BeaconData beaconData) {
        this.beaconData = beaconData;
    }
}
