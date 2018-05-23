package io.akwa.traquer.guardtrack.ui.timeSheetDetail;

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
import io.akwa.traquer.guardtrack.ui.timeSheetDetail.model.TimeSheetDetailItem;


public class TimeSheetDetailListAdapter extends RecyclerSwipeAdapter<TimeSheetDetailListAdapter.ViewHolder> {

    private ArrayList<TimeSheetDetailItem> TimeSheetList;
    private Context mContext;


    public TimeSheetDetailListAdapter(Context context, ArrayList<TimeSheetDetailItem> caseHistoryList) {
        this.TimeSheetList = caseHistoryList;
        this.mContext = context;

    }


    @Override
    public ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.notification_item, parent,false);
        return (new ViewHolder(itemLayoutView));
    }


    @Override
    public void onBindViewHolder(final ViewHolder holder, final int position) {

        final TimeSheetDetailItem data = TimeSheetList.get(position);
        if (data != null) {

            holder.messageTv.setText("In: "+data.getEntryTime());
            holder.titleTv.setText(data.getName());
            holder.dateTv.setText("Out: " +data.getExitTime());

           

//            holder.swipeLayout.setShowMode(SwipeLayout.ShowMode.PullOut);
//            holder.swipeLayout.addDrag(SwipeLayout.DragEdge.Right, holder.swipeLayout.findViewById(R.id.bottom_wrapper));
//            holder.swipeLayout.setLeftSwipeEnabled(false);

            mItemManger.bindView(holder.itemView, position);

        }
    }

    public void addAll(List<TimeSheetDetailItem> notifications) {
        TimeSheetList.clear();
        TimeSheetList.addAll(notifications);
        TimeSheetList.remove(new TimeSheetDetailItem());
        notifyDataSetChanged();
    }

    @Override
    public int getItemCount() {
        if (TimeSheetList != null)
            return TimeSheetList.size();
        return 0;
    }

    @Override
    public int getSwipeLayoutResourceId(int position) {
        return R.id.swipe;
    }

    public void clearAll() {
        TimeSheetList.clear();
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
}