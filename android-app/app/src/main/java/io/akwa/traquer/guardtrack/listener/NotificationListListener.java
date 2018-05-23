package io.akwa.traquer.guardtrack.listener;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.NotificationApiResponse;

public interface NotificationListListener {
    void onNotificationListReceive(NotificationApiResponse response, NicbitException e);
    void onNotificationRemove(NotificationApiResponse response, NicbitException e);
}
