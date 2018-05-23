package io.akwa.traquer.guardtrack.ui.guardtrack.history;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.LinearLayout;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.List;

import io.akwa.traquer.guardtrack.R;
import io.akwa.traquer.guardtrack.common.utils.DateFormater;
import io.akwa.traquer.guardtrack.model.ReaderGetNotificationsResponse;
import io.akwa.traquer.guardtrack.ui.guardtrack.data.Datum;

/**
 * Created by rohitkumar on 1/9/18.
 */

public class HistoryAdapter extends RecyclerView.Adapter<HistoryAdapter.ViewHolder> {


    List<Datum> recentHistoryList;
    private Context mContext;
    ItemClickListener itemClickListener;

    public HistoryAdapter(Context context, List<Datum> recentHistoryList, ItemClickListener itemClickListener) {
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
    public HistoryAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.history_list_item, parent, false);

        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(final HistoryAdapter.ViewHolder viewHolder, final int position) {
        if (recentHistoryList != null) {
            viewHolder.txtTitle.setText(recentHistoryList.get(position).getTask().getName()+" - "+recentHistoryList.get(position).getTourId());
            //viewHolder.txtID.setText(recentHistoryList.get(position).getTourId());
            viewHolder.txtID.setVisibility(View.GONE);
          //  viewHolder.txtDate.setText(recentHistoryList.get(position).getFrom()+"-"+recentHistoryList.get(position).getTo());
            viewHolder.txtFromDate.setText("From: "+DateFormater.getDateTime(recentHistoryList.get(position).getFrom()));
            if(recentHistoryList.get(position).getTo()!=null&&!recentHistoryList.get(position).getTo().equals("")) {
                viewHolder.txtToDate.setText("To: " + DateFormater.getDateTime(recentHistoryList.get(position).getTo()));
            }
            else {
                viewHolder.txtToDate.setText("");
            }
            if(recentHistoryList.get(position).getTourStatus()==10)
            {
                viewHolder.imgView.setImageResource(R.drawable.blue_circle);
            }
            else if(recentHistoryList.get(position).getTourStatus()==20)
            {
                viewHolder.imgView.setImageResource(R.drawable.green_ball);
            }
            else if(recentHistoryList.get(position).getTourStatus()==30)
            {
                viewHolder.imgView.setImageResource(R.drawable.red_ball);
            }
            else
            {
                viewHolder.imgView.setVisibility(View.GONE);
            }

            // viewHolder.txtTime.setText("Time - "+DateFormater.getDateTime(recentHistoryList.get(position).getTo()));
           if(recentHistoryList.get(position).getDuration()!=null) {
                String s = DateFormater.convertEpochToHMmSs(recentHistoryList.get(position).getDuration());
                viewHolder.txtTime.setText(s);
            }

        }


        viewHolder.rl_main.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                itemClickListener.onItemClicked(recentHistoryList.get(position));
            }
        });


    }

    public void addAll(List<Datum> notifications) {
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
        ImageView imgView;


        public ViewHolder(View itemView) {
            super(itemView);
            txtTitle = (TextView) itemView.findViewById(R.id.tv_title);
            txtFromDate = (TextView) itemView.findViewById(R.id.txtFromDate);
            txtToDate = (TextView) itemView.findViewById(R.id.txtToDate);
            txtTime= (TextView) itemView.findViewById(R.id.txtTime);
            imgView= (ImageView) itemView.findViewById(R.id.imgIndicator);
            txtID= (TextView) itemView.findViewById(R.id.txtID);
            rl_main=(LinearLayout) itemView.findViewById(R.id.rl_main);

        }
    }

    public interface ItemClickListener {
        void onItemClicked(Datum data);
    }

}