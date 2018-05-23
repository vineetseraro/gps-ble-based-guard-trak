package io.akwa.traquer.guardtrack.ui.guardtrack.history.tour.tour;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.LinearLayout;
import android.widget.TextView;

import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.TourData;

/**
 * Created by rohitkumar on 1/9/18.
 */

public class TourAdapter extends RecyclerView.Adapter<TourAdapter.ViewHolder> {


    List<TourData> recentHistoryList;
    private Context mContext;
    ItemClickListener itemClickListener;

    public TourAdapter(Context context, List<TourData> recentHistoryList, ItemClickListener itemClickListener) {
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
    public TourAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.tour_list_itme, parent, false);

        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(final TourAdapter.ViewHolder viewHolder, final int position) {
        if (recentHistoryList != null) {
            viewHolder.txtTitle.setText(recentHistoryList.get(position).getTour().getName());
            viewHolder.txtID.setText("TourId: "+recentHistoryList.get(position).getTour().getTourId());
          //  viewHolder.txtDate.setText(recentHistoryList.get(position).getFrom()+"-"+recentHistoryList.get(position).getTo());
            viewHolder.txtFromDate.setText("Action Type: "+recentHistoryList.get(position).getAction().getActionType());
            viewHolder.txtToDate.setText("Action Time: "+DateFormater.getDateTime(recentHistoryList.get(position).getAction().getActionDate()));
           // viewHolder.txtTime.setText("Time - "+DateFormater.getDateTime(recentHistoryList.get(position).getTo()));
          /* if(recentHistoryList.get(position).getDuration()!=null) {
                String s = DateFormater.convertEpochToHMmSs(recentHistoryList.get(position).getDuration());
                viewHolder.txtTime.setText(s);
            }*/

        }


        viewHolder.rl_main.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                itemClickListener.onItemClicked(recentHistoryList.get(position));
            }
        });


    }

    public void addAll(List<TourData> notifications) {
        recentHistoryList.clear();
        recentHistoryList.addAll(notifications);
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        TextView txtTitle;
        TextView txtFromDate;
        TextView txtToDate;
        TextView txtTime;
        TextView txtID;

        LinearLayout rl_main;


        public ViewHolder(View itemView) {
            super(itemView);
            txtTitle = (TextView) itemView.findViewById(R.id.tv_title);
            txtFromDate = (TextView) itemView.findViewById(R.id.txtFromDate);
            txtToDate = (TextView) itemView.findViewById(R.id.txtToDate);
            txtTime= (TextView) itemView.findViewById(R.id.txtTime);
            txtID= (TextView) itemView.findViewById(R.id.txtID);
            rl_main=(LinearLayout) itemView.findViewById(R.id.rl_main);

        }
    }

    public interface ItemClickListener {
        void onItemClicked(TourData data);
    }

}