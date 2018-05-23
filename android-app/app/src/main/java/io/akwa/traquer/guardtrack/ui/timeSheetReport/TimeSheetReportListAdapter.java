package io.akwa.traquer.guardtrack.ui.timeSheetReport;

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
import io.akwa.traquer.guardtrack.ui.timeSheetReport.model.TimeSheetReportItem;


public class TimeSheetReportListAdapter extends RecyclerSwipeAdapter<TimeSheetReportListAdapter.ViewHolder> {

    private ArrayList<TimeSheetReportItem> TimeSheetList;
    private Context mContext;


    public TimeSheetReportListAdapter(Context context, ArrayList<TimeSheetReportItem> caseHistoryList) {
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

        final TimeSheetReportItem data = TimeSheetList.get(position);
        if (data != null) {

            holder.messageTv.setText("First In: "+data.getFirstIn());
            holder.titleTv.setText(data.getDate());
            holder.dateTv.setText("Last Out: "+data.getLastOut());

           

//            holder.swipeLayout.setShowMode(SwipeLayout.ShowMode.PullOut);
//            holder.swipeLayout.addDrag(SwipeLayout.DragEdge.Right, holder.swipeLayout.findViewById(R.id.bottom_wrapper));
//            holder.swipeLayout.setLeftSwipeEnabled(false);

            mItemManger.bindView(holder.itemView, position);

        }
    }

    public void addAll(List<TimeSheetReportItem> notifications) {
        TimeSheetList.clear();
        TimeSheetList.addAll(notifications);
        TimeSheetList.remove(new TimeSheetReportItem());
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