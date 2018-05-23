package io.akwa.traquer.guardtrack.ui.notification;


import io.akwa.traquer.guardtrack.common.network.ApiHandler;
import io.akwa.traquer.guardtrack.exception.NicbitException;
import io.akwa.traquer.guardtrack.listener.NotificationListListener;
import io.akwa.traquer.guardtrack.model.NotificationApiResponse;
import io.akwa.traquer.guardtrack.model.RemoveNotificationRequest;

public class NotificationPresenter implements NotificationContract.UserActionsListener,NotificationListListener {
    private final NotificationContract.View mNotificationView;

    public NotificationPresenter(NotificationContract.View mNotificationView) {
        this.mNotificationView = mNotificationView;
    }

    @Override
    public void removeNotifications(RemoveNotificationRequest removeNotificationRequest) {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setNotificationListListener(this);
        apiHandler.removeNotification(removeNotificationRequest);
    }

    @Override
    public void getNotificationList() {
        ApiHandler apiHandler = ApiHandler.getApiHandler();
        apiHandler.setNotificationListListener(this);
        apiHandler.getNotifications();
    }

    @Override
    public void onNotificationListReceive(NotificationApiResponse response, NicbitException e) {
        mNotificationView.onNotificationReceive(response, e);
    }

    @Override
    public void onNotificationRemove(NotificationApiResponse response, NicbitException e) {
        mNotificationView.onNotificationRemoved(response, e);

    }


}
