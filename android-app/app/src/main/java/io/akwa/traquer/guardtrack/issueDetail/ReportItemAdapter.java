package io.akwa.traquer.guardtrack.issueDetail;

import android.content.Context;
import android.support.v7.widget.RecyclerView;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.RelativeLayout;
import android.widget.TextView;

import java.util.List;

import io.akwa.traquer.guardtrack.R;

public class ReportItemAdapter extends RecyclerView.Adapter<ReportItemAdapter.ViewHolder> {


    private final Context mContext;
    private List<ItemReportIssue> mDataList;
    private CommentImageClickListener listener;

    public ReportItemAdapter(Context context, List<ItemReportIssue> dataList) {
        mDataList = dataList;
        mContext = context;
    }


    @Override
    public ReportItemAdapter.ViewHolder onCreateViewHolder(ViewGroup parent, int viewType) {
        View itemLayoutView = LayoutInflater.from(parent.getContext())
                .inflate(R.layout.select_item_report_list, parent, false);
        return (new ViewHolder(itemLayoutView));
    }

    @Override
    public void onBindViewHolder(final ReportItemAdapter.ViewHolder holder, int position) {
        final ItemReportIssue item = mDataList.get(position);
        holder.mItemName.setText(item.getL2());
        holder.mItemId.setText(item.getL1());
        holder.mIsSelected.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                onItemClick(item, holder);
            }
        });
        holder.mOuter.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                onItemClick(item, holder);
            }
        });

    }

    private void onItemClick(ItemReportIssue item, ViewHolder holder) {
        if (item.isSelected()) {
            item.setSelected(false);
            holder.mIsSelected.setImageResource(R.drawable.check_off);
        } else {
            item.setSelected(true);
            holder.mIsSelected.setImageResource(R.drawable.check_on);
        }
    }

    @Override
    public int getItemCount() {
        if (mDataList != null) {
            return mDataList.size();
        } else {
            return 0;

        }
    }

    public List<ItemReportIssue> getmDataList() {
        return mDataList;
    }

    public void setdata(List<ItemReportIssue> issueImages) {
        mDataList.clear();
        mDataList.addAll(issueImages);
        notifyDataSetChanged();
    }

    public class ViewHolder extends RecyclerView.ViewHolder {

        ImageView mIsSelected;
        TextView mItemId, mItemName;
        RelativeLayout mOuter;

        public ViewHolder(View itemView) {
            super(itemView);
            mItemId = (TextView) itemView.findViewById(R.id.tv_item_id);
            mItemName = (TextView) itemView.findViewById(R.id.tv_item_name);
            mIsSelected = (ImageView) itemView.findViewById(R.id.iv_select);
            mOuter = (RelativeLayout) itemView.findViewById(R.id.rl_item);
        }
    }

    public interface CommentImageClickListener {
        void onImageClick(String url);
    }
}
