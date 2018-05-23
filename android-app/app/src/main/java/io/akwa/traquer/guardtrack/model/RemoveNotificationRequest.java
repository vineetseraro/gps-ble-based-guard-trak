package io.akwa.traquer.guardtrack.model;

import java.util.ArrayList;

public class RemoveNotificationRequest {

    ArrayList<String> notificationIdList;
    boolean archiveAll;

    public ArrayList<String> getNotifications() {
        return notificationIdList;
    }

    public void setNotifications(ArrayList<String> notificationIdList) {
        this.notificationIdList = notificationIdList;
    }

    public boolean getDeleteAll() {
        return archiveAll;
    }

    public void setDeleteAll(boolean archiveAll) {
        this.archiveAll = archiveAll;
    }
}
