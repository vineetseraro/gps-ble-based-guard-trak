package io.akwa.traquer.guardtrack.ui.notification;


import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.model.NotificationApiResponse;
import io.akwa.traquer.guardtrack.model.RemoveNotificationRequest;

public interface NotificationContract {

    interface View {
        void onNotificationReceive(NotificationApiResponse response, NicbitException e);
        void onNotificationRemoved(NotificationApiResponse response, NicbitException e);
    }

    interface UserActionsListener {
        void removeNotifications(RemoveNotificationRequest removeNotificationRequest);
        void getNotificationList();
    }
}
