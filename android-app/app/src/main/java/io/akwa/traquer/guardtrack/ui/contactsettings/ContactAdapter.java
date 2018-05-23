package io.akwa.traquer.guardtrack.ui.contactsettings;

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


import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.ui.contactsettings.model.GetContactSettingsResponse;

public class ContactAdapter extends RecyclerSwipeAdapter<ContactAdapter.ViewHolder> implements View.OnClickListener {

    private List<GetContactSettingsResponse.Contact> mNotificationList;
    private Context mContext;
    NotificationListClickListener notificationListClickListener;

    public ContactAdapter(NotificationListClickListener notificationListClickListener,
                          Context context, List<GetContactSettingsResponse.Contact> caseHistoryList) {
        this.mNotificationList = caseHistoryList;
        this.mContext = context;
        this.notificationListClickListener = notificationListClickListener;

    }

    @Override
    public void onClick(View view) {
        GetContactSettingsResponse.Contact readerGetCasesHistoryResponse = (GetContactSettingsResponse.Contact) view.getTag();
       /* Intent i = new Intent(mContext, CaseDetailActivity.class);
        i.putExtra(StringUtils.CASE_NUMBER, readerGetCasesHistoryResponse.getCaseId());
        mContext.startActivity(i);*/
    }


    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.contact_list_item, parent,false);
        return (new ViewHolder(itemLayoutView));
    }


    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {

        final GetContactSettingsResponse.Contact data = mNotificationList.get(position);
        if (data != null) {

            holder.messageTv.setText(data.getNumber());
            holder.titleTv.setText(data.getName());
           // holder.dateTv.setText(data.getNotificationDateTime());


            holder.mainRl.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {

                    notificationListClickListener.onContactClicked(data);
                }
            });

            holder.tvDelete.setOnClickListener(new View.OnClickListener() {
                @Override
                public void onClick(View view) {

                    mNotificationList.remove(position);

                    holder.swipeLayout.close(true);
                    notificationListClickListener.removeContactClicked(data);

                }
            });

            holder.swipeLayout.setShowMode(SwipeLayout.ShowMode.PullOut);
            holder.swipeLayout.addDrag(SwipeLayout.DragEdge.Right, holder.swipeLayout.findViewById(R.id.bottom_wrapper));
            holder.swipeLayout.setLeftSwipeEnabled(false);

            mItemManger.bindView(holder.itemView, position);

        }
    }

    public void addAll(List<GetContactSettingsResponse.Contact> notifications) {
        mNotificationList.clear();
        mNotificationList.addAll(notifications);
        notifyDataSetChanged();
    }
    public void add(GetContactSettingsResponse.Contact notifications) {
        mNotificationList.add(notifications);
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
        void onContactClicked(GetContactSettingsResponse.Contact data);
        void removeContactClicked(GetContactSettingsResponse.Contact contact);
    }

    public List<GetContactSettingsResponse.Contact> getContactList()
    {
        return mNotificationList;
    }
 }