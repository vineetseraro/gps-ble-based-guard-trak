package io.akwa.traquer.guardtrack.ui.guardtrack;

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
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.model.ReaderGetNotificationsResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;
import io.akwa.traquer.guardtrack.ui.notification.NotificationListAdapter;

/**
 * Created by rohitkumar on 1/9/18.
 */

public class ScheduleAdapter extends RecyclerView.Adapter<ScheduleAdapter.ViewHolder> {


    List<Datum> recentHistoryList;
    private Context mContext;
    ItemClickListener itemClickListener;

    public ScheduleAdapter(Context context, List<Datum> recentHistoryList, ItemClickListener itemClickListener) {
        this.mContext = context;
        this.recentHistoryList = recentHistoryList;
        this.itemClickListener = itemClickListener;
    }


    @Override
    public int getItemCount() {
        if (recentHistoryList != null)
            return recentHistoryList.size();
        return 0;
    }

    @Override
    public ScheduleAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.gurad_schedule_item_layout, parent, false);

        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(final ScheduleAdapter.ViewHolder viewHolder, final int position) {
        if (recentHistoryList != null) {
            viewHolder.txtTitle.setText(recentHistoryList.get(position).getName());
          //  viewHolder.txtDate.setText(recentHistoryList.get(position).getFrom()+"-"+recentHistoryList.get(position).getTo());
            viewHolder.txtDate.setText(DateFormater.getDateTime(recentHistoryList.get(position).getFrom())+" - "+DateFormater.getDateTime(recentHistoryList.get(position).getTo()));

        }


        viewHolder.rl_main.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                itemClickListener.onItemClicked(recentHistoryList.get(position));
            }
        });


    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        TextView txtTitle;
        TextView txtDate;
        TextView txtMessage;

        RelativeLayout rl_main;


        public ViewHolder(View itemView) {
            super(itemView);
            txtTitle = (TextView) itemView.findViewById(R.id.tv_title);
            txtDate = (TextView) itemView.findViewById(R.id.tv_date);
            txtMessage = (TextView) itemView.findViewById(R.id.tv_message);
            rl_main=(RelativeLayout) itemView.findViewById(R.id.rl_main);

        }
    }

    public interface ItemClickListener {
        void onItemClicked(Datum data);
    }

}