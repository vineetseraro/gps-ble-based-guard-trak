package io.akwa.traquer.guardtrack.model;

public class UpdateSettingsRequest {

    private String dashboardDefaultView;
    private String dashboardSortBy;
    private String dashboardSortOrder;
    private boolean notifications;
    private String silentHrsFrom;
    private String silentHrsTo;
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
}