package io.akwa.traquer.guardtrack.model;

public class ReaderGetNotificationsResponse {

    String id;
    String type;
    String message;
    String title;
    String notificationTime;
    NewParams params;

    public String getNotificationId() {
        return id;
    }

    public void setNotificationId(String id) {
        this.id = id;
    }

    public NewParams getParams() {
        return params;
    }

    public void setParams(NewParams params) {
        this.params = params;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getNotificationDateTime() {
        return notificationTime;
    }

    public void setNotificationDateTime(String notificationTime) {
        this.notificationTime = notificationTime;
    }

    public String getNotificationType() {
        return type;
    }

    public void setNotificationType(String type) {
        this.type = type;
    }

    public String getMessage() {
        return message;
    }

    public void setMessage(String message) {
        this.message = message;
    }

}
