package io.akwa.traquer.guardtrack.model;

import io.akwa.trakit.rulehandler.GetTrackingSettingResponse;

public class ReaderGetSettingsResponse {

    private String dashboardDefaultView;
    private String dashboardSortBy;
    private String dashboardSortOrder;
    private boolean notifications;
    private String sound;
    private String silentHrsFrom;
    private String silentHrsTo;
    private String vibration;
    private String led;

    private GetTrackingSettingResponse.TrackingHours trackingHours;

    public GetTrackingSettingResponse.TrackingHours getTrackingHours() {
        return trackingHours;
    }

    public void setTrackingHours(GetTrackingSettingResponse.TrackingHours trackingHours) {
        this.trackingHours = trackingHours;
    }

    private boolean beaconServiceStatus;

    public boolean getBeaconServiceStatus() {
        return beaconServiceStatus;
    }

    public void setBeaconServiceStatus(boolean beaconServiceStatus) {
        this.beaconServiceStatus = beaconServiceStatus;
    }

    /**
     * @return The dashboardDefaultView
     */
    public String getDashboardDefaultView() {
        return dashboardDefaultView;
    }

    /**
     * @param dashboardDefaultView The dashboardDefaultView
     */
    public void setDashboardDefaultView(String dashboardDefaultView) {
        this.dashboardDefaultView = dashboardDefaultView;
    }

    /**
     * @return The dashboardSortBy
     */
    public String getDashboardSortBy() {
        return dashboardSortBy;
    }

    /**
     * @param dashboardSortBy The dashboardSortBy
     */
    public void setDashboardSortBy(String dashboardSortBy) {
        this.dashboardSortBy = dashboardSortBy;
    }

    /**
     * @return The dashboardSortOrder
     */
    public String getDashboardSortOrder() {
        return dashboardSortOrder;
    }

    /**
     * @param dashboardSortOrder The dashboardSortOrder
     */
    public void setDashboardSortOrder(String dashboardSortOrder) {
        this.dashboardSortOrder = dashboardSortOrder;
    }

    /**
     * @return The notifications
     */
    public boolean getNotifications() {
        return notifications;
    }

    /**
     * @param notifications The notifications
     */
    public void setNotifications(boolean notifications) {
        this.notifications = notifications;
    }

    /**
     * @return The sound
     */
    public String getSound() {
        return sound;
    }

    /**
     * @param sound The sound
     */
    public void setSound(String sound) {
        this.sound = sound;
    }

    /**
     * @return The silentHrsFrom
     */
    public String getSilentHrsFrom() {
        return silentHrsFrom;
    }

    /**
     * @param silentHrsFrom The silentHrsFrom
     */
    public void setSilentHrsFrom(String silentHrsFrom) {
        this.silentHrsFrom = silentHrsFrom;
    }

    /**
     * @return The silentHrsTo
     */
    public String getSilentHrsTo() {
        return silentHrsTo;
    }

    /**
     * @param silentHrsTo The silentHrsTo
     */
    public void setSilentHrsTo(String silentHrsTo) {
        this.silentHrsTo = silentHrsTo;
    }

    /**
     * @return The vibration
     */
    public String getVibration() {
        return vibration;
    }

    /**
     * @param vibration The vibration
     */
    public void setVibration(String vibration) {
        this.vibration = vibration;
    }

    /**
     * @return The led
     */
    public String getLed() {
        return led;
    }

    /**
     * @param led The led
     */
    public void setLed(String led) {
        this.led = led;
    }

}