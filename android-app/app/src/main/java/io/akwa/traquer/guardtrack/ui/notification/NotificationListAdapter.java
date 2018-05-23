package io.akwa.traquer.guardtrack.ui.notification;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import com.daimajia.swipe.SwipeLayout;
import com.daimajia.swipe.adapters.RecyclerSwipeAdapter;


import java.util.ArrayList;
import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.Constant;
import io.akwa.traquer.guardtrack.model.ReaderGetNotificationsResponse;

public class NotificationListAdapter extends RecyclerSwipeAdapter<NotificationListAdapter.ViewHolder> implements View.OnClickListener {

    private ArrayList<ReaderGetNotificationsResponse> mNotificationList;
    private Context mContext;
    NotificationListClickListener notificationListClickListener;

    public NotificationListAdapter(NotificationListClickListener notificationListClickListener,
                                   Context context, ArrayList<ReaderGetNotificationsResponse> caseHistoryList) {
        this.mNotificationList = caseHistoryList;
        this.mContext = context;
        this.notificationListClickListener = notificationListClickListener;

    }

    @Override
    public void onClick(View view) {

    }


    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.notification_item, parent,false);
        return (new ViewHolder(itemLayoutView));
    }


    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {

        final ReaderGetNotificationsResponse data = mNotificationList.get(position);
        if (data != null) {

            holder.messageTv.setText(data.getMessage());
            holder.titleTv.setText(data.getTitle());
            holder.dateTv.setText(data.getNotificationDateTime());
            switch (data.getNotificationType()) {
                case Constant.NotificationType.GPSBluetoothDown:
                case Constant.NotificationType.ShipmentPartialDeliveredCR:
                case Constant.NotificationType.ShipmentPartialShippedCR:
                case Constant.NotificationType.ShipmentPartialShippedSR:
                case Constant.NotificationType.ShipmentPartialDeliveredSR:
                case Constant.NotificationType.SurgeryDateChange:
                case Constant.NotificationType.IssueRespondedSR:
                case Constant.NotificationType.IssueCreatedSR:
                case Constant.NotificationType.IssueRespondedCR:
                case Constant.NotificationType.IssueCreatedCR:
                case Constant.NotificationType.BeaconServiceOff:
                case Constant.NotificationType.ShipmentDelayedCR:
                case Constant.NotificationType.ShipmentDelayedSR:
                    holder.icon.setImageResource(R.drawable.icon_reported); break;
                case Constant.NotificationType.OrderCreation:
                case Constant.NotificationType.ShipmentSoftDeliveredCR:
                case Constant.NotificationType.ShipmentHardDeliveredCR:
                case Constant.NotificationType.ShipmentHardShippedCR:
                case Constant.NotificationType.ShipmentHardShippedSR:
                case Constant.NotificationType.ShipmentScheduledCR:
                case Constant.NotificationType.ShipmentSoftDeliveredSR:
                case Constant.NotificationType.ShipmentHardDeliveredSR:
                case Constant.NotificationType.ShipmentSoftShippedSR:
                case Constant.NotificationType.ShipmentScheduledSR:
                case Constant.NotificationType.CarrierAssignment:
                case Constant.NotificationType.OrderAssignedFromSalesRep:
                case Constant.NotificationType.OrderAssignedToSalesRep:
                    holder.icon.setImageResource(R.drawable.alert_icon); break;
            }

            holder.mainRl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {

                    notificationListClickListener.onNotificationClicked(data);
                }
            });

            holder.tvDelete.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {
                    notificationListClickListener.removeNotificationClicked(data.getNotificationId());
                    mNotificationList.remove(position);
                    holder.swipeLayout.close(true);
                }
            });

            holder.swipeLayout.setShowMode(SwipeLayout.ShowMode.PullOut);
            holder.swipeLayout.addDrag(SwipeLayout.DragEdge.Right, holder.swipeLayout.findViewById(R.id.bottom_wrapper));
            holder.swipeLayout.setLeftSwipeEnabled(false);

            mItemManger.bindView(holder.itemView, position);

        }
    }

    public void addAll(List<ReaderGetNotificationsResponse> notifications) {
        mNotificationList.clear();
        mNotificationList.addAll(notifications);
        mNotificationList.remove(new ReaderGetNotificationsResponse());
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        if (mNotificationList != null)
            return mNotificationList.size();
        return 0;
    }

    @Override
    public int getSwipeLayoutResourceId(int position) {
        return R.id.swipe;
    }

    public void clearAll() {
        mNotificationList.clear();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {
        ImageView icon;
        TextView titleTv, messageTv, dateTv,tvDelete;
        RelativeLayout mainRl;
        SwipeLayout swipeLayout;

        public ViewHolder(View itemView) {
            super(itemView);
            titleTv = (TextView) itemView.findViewById(R.id.tv_title);
            dateTv = (TextView) itemView.findViewById(R.id.tv_date);
            tvDelete = (TextView) itemView.findViewById(R.id.tv_delete);
            messageTv = (TextView) itemView.findViewById(R.id.tv_message);
            icon = (ImageView) itemView.findViewById(R.id.icon);
            mainRl = (RelativeLayout) itemView.findViewById(R.id.rl_main);
            swipeLayout = (SwipeLayout) itemView.findViewById(R.id.swipe);
        }
    }

    public interface NotificationListClickListener {
        void onNotificationClicked(ReaderGetNotificationsResponse data);
        void removeNotificationClicked(String notification);
    }
}